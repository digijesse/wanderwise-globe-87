
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Message, TravelItinerary } from "@/types";
import { cn } from "@/lib/utils";
import ChatBubble from "./ChatBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MapPin, Palmtree, Snowflake, Sun, CalendarDays } from "lucide-react";

interface TravelChatProps {
  className?: string;
  onItineraryGenerated: (itinerary: TravelItinerary) => void;
}

// Quick reply options based on conversation stage
const quickRepliesMap = {
  initial: [
    { text: "I want to visit cities", icon: <MapPin size={16} /> },
    { text: "I prefer nature", icon: <Palmtree size={16} /> },
    { text: "Somewhere hot", icon: <Sun size={16} /> },
    { text: "Somewhere cold", icon: <Snowflake size={16} /> },
  ],
  second: [
    { text: "Cultural experiences", icon: <MapPin size={16} /> },
    { text: "Relaxing vacation", icon: <Palmtree size={16} /> },
    { text: "Adventure", icon: <Snowflake size={16} /> },
  ],
  third: [
    { text: "1-2 weeks", icon: <CalendarDays size={16} /> },
    { text: "3-4 weeks", icon: <CalendarDays size={16} /> },
    { text: "Longer trip", icon: <CalendarDays size={16} /> },
  ],
  fourth: [
    { text: "Yes, I love food experiences", icon: <Sun size={16} /> },
    { text: "No, I'm not interested in food", icon: <Snowflake size={16} /> },
  ]
};

// Mock itinerary data - would be replaced with real AI-generated content
const MOCK_ITINERARY: TravelItinerary = {
  title: "Italian Summer Expedition",
  subtitle: "A 10-day cultural immersion",
  summary: "Experience the best of Italy's art, cuisine, and coastal beauty in this carefully curated 10-day journey.",
  destinations: [
    {
      name: "Rome",
      lat: 41.9028,
      lng: 12.4964,
      description: "Ancient ruins, Vatican treasures, and world-class cuisine.",
      days: 3
    },
    {
      name: "Florence",
      lat: 43.7696,
      lng: 11.2558,
      description: "Renaissance art, Tuscan wines, and historic architecture.",
      days: 2
    },
    {
      name: "Venice",
      lat: 45.4408,
      lng: 12.3155,
      description: "Romantic canals, Byzantine mosaics, and seafood specialties.",
      days: 2
    },
    {
      name: "Amalfi Coast",
      lat: 40.6333,
      lng: 14.6029,
      description: "Dramatic cliffs, azure waters, and charming villages.",
      days: 3
    }
  ]
};

export default function TravelChat({ className, onItineraryGenerated }: TravelChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Where do you want to go? City or nature? Hot or cold?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [quickReplies, setQuickReplies] = useState<typeof quickRepliesMap.initial>(quickRepliesMap.initial);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Auto focus the input field
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = (text: string = input) => {
    if (!text.trim()) return;
    
    // Add user message
    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);
    
    // Simulate AI thinking
    setTimeout(() => {
      // This would be replaced with actual AI response logic
      const responseMessages = [
        "That sounds wonderful! Would you prefer cultural experiences or more relaxing activities?",
        "Great choice. How long are you planning to stay?",
        "Perfect. Are you interested in local cuisine and food experiences?",
        "I've got some great ideas for you! Based on your preferences, I'd recommend exploring Italy's culture, history, and cuisine."
      ];
      
      const messageIndex = Math.min(messages.length - 1, responseMessages.length - 1);
      
      // Add AI response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responseMessages[messageIndex]
      };
      
      setMessages((prev) => [...prev, aiResponse]);
      setLoading(false);
      
      // Update quick replies based on conversation stage
      if (messages.length === 1) {
        setQuickReplies(quickRepliesMap.second);
      } else if (messages.length === 3) {
        setQuickReplies(quickRepliesMap.third);
      } else if (messages.length === 5) {
        setQuickReplies(quickRepliesMap.fourth);
      } else {
        setQuickReplies([]);
      }
      
      // Show the "View My Trip" button after a few exchanges
      if (messages.length >= 4) {
        setShowButton(true);
      }
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleViewTrip = () => {
    onItineraryGenerated(MOCK_ITINERARY);
  };

  return (
    <div className={cn("flex flex-col h-full w-full relative", className)}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatBubble 
            key={message.id} 
            message={message} 
            index={index} 
            totalMessages={messages.length} 
          />
        ))}
        
        {loading && (
          <div className="flex justify-center">
            <div className="px-4 py-2 rounded-2xl bg-secondary/90 text-foreground rounded-bl-none animate-pulse-subtle flex space-x-1">
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0s" }}></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Quick replies */}
      <AnimatePresence>
        {quickReplies.length > 0 && !loading && (
          <motion.div 
            className="px-4 mb-2 flex flex-wrap justify-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="bg-secondary/80 backdrop-blur-sm rounded-full gap-1.5 text-xs"
                onClick={() => handleSendMessage(reply.text)}
              >
                {reply.icon}
                {reply.text}
              </Button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showButton && (
          <motion.div 
            className="flex justify-center w-full mb-4 px-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              onClick={handleViewTrip}
              className="bg-primary/90 hover:bg-primary text-white rounded-full px-8 py-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl"
            >
              View My Trip
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="p-4 border-t bg-background/80 backdrop-blur-sm sticky bottom-0">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-secondary/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
          <Button 
            onClick={() => handleSendMessage()} 
            disabled={!input.trim()} 
            size="icon"
            className="bg-primary text-white hover:bg-primary/90"
          >
            <Send size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
}
