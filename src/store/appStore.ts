
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JobFilters } from '@/types/filters';
import { Friend, UserProfile } from '@/types/profile';

interface AppState {
  searchQuery: string;
  currentRoute: string;
  activeFilters: JobFilters;
  selectedFriends: Friend[];
  mediaCache: Record<string, string>;
  mediaUploadQueue: File[];
  isOffline: boolean;
  lastSync: string;
  setSearchQuery: (query: string) => void;
  setCurrentRoute: (route: string) => void;
  setActiveFilters: (filters: JobFilters) => void;
  setSelectedFriends: (friends: Friend[]) => void;
  addToMediaCache: (key: string, url: string) => void;
  addToUploadQueue: (file: File) => void;
  removeFromUploadQueue: (file: File) => void;
  setOfflineStatus: (status: boolean) => void;
  updateLastSync: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      searchQuery: '',
      currentRoute: '/',
      activeFilters: {},
      selectedFriends: [],
      mediaCache: {},
      mediaUploadQueue: [],
      isOffline: false,
      lastSync: new Date().toISOString(),

      setSearchQuery: (query) => set({ searchQuery: query }),
      setCurrentRoute: (route) => set({ currentRoute: route }),
      setActiveFilters: (filters) => set({ activeFilters: filters }),
      setSelectedFriends: (friends) => set({ selectedFriends: friends }),
      
      addToMediaCache: (key, url) => 
        set((state) => ({
          mediaCache: { ...state.mediaCache, [key]: url }
        })),
        
      addToUploadQueue: (file) =>
        set((state) => ({
          mediaUploadQueue: [...state.mediaUploadQueue, file]
        })),
        
      removeFromUploadQueue: (file) =>
        set((state) => ({
          mediaUploadQueue: state.mediaUploadQueue.filter(f => f !== file)
        })),
        
      setOfflineStatus: (status) => set({ isOffline: status }),
      updateLastSync: () => set({ lastSync: new Date().toISOString() }),
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        searchQuery: state.searchQuery,
        activeFilters: state.activeFilters,
        mediaCache: state.mediaCache,
      }),
    }
  )
);
