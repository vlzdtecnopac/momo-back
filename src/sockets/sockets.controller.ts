import { Socket } from "socket.io";
import { LoggsConfig } from "../config/logs";
import * as KioskoController from "../controllers/kioskos.controller";


const socketController = (socket: Socket) => {
  
    const logs: LoggsConfig = new LoggsConfig();
    
    logs.debug(`User ID Socket: ${socket.id}`);
    logs.debug("User connected 🎉");
    // Handle custom events or messages from the client
    socket.on("mensaje-welcome", (msg) => {
      // Broadcast the message to all connected clients
      socket.broadcast.emit("mensaje-welcome", msg);
    });

    // Handle disconnection event
    socket.on("disconnect", () => {
      logs.debug("User disconnected 😥");
    });
  };

export default socketController;
  