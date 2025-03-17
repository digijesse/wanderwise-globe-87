
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TravelItinerary } from "@/types";
import { Globe } from "@/components/ui/globe";
import TravelChat from "@/components/TravelChat";
import TripItinerary from "@/components/TripItinerary";

const Index = () => {
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [showItinerary, setShowItinerary] = useState(false);
  const [globeTransitioning, setGlobeTransitioning] = useState(false);

  const handleItineraryGenerated = (newItinerary: TravelItinerary) => {
    setItinerary(newItinerary);
    setGlobeTransitioning(true);
    
    // Start transition animation with a zoom effect
    setTimeout(() => {
      setShowItinerary(true);
      // Give time for the animation to complete before resetting state
      setTimeout(() => {
        setGlobeTransitioning(false);
      }, 1000);
    }, 1000);
  };

  const handleBackToChat = () => {
    setGlobeTransitioning(true);
    
    // Start transition animation back to globe with reverse zoom effect
    setTimeout(() => {
      setShowItinerary(false);
      // Give time for the animation to complete before resetting state
      setTimeout(() => {
        setGlobeTransitioning(false);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
      
      <div className="relative container mx-auto flex flex-col h-screen">
        <header className="py-6">
          <motion.h1 
            className="text-2xl font-medium text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            WanderWise
          </motion.h1>
        </header>
        
        <main className="flex-1 relative flex items-center justify-center">
          {/* Globe component - positioned in the background */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <motion.div
              initial={false}
              animate={{
                scale: globeTransitioning ? (showItinerary ? 2 : 0.7) : 1,
                opacity: globeTransitioning ? 0.3 : 1,
                y: globeTransitioning && showItinerary ? -50 : 0,
              }}
              transition={{ 
                duration: 1.5, 
                ease: "easeInOut",
                scale: { type: "spring", stiffness: 100 }
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <Globe />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none"></div>
          </div>
          
          {/* Content overlay */}
          <div className="relative z-20 w-full h-full max-w-2xl mx-auto">
            <AnimatePresence mode="wait">
              {showItinerary ? (
                <motion.div
                  key="itinerary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ 
                    duration: 0.4,
                    delay: 0.5 // Give time for the globe animation to start
                  }}
                  className="h-full"
                >
                  {itinerary && (
                    <TripItinerary 
                      itinerary={itinerary} 
                      onBack={handleBackToChat}
                    />
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="w-full max-w-md">
                    <TravelChat onItineraryGenerated={handleItineraryGenerated} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        
        <footer className="py-4 text-center text-xs text-muted-foreground">
          <p>© 2023 WanderWise. Your perfect travel companion.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
