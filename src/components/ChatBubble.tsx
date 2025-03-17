
import { cn } from "@/lib/utils";
import { Message } from "@/types";
import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: Message;
  index: number;
}

export default function ChatBubble({ message, index }: ChatBubbleProps) {
  const isUser = message.role === "user";
  
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
        "flex w-full max-w-md",
        isUser ? "justify-end" : "justify-start"
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
