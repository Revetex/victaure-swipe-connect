
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Job } from '@/types/job';
import { useToast } from '@/components/ui/use-toast';

interface JobsMapProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

export function JobsMap({ jobs, onJobSelect }: JobsMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    
    if (!mapboxgl.accessToken) {
      toast({
        variant: "destructive",
        title: "Erreur de configuration",
        description: "La clé d'API Mapbox n'est pas configurée"
      });
      return;
    }

    // Center on Montreal by default
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-73.5673, 45.5017],
      zoom: 9
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Clean up
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each job
    jobs.forEach(job => {
      if (job.latitude && job.longitude) {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'job-marker';
        el.innerHTML = `
          <div class="bg-primary text-primary-foreground px-2 py-1 rounded-lg shadow-lg text-sm whitespace-nowrap">
            ${job.title}
          </div>
        `;

        // Create and add the marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat([job.longitude, job.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-semibold">${job.title}</h3>
                  <p class="text-sm text-muted-foreground">${job.company}</p>
                  <button 
                    class="mt-2 bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm"
                    onclick="window.dispatchEvent(new CustomEvent('selectJob', { detail: '${job.id}' }))"
                  >
                    Voir l'offre
                  </button>
                </div>
              `)
          )
          .addTo(map.current);

        markersRef.current.push(marker);
      }
    });

    // Fit bounds to show all markers if there are any jobs with coordinates
    const jobsWithCoordinates = jobs.filter(job => job.latitude && job.longitude);
    if (jobsWithCoordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      jobsWithCoordinates.forEach(job => {
        if (job.latitude && job.longitude) {
          bounds.extend([job.longitude, job.latitude]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50 });
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
    <div className="relative w-full h-[600px]">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
      <style jsx>{`
        :global(.job-marker) {
          cursor: pointer;
          transition: transform 0.2s;
        }
        :global(.job-marker:hover) {
          transform: scale(1.1);
        }
        :global(.mapboxgl-popup-content) {
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
}
