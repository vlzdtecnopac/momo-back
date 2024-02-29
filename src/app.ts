import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import path from "path";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./../docs/swagger";
import cors from "cors";
import {API_ROUTER} from "./routes";
import * as http from "http";
import * as socketIO from "socket.io";

export const paths = {
  home:       "/",
  user:       "/user",
};

const options = {
  customSiteTitle: "Documentación Mono", // Aquí es donde especificas el nuevo título
};

// Create an Express application
const app = express();

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "../../views"));
app.set("view engine", "pug");
app.set("env", process.env.APP_MODE || "production");
app.use("/documentation",swaggerUi.serve, swaggerUi.setup(swaggerSetup, options));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors({origin: true, credentials: true}));
app.use(passport.initialize());


app.use( paths.home, API_ROUTER.homeRouter);
app.use( paths.user, API_ROUTER.userRouter);

const Server = http.createServer(app);

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
}


const ioOptions = {
  // options go here
  cors: {
    origin: process.env.REACT_APP_FROND_URL,
    methods: ["GET", "POST"]
  }
};

// Create a Socket.IO instance attached to the server
export const io = new socketIO.Server(Server, ioOptions);

// Set up a connection event handler for new socket connections
io.on("connection", (socket) => {
  console.log(`User ID Socket: ${socket.id}`);
  console.log("User connected 🎉");
  
  // Handle custom events or messages from the client
  socket.on("chat message", (msg) => {
      // Broadcast the message to all connected clients
      io.emit("chat message", msg);
  });

  // Handle disconnection event
  socket.on("disconnect", () => {
      console.log("User disconnected 😥");
  });
});

export default Server;