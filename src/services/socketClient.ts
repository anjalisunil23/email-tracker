import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

let socket: Socket | null = null;
type TrackingEvent = "email_opened" | "link_clicked";
const listeners = new Set<(event: TrackingEvent) => void>();

export const onTrackingEvent = (cb: (event: TrackingEvent) => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

const notifyListeners = (event: TrackingEvent) => {
  listeners.forEach((cb) => cb(event));
};

export const initSocket = (userId: string) => {
  if (socket) return;

  const BACKEND_URL = import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:5002`;

  socket = io(BACKEND_URL);

  socket.on("connect", () => {
    console.log("Connected to WebSocket server");
    socket?.emit("register", userId);
  });

  socket.on("email_opened", (data) => {
    toast.success("Email Opened!", {
      description: `${data.recipient} just opened "${data.subject}"`,
      duration: 6000,
    });
    notifyListeners("email_opened");
  });

  socket.on("link_clicked", (data) => {
    toast.success("Link Clicked!", {
      description: `${data.recipient} clicked a link in "${data.subject}"`,
      duration: 6000,
    });
    notifyListeners("link_clicked");
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
