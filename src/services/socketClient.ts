import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

let socket: Socket | null = null;

export const initSocket = (userId: string) => {
  if (socket) return;

  // Ideally dynamic, but for local testing:
  const BACKEND_URL = "http://localhost:5002";
  
  socket = io(BACKEND_URL);

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    socket?.emit("register", userId);
  });

  socket.on("email_opened", (data) => {
    toast.success(`Email Opened!`, {
      description: `${data.recipient} just opened "${data.subject}"`,
      duration: 6000,
    });
  });

  socket.on("link_clicked", (data) => {
    toast.success(`Link Clicked!`, {
      description: `${data.recipient} clicked a link in "${data.subject}"`,
      duration: 6000,
    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
