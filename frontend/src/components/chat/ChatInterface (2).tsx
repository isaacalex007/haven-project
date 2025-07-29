"use client"

import { useState, useRef, useEffect } from "react"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { ScrollArea } from "~/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"

// Define the shape of a message
interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
  avatar: string;
}

// Format the history for the backend
const formatChatHistory = (messages: Message[]): [string, string][] => {
  const history: [string, string][] = [];
  // Take all but the last message to create the history
  const messagesToProcess = messages.slice(0, -1);

  for (let i = 0; i < messagesToProcess.length; i++) {
     if (messagesToProcess[i].sender === 'user' && messagesToProcess[i + 1]?.sender === 'ai') {
        history.push([messagesToProcess[i].text, messagesToProcess[i + 1].text]);
        i++; // Increment i to skip the AI message we just processed
     }
  }
  return history;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: "ai", text: "Hello! I'm Haven. How can I help you find your dream home today?", avatar: "/ai-avatar.png" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    setTimeout(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }, 100);
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: inputValue,
      avatar: "/user-avatar.png",
    };
    
    // Create the new messages array for a clean state update
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsLoading(true);

    // Format the history from the state *before* the new user message was added
    const history = formatChatHistory(messages);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

    try {
      const response = await fetch(`${backendUrl}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.text,
          chat_history: history,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: data.response,
        avatar: "/ai-avatar.png",
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);

    } catch (error) {
      console.error("Failed to fetch from backend:", error);
      const errorResponse: Message = {
        id: Date.now() + 1,
        sender: "ai",
        text: "Sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.",
        avatar: "/ai-avatar.png",
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F7F7F7] w-full max-w-2xl mx-auto border-x">
      <header className="p-4 border-b text-center">
        <h1 className="text-2xl font-bold">Haven</h1>
        <p className="text-sm text-muted-foreground">Your AI Real Estate Partner</p>
      </header>
      <main className="flex-1 overflow-y-hidden">
        <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "ai" && (
                  <Avatar>
                    <AvatarImage src={message.avatar} alt="AI Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
                 {message.sender === "user" && (
                  <Avatar>
                    <AvatarImage src={message.avatar} alt="User Avatar" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src="/ai-avatar.png" alt="AI Avatar" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-sm bg-white">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
      <footer className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about neighborhoods, features, or prices..."
            className="flex-1 rounded-full"
            disabled={isLoading}
          />
          <Button type="submit" className="rounded-full" disabled={isLoading}>
            Send
          </Button>
        </form>
      </footer>
    </div>
  )
}
