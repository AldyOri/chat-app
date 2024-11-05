export function createWebSocketConnection(
    url: string,
    onMessage: (message: string) => void,
    onOpen?: () => void,
    onClose?: (event: CloseEvent) => void,
    onError?: (event: Event) => void
  ) {
    const socket = new WebSocket(url);
  
    // Event listeners for the WebSocket connection
    socket.onopen = () => {
      console.log("WebSocket connection established");
      if (onOpen) onOpen();
    };
  
    socket.onmessage = (event: MessageEvent) => {
      console.log("Received message:", event.data);
      onMessage(event.data);
    };
  
    socket.onerror = (event: Event) => {
      console.error("WebSocket error:", event);
      if (onError) onError(event);
    };
  
    socket.onclose = (event: CloseEvent) => {
      console.log("WebSocket connection closed:", event);
      if (onClose) onClose(event);
    };
  
    // Function to send a message through the WebSocket
    const sendMessage = (message: string) => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(message);
      } else {
        console.error("WebSocket is not open. Message not sent.");
      }
    };
  
    // Function to close the WebSocket connection
    const closeConnection = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  
    return { sendMessage, closeConnection };
  }
  