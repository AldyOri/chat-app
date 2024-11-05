import { FormEvent, useEffect, useRef, useState } from "react";
import { createWebSocketConnection } from "@/helper/websocket";
import { getCookie } from "@/helper/cookie";

function Testing() {
  const isMounted = useRef(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const socketRef = useRef<ReturnType<typeof createWebSocketConnection> | null>(
    null,
  );

  useEffect(() => {
    if (isMounted.current) {
      return;
    }
    isMounted.current = true;

    // WebSocket URL with token as a query parameter
    const token = getCookie({ name: "token" });
    const wsUrl = `ws://localhost:8000/api/rooms/1/ws?token=${token}`;

    // Initialize WebSocket connection
    socketRef.current = createWebSocketConnection(
      wsUrl,
      (message) => setMessages((prevMessages) => [...prevMessages, message]), // onMessage handler
      () => console.log("Connection opened"), // onOpen handler
      () => console.log("Connection closed"), // onClose handler
      (error) => console.error("Connection error:", error), // onError handler
    );

    // Clean up WebSocket on component unmount
    return () => {
      socketRef.current?.closeConnection();
    };
  }, []);

  // Function to send message
  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (socketRef.current && input) {
      socketRef.current.sendMessage(input);
      setInput("");
    }
  };

  return (
    <div>
      <h2>WebSocket Chat</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          className="text-black"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Testing;
