
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { Job } from '@/types/job';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';

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
  const markerClusterRef = useRef<L.MarkerClusterGroup | null>(null);

  // Fonction pour obtenir les coordonnées à partir de l'adresse
  const getCoordinates = async (location: string): Promise<[number, number] | null> => {
    try {
      // Pour l'exemple, on utilise des coordonnées fixes pour certaines villes
      const coordinates: { [key: string]: [number, number] } = {
        'Paris': [48.8566, 2.3522],
        'Lyon': [45.7578, 4.8320],
        'Marseille': [43.2965, 5.3698],
        'Montréal': [45.5017, -73.5673],
        'Québec': [46.8139, -71.2080],
        'Toronto': [43.6532, -79.3832],
      };

      // Chercher une correspondance approximative
      const city = Object.keys(coordinates).find(
        city => location.toLowerCase().includes(city.toLowerCase())
      );

      return city ? coordinates[city] : null;
    } catch (error) {
      console.error('Erreur lors de la géocodification:', error);
      return null;
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialiser la carte centrée sur Montréal
    map.current = L.map(mapContainer.current).setView([45.5017, -73.5673], 9);

    // Ajouter les tuiles OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Initialiser le groupe de marqueurs avec MarkerClusterGroup
    markerClusterRef.current = new L.MarkerClusterGroup();
    map.current.addLayer(markerClusterRef.current);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!map.current || !markerClusterRef.current) return;

    // Supprimer les marqueurs existants
    markerClusterRef.current.clearLayers();
    markersRef.current = [];

    // Ajouter les nouveaux marqueurs
    const bounds = L.latLngBounds([]);
    let hasValidMarkers = false;

    // Traiter tous les emplois de manière asynchrone
    Promise.all(
      jobs.map(async (job) => {
        const coordinates = await getCoordinates(job.location);
        if (!coordinates) return;

        const [lat, lng] = coordinates;

        // Créer le contenu HTML personnalisé pour le popup
        const popupContent = document.createElement('div');
        popupContent.className = 'p-4 max-w-sm';
        popupContent.innerHTML = `
          <div class="space-y-2">
            <h3 class="font-semibold text-lg">${job.title}</h3>
            <div class="flex items-center gap-2 text-sm">
              <span class="font-medium">${job.company}</span>
              <span class="text-muted-foreground">•</span>
              <span class="text-muted-foreground">${job.location}</span>
            </div>
            ${job.salary ? `
              <div class="text-sm font-medium">
                Salaire: ${job.salary}
              </div>
            ` : ''}
            <div class="flex flex-wrap gap-1 mt-2">
              ${(job.skills || []).slice(0, 3).map(skill => `
                <span class="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  ${skill}
                </span>
              `).join('')}
            </div>
            <div class="text-xs text-muted-foreground mt-2">
              Publié ${formatDistance(new Date(job.created_at || new Date()), new Date(), {
                addSuffix: true,
                locale: fr
              })}
            </div>
            <button 
              class="mt-3 w-full bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
              onclick="window.dispatchEvent(new CustomEvent('selectJob', { detail: '${job.id}' }))"
            >
              Voir les détails
            </button>
          </div>
        `;

        // Créer et ajouter le marqueur
        const marker = L.marker([lat, lng])
          .bindPopup(popupContent, {
            maxWidth: 300,
            className: 'custom-popup'
          });

        markerClusterRef.current?.addLayer(marker);
        markersRef.current.push(marker);
        bounds.extend([lat, lng]);
        hasValidMarkers = true;
      })
    ).then(() => {
      // Ajuster la vue de la carte si des marqueurs valides existent
      if (hasValidMarkers && bounds.getNorth() !== bounds.getSouth()) {
        map.current?.fitBounds(bounds, { padding: [50, 50] });
      }
    });
  }, [jobs]);

  // Gérer la sélection d'emploi depuis le popup
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
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden border bg-background">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute bottom-4 right-4 z-[400] bg-background/80 backdrop-blur-sm p-3 rounded-lg shadow-lg text-sm">
        <p className="font-medium">{jobs.length} offre{jobs.length > 1 ? 's' : ''} disponible{jobs.length > 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}
