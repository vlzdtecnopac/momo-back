import { Socket } from "socket.io";
import { LoggsConfig } from "../config/logs";
import { pool } from "../config/db";


const socketController = (socket: Socket) => {
  
    const logs: LoggsConfig = new LoggsConfig();
    
    logs.debug(`User ID Socket: ${socket.id}`);
    logs.debug("User connected 🎉");
    // Handle custom events or messages from the client
    socket.on("kiosko-socket", async (msg) => {
      const response = await pool.query(`SELECT k.*, s.name_shopping FROM "Kiosko" k
      join "Shopping" s on s.shopping_id = k.shopping_id WHERE k.shopping_id = $1
      ORDER BY k.id ASC`, [msg.shopping_id]);
      // Broadcast the message to all connected clients
      socket.emit("kiosko-socket", response.rows);
    });

    // Handle disconnection event
    socket.on("disconnect", () => {
      logs.debug("User disconnected 😥");
    });
  };

export default socketController;
  