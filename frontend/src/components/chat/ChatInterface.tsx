'use client';

import { useState, useRef, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PaperPlaneIcon } from "@radix-ui/react-icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import { cn } from "~/lib/utils";
import { PropertyScorecardData } from "~/types";
import { LifestyleScorecard } from "./LifestyleScorecard";

// Define message structure
interface Message {
  id: string;
  role: "user" | "agent";
  content: string;
}

// Helper to format history for the API
const formatHistoryForAPI = (messages: Message[]): [string, string][] => {
    const history: [string, string][] = [];
    for (let i = 0; i < messages.length; i++) {
        if (messages[i].role === 'user' && messages[i + 1]?.role === 'agent') {
            history.push([messages[i].content, messages[i + 1].content]);
            i++;
        }
    }
    return history;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const history = formatHistoryForAPI(messages);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    try {
      if (!backendUrl) throw new Error("Backend URL is not configured.");

      const response = await fetch(`${backendUrl}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          chat_history: history,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const data = await response.json();
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: data.response,
      };
      setMessages(prev => [...prev, agentMessage]);

    } catch (error) {
      console.error("Fetch failed:", error);
      const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'agent',
          content: "I'm having trouble connecting to my systems. Please try again in a moment."
      };
      setMessages(prev => [...prev, errorMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen items-center bg-[#F7F7F7]">
      <div className="flex flex-col h-full w-full max-w-3xl">
        <header className="px-6 pt-6 pb-4">
          <h1 className="text-xl font-semibold text-gray-800">Haven</h1>
        </header>
        
        <ScrollArea className="flex-grow px-6" ref={scrollAreaRef}>
          <div className="space-y-6 py-4">
              {messages.length === 0 && (
                  <div className="flex items-start">
                      <article className="prose prose-sm max-w-none text-gray-700">
                          Hello! I'm Haven. How can I help you find your dream home today?
                      </article>
                  </div>
              )}

              {messages.map((message) => {
                let scorecardData: PropertyScorecardData | null = null;
                if (message.role === 'agent') {
                  try {
                    // This regex finds a JSON object within the string
                    const jsonMatch = message.content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                      const parsed = JSON.parse(jsonMatch[0]);
                      if (parsed.type === 'property_scorecard') {
                        scorecardData = parsed;
                      }
                    }
                  } catch (e) { /* Not a JSON message */ }
                }

                return (
                  <div key={message.id} className={cn("flex w-full", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {scorecardData ? (
                      <LifestyleScorecard data={scorecardData} />
                    ) : (
                      <div className={cn("max-w-lg p-4 rounded-2xl", message.role === 'user' ? 'bg-slate-200 text-gray-800' : 'bg-white text-gray-800 shadow-sm')}>
                        <article className="prose prose-sm max-w-none">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                        </article>
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                  <div className="flex justify-start">
                      <div className="p-4">
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

        <footer className="p-4 pt-2 bg-[#F7F7F7]">
          <div className="relative">
              <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? handleSubmit(e as any) : null}
                  placeholder="Message Haven..."
                  className="w-full rounded-full border-gray-300 pl-4 pr-12 py-6 focus-visible:ring-blue-500"
              />
              <Button 
                  type="submit" 
                  size="icon" 
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                  onClick={handleSubmit}
                  disabled={isLoading || !input.trim()}
              >
                  <PaperPlaneIcon className="h-5 w-5" />
              </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}