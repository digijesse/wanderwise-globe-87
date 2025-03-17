
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TravelDestination } from "@/types";

interface MapboxMapProps {
  destinations: TravelDestination[];
  animateIn?: boolean;
  selectedDestination?: number;
}

// Set the Mapbox token directly
mapboxgl.accessToken = "pk.eyJ1IjoiZ2VuamVzcyIsImEiOiJjbTZsc2FwemYwYmo4MmtweW8ybHpyYnpkIn0.rtyPr333XpXs9etZcWM3Qg";

export default function MapboxMap({ 
  destinations, 
  animateIn = false,
  selectedDestination = 0
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Initialize Mapbox map
    if (!map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      destinations.forEach(destination => {
        bounds.extend([destination.lng, destination.lat]);
      });
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: bounds.isEmpty() ? [0, 20] : bounds.getCenter(),
        zoom: 2,
        pitch: animateIn ? 60 : 30,
        bearing: 0,
        antialias: true
      });
      
      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
      
      // Wait for map to load
      map.current.on("load", () => {
        if (!map.current) return;
        setMapReady(true);
        
        // Add markers for each destination
        destinations.forEach((destination, index) => {
          // Create custom marker element
          const markerEl = document.createElement("div");
          markerEl.className = "relative";
          markerEl.innerHTML = `
            <div class="w-5 h-5 bg-primary rounded-full shadow-md flex items-center justify-center text-white text-xs font-bold">
              ${index + 1}
            </div>
            <div class="absolute -bottom-1 left-1/2 w-0 h-0 
              border-l-8 border-l-transparent 
              border-t-8 border-primary 
              border-r-8 border-r-transparent 
              -translate-x-1/2"></div>
          `;
          
          // Add popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-bold text-sm">${destination.name}</h3>
                <p class="text-xs text-gray-600">${destination.days} day${destination.days !== 1 ? 's' : ''}</p>
              </div>
            `);
          
          // Add marker to map
          const marker = new mapboxgl.Marker(markerEl)
            .setLngLat([destination.lng, destination.lat])
            .setPopup(popup)
            .addTo(map.current!);
          
          markers.current.push(marker);
          
          // Extend bounds to include this location
          bounds.extend([destination.lng, destination.lat]);
        });
        
        // Create route lines between destinations
        if (destinations.length > 1) {
          // Add a layer showing the route
          map.current.addSource("route", {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: destinations.map(dest => [dest.lng, dest.lat])
              }
            }
          });
          
          map.current.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": "#0284c7",
              "line-width": 3,
              "line-opacity": 0.8,
              "line-dasharray": [0.2, 2]
            }
          });
        }
        
        // Fit map to include all markers with padding
        if (!bounds.isEmpty()) {
          map.current.fitBounds(bounds, {
            padding: 70,
            maxZoom: 10,
            duration: 2000
          });
        }
        
        // Add fly animation if requested
        if (animateIn && destinations.length > 0) {
          // Fly to the first destination
          setTimeout(() => {
            map.current?.flyTo({
              center: [destinations[0].lng, destinations[0].lat],
              zoom: 11,
              pitch: 60,
              bearing: 30,
              duration: 3000,
              essential: true
            });
          }, 1000);
        } else if (destinations.length > 0) {
          // Fly to the selected destination
          flyToDestination(selectedDestination);
        }
      });
    }
    
    return () => {
      markers.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, [destinations, animateIn]);

  // Function to fly to a specific destination
  const flyToDestination = (index: number) => {
    if (!map.current || !mapReady) return;
    
    const destination = destinations[index];
    if (destination) {
      // Open the popup for the selected marker
      if (markers.current[index]) {
        markers.current[index].togglePopup();
      }
      
      // Fly to the selected destination
      map.current.flyTo({
        center: [destination.lng, destination.lat],
        zoom: 13,
        pitch: 60,
        bearing: Math.random() * 60 - 30, // Random bearing between -30 and 30 degrees
        duration: 2000,
        essential: true
      });
    }
  };

  // Effect for handling selected destination changes
  useEffect(() => {
    flyToDestination(selectedDestination);
  }, [selectedDestination, mapReady]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
    </div>
  );
}
