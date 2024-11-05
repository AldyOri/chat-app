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
import { useAuth } from "@/hooks/use-user";

type Message = {
  username?: string;
  text: string;
  sender: "other" | "me";
  time: string;
};

export default function Chat() {
  const { user } = useAuth();
  console.log(user);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      username: "ini username",
      text: "oi ajg!",
      sender: "other",
      time: "10:00 AM",
    },
    {
      text: "lalalallaaa?",
      sender: "me",
      time: "10:01 AM",
    },
    {
      username: "ini username",
      text: "nanananaaaa",
      sender: "other",
      time: "10:02 AM",
    },
    {
      text: "nggih!",
      sender: "me",
      time: "10:03 AM",
    },
  ]);

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
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: "me" as const,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
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
        <header className="bg-background flex shrink-0 items-center gap-2 border-b p-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <p>ini nama room</p>
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
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
                  <p>{msg.text}</p>
                  <span className="flex w-full justify-end text-xs opacity-50">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </ScrollArea>
          <footer className="z-10 w-full shrink-0">
            <form
              onSubmit={handleSubmit}
              className="bg-background flex items-center space-x-2 p-4"
            >
              <Input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
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
