
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Job } from '@/types/job';

// Fix for Leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface JobsMapProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

export function JobsMap({ jobs, onJobSelect }: JobsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map centered on Montreal
    map.current = L.map(mapContainer.current).setView([45.5017, -73.5673], 9);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each job
    const bounds = L.latLngBounds([]);
    
    jobs.forEach(job => {
      if (job.latitude && job.longitude) {
        // Create custom popup content
        const popupContent = document.createElement('div');
        popupContent.className = 'p-2';
        popupContent.innerHTML = `
          <h3 class="font-semibold">${job.title}</h3>
          <p class="text-sm text-muted-foreground">${job.company || ''}</p>
          <button 
            class="mt-2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm cursor-pointer hover:bg-primary/90 transition-colors"
            onclick="window.dispatchEvent(new CustomEvent('selectJob', { detail: '${job.id}' }))"
          >
            Voir l'offre
          </button>
        `;

        // Create marker
        const marker = L.marker([job.latitude, job.longitude])
          .bindPopup(popupContent)
          .addTo(map.current!);

        markersRef.current.push(marker);
        bounds.extend([job.latitude, job.longitude]);
      }
    });

    // Fit bounds if there are markers
    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [jobs]);

  // Handle job selection from popup
  useEffect(() => {
    const handleJobSelect = (event: CustomEvent<string>) => {
      const selectedJob = jobs.find(job => job.id === event.detail);
      if (selectedJob) {
        onJobSelect(selectedJob);
      }
    };

    window.addEventListener('selectJob', handleJobSelect as EventListener);
    return () => window.removeEventListener('selectJob', handleJobSelect as EventListener);
  }, [jobs, onJobSelect]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}
