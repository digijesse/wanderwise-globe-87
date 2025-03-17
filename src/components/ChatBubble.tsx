
import { cn } from "@/lib/utils";
import { Message } from "@/types";
import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: Message;
  index: number;
  totalMessages: number;
}

export default function ChatBubble({ message, index, totalMessages }: ChatBubbleProps) {
  const isUser = message.role === "user";
  
  // Calculate position around the globe based on message index and total count
  // Newer messages are in the center, older messages move around the globe
  const getPositionClass = () => {
    if (index === totalMessages - 1) {
      return "justify-center"; // Latest message centered
    }
    
    const olderMessagePosition = index % 4;
    switch(olderMessagePosition) {
      case 0: return "justify-start"; // Left
      case 1: return "justify-end"; // Right
      case 2: return "justify-center ml-20"; // Left of center
      case 3: return "justify-center mr-20"; // Right of center
      default: return "justify-center";
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={cn(
        "flex w-full max-w-md px-4",
        getPositionClass()
      )}
    >
      <div
        className={cn(
          "px-4 py-2 rounded-2xl text-sm backdrop-blur-md shadow-sm max-w-[85%]",
          isUser 
            ? "bg-primary/90 text-white rounded-br-none" 
            : "bg-secondary/90 text-foreground rounded-bl-none",
          "animate-float"
        )}
        style={{
          animationDelay: `${index * 0.1}s`,
          animationDuration: "3s"
        }}
      >
        <p className="text-balance">{message.content}</p>
      </div>
    </motion.div>
  );
}
