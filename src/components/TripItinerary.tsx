
import { motion } from "framer-motion";
import { TravelItinerary } from "@/types";
import { WorldMap } from "@/components/ui/world-map";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface TripItineraryProps {
  itinerary: TravelItinerary;
  onBack: () => void;
}

export default function TripItinerary({ itinerary, onBack }: TripItineraryProps) {
  // Create connections between consecutive destinations
  const connections = itinerary.destinations.slice(0, -1).map((start, i) => {
    const end = itinerary.destinations[i + 1];
    return {
      start: { lat: start.lat, lng: start.lng, label: start.name },
      end: { lat: end.lat, lng: end.lng, label: end.name },
    };
  });

  return (
    <motion.div 
      className="w-full h-full flex flex-col space-y-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft size={18} />
        </Button>
        <div>
          <h1 className="text-2xl font-medium">{itinerary.title}</h1>
          <p className="text-sm text-muted-foreground">{itinerary.subtitle}</p>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col space-y-6">
        <Card className="p-4 h-[250px] shadow-sm border border-border/50 relative overflow-hidden">
          <WorldMap 
            dots={connections}
            lineColor="#0284c7"
          />
        </Card>
        
        <p className="text-sm text-muted-foreground px-1">{itinerary.summary}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
          {itinerary.destinations.map((destination, index) => (
            <Card 
              key={destination.name} 
              className="overflow-hidden border border-border/50"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{destination.name}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                    {destination.days} {destination.days === 1 ? 'day' : 'days'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{destination.description}</p>
              </motion.div>
            </Card>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
