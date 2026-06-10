import { Server } from "socket.io";
import http from "http";

let io: Server;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // In production, restrict this to frontend domain
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on("register", (userId) => {
      // Join a room based on the user ID to push events specifically to them
      socket.join(`user_${userId}`);
      console.log(`[Socket] Client ${socket.id} registered for user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized!");
  }
  return io;
};

// Helper function to emit events to a specific user
export const notifyUser = (userId: string, eventType: string, data: any) => {
  if (io) {
    io.to(`user_${userId}`).emit(eventType, data);
  }
};
