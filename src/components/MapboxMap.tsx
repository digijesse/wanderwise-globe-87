
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { TravelDestination } from "@/types";

interface MapboxMapProps {
  destinations: TravelDestination[];
  animateIn?: boolean;
}

export default function MapboxMap({ destinations, animateIn = false }: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");

  useEffect(() => {
    // In a production app, this would come from environment variables or Supabase secrets
    // For demo purposes, we'll use this approach
    if (!mapboxToken) return;
    
    if (!mapContainer.current) return;
    
    // Initialize Mapbox map
    mapboxgl.accessToken = mapboxToken;
    
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
        new mapboxgl.Marker(markerEl)
          .setLngLat([destination.lng, destination.lat])
          .setPopup(popup)
          .addTo(map.current);
        
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
        // First flyTo the first destination
        setTimeout(() => {
          map.current?.flyTo({
            center: [destinations[0].lng, destinations[0].lat],
            zoom: 11,
            pitch: 45,
            bearing: 30,
            duration: 3000,
            easing: (t) => t
          });
        }, 1000);
      }
    });
    
    return () => {
      map.current?.remove();
    };
  }, [destinations, mapboxToken, animateIn]);

  return (
    <div className="w-full h-full flex flex-col">
      {!mapboxToken ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <div className="bg-background/80 p-4 rounded-lg shadow-md max-w-md w-full">
            <h3 className="font-medium mb-2">Enter your Mapbox token</h3>
            <p className="text-sm text-muted-foreground mb-3">
              To see the map, please enter your Mapbox public token
            </p>
            <input 
              type="text" 
              placeholder="pk.eyJ1Ijoie3VzZXJuYW1lfSI..." 
              className="w-full p-2 border rounded-md mb-2"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Get your free token at <a href="https://mapbox.com" target="_blank" rel="noreferrer" className="text-primary">mapbox.com</a>
            </p>
          </div>
        </div>
      ) : (
        <div className="relative flex-1">
          <div ref={mapContainer} className="absolute inset-0 rounded-lg" />
        </div>
      )}
    </div>
  );
}
