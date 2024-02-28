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
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());


app.use( paths.home, API_ROUTER.homeRouter);
app.use( paths.user, API_ROUTER.userRouter);

const server = http.createServer(app);

dotenv.config({path: ".env"});

// Create a Socket.IO instance attached to the server
const io = new socketIO.Server(server);

// Set up a connection event handler for new socket connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle custom events or messages from the client
  socket.on("chat message", (msg) => {
      console.log(`Message from client: ${msg}`);
      // Broadcast the message to all connected clients
      io.emit("chat message", msg);
  });

  // Handle disconnection event
  socket.on("disconnect", () => {
      console.log("User disconnected");
  });
});

export default server;