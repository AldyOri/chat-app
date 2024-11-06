import { useEffect, useRef, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Send } from "lucide-react";
import { createWebSocketConnection } from "@/helper/websocket";
import { getCookie } from "@/helper/cookie";
import { useAuth } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

type Message = {
  username?: string;
  content: string;
  sender?: "other" | "me";
  timestamp?: Date;
};

const WS_URL = import.meta.env.VITE_WS_URL;

export default function Chat() {
  const { toast } = useToast();
  const { activeRoom } = useAuth();
  const isMounted = useRef(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof createWebSocketConnection> | null>(
    null,
  );
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (isMounted.current) {
      return;
    }
    isMounted.current = true;
  }, []);

  useEffect(() => {
    if (!activeRoom) return;

    const token = getCookie({ name: "token" });
    const roomID = activeRoom.id;
    const wsUrl = `${WS_URL}/api/rooms/${roomID}/ws?token=${token}`;

    if (socketRef.current) {
      socketRef.current.closeConnection();
    }

    setMessages([]);

    socketRef.current = createWebSocketConnection(
      wsUrl,
      (message) => setMessages((prevMessages) => [...prevMessages, message]), // onMessage handler
      () => {
        toast({
          title:`Connected to room: ${activeRoom.name}`
        })
        console.log("Connection opened");
      }, // onOpen handler
      () => console.log("Connection closed"), // onClose handler
      (error) => console.error("Connection error:", error), // onError handler
    );

    return () => {
      socketRef.current?.closeConnection();
    };
  }, [activeRoom]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (socketRef.current && input) {
      socketRef.current.sendMessage(input);
      setInput("");
    }
    if (input.trim()) {
      const newMessage: Message = {
        content: input,
        sender: "me" as const,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInput("");
    }
  };

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "350px",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="flex h-screen flex-col">
        <header className="flex shrink-0 items-center gap-2 border-b bg-background p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <p>{activeRoom?.name}</p>
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 pb-0">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "me" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-2 ${
                    msg.sender === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary"
                  }`}
                >
                  <p className="text-sm font-extralight opacity-60">
                    {msg.username}
                  </p>
                  <p>{msg.content}</p>
                  <span className="flex w-full justify-end text-xs opacity-50">
                    {msg.timestamp?.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </ScrollArea>
          <footer className="z-10 w-full shrink-0">
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2 bg-background p-4 pt-1"
            >
              <Input
                type="text"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" size="icon" className="rounded-md">
                <Send className="h-5 w-5" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
