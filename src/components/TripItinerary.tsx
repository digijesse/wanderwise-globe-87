
import { motion } from "framer-motion";
import { TravelItinerary } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Map } from "lucide-react";
import MapboxMap from "@/components/MapboxMap";
import { useState } from "react";
import { WorldMap } from "@/components/ui/world-map";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";

interface TripItineraryProps {
  itinerary: TravelItinerary;
  onBack: () => void;
}

export default function TripItinerary({ itinerary, onBack }: TripItineraryProps) {
  const [selectedDestination, setSelectedDestination] = useState(0);
  
  const handleDestinationSelect = (index: number) => {
    setSelectedDestination(index);
  };

  // Prepare data for the WorldMap
  const mapDots = itinerary.destinations.reduce((acc, curr, idx, arr) => {
    if (idx < arr.length - 1) {
      acc.push({
        start: { lat: curr.lat, lng: curr.lng, label: curr.name },
        end: { lat: arr[idx + 1].lat, lng: arr[idx + 1].lng, label: arr[idx + 1].name }
      });
    }
    return acc;
  }, [] as Array<{
    start: { lat: number; lng: number; label?: string };
    end: { lat: number; lng: number; label?: string };
  }>);

  return (
    <motion.div 
      className="w-full h-full flex flex-col space-y-6 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Background World Map */}
      <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none overflow-hidden">
        <WorldMap dots={mapDots} lineColor="#0ea5e9" />
      </div>

      <div className="flex items-center justify-between">
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
      </div>
      
      <div className="flex-1 flex flex-col space-y-6">
        <Card className="p-4 h-[250px] shadow-sm border border-border/50 relative overflow-hidden">
          <MapboxMap 
            destinations={itinerary.destinations} 
            animateIn={true}
            selectedDestination={selectedDestination}
          />
        </Card>
        
        <p className="text-sm text-muted-foreground px-1 bg-background/80 backdrop-blur-sm p-2 rounded-lg">{itinerary.summary}</p>
        
        {/* Horizontal Timeline */}
        <div className="w-full">
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full"
          >
            <CarouselContent>
              {itinerary.destinations.map((destination, index) => (
                <CarouselItem key={index} className="md:basis-1/3 lg:basis-1/4">
                  <Card 
                    className={`overflow-hidden border transition-all duration-300 h-full ${
                      selectedDestination === index 
                        ? "border-primary shadow-md ring-1 ring-primary" 
                        : "border-border/50"
                    }`}
                    onClick={() => handleDestinationSelect(index)}
                  >
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="p-4 cursor-pointer h-full"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">
                          <span className="inline-block w-5 h-5 bg-primary/10 text-primary rounded-full text-xs flex items-center justify-center mr-1.5">
                            {index + 1}
                          </span>
                          {destination.name}
                        </h3>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {destination.days} {destination.days === 1 ? 'day' : 'days'}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{destination.description}</p>
                    </motion.div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-1 mt-2">
              <CarouselPrevious className="static transform-none h-8 w-8 rounded-full" />
              <CarouselNext className="static transform-none h-8 w-8 rounded-full" />
            </div>
          </Carousel>
        </div>
        
        {/* Selected Destination Details */}
        <Card className="p-4 border border-border/50 bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col space-y-2">
            <h3 className="text-lg font-medium">{itinerary.destinations[selectedDestination].name}</h3>
            <p className="text-sm text-muted-foreground">
              {itinerary.destinations[selectedDestination].description}
            </p>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
