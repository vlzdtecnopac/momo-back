import express, {Express} from "express";
import bodyParser from "body-parser";
import passport from "passport";
import path from "path";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./../docs/swagger";
import cors from "cors";
import { API_ROUTER } from "./routes";
import * as http from "http";
import * as socketIO from "socket.io";
import { LoggsConfig } from "./config/logs";
import socketController from "./sockets/sockets.controller";

export const paths = {
  home: "/",
  users: "/users",
  shooping: "/shopping",
  kioskos: "/kioskos",
};


class Server {

  private static _instance: Server;
  private  _logs: LoggsConfig;

  private app: Express;
  private server;
  public io;
  private ioOptions = {
    // options go here
    cors: {
      origin: process.env.REACT_APP_FROND_URL,
      methods: ["GET", "POST"]
    }
  };


  private options = {
    customSiteTitle: "Documentación Mono", // Aquí es donde especificas el nuevo título
  };

  constructor() {
    this._logs = new LoggsConfig();
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = new socketIO.Server(this.server, this.ioOptions);
    this.initConfig();
    this.socketConfig();
  }

  public static get instance(){
    return this._instance || (this._instance = new this());
  }


  initConfig() {
    this.app.set("port", process.env.PORT || 3000);
    this.app.set("views", path.join(__dirname, "../../views"));
    this.app.set("view engine", "pug");
    this.app.set("env", process.env.APP_MODE || "production");
    this.app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerSetup, this.options));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors({ origin: true, credentials: true }));
    this.app.use(passport.initialize());
    this.rutasConfig(this.app);

    if (process.env.NODE_ENV === "development") {
      dotenv.config({ path: ".env.development" });
    } else if (process.env.NODE_ENV === "production") {
      dotenv.config({ path: ".env.production" });
    }

  }


  rutasConfig(app: Express){
    app.use(paths.home, API_ROUTER.homeRouter);
    app.use(paths.users, API_ROUTER.userRouter);
    app.use(paths.kioskos, API_ROUTER.kioskoRouter);
    app.use(paths.shooping, API_ROUTER.shoppingRouter);
  }

  socketConfig() {
    this.io.on("connection", socketController);
  }

  start(){
    this.server.listen(process.env.PORT,()=>{
      console.log("App is runnig at http://localhost:%d in %s mode", process.env.PORT || 3000, process.env.NODE_EN || "development" );
      console.log(" Press CTRL-C to stop\n");
  },);
  }

}



export default Server;