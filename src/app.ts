import express from "express";
import { Server as SocketIOServer } from "socket.io";
import http from "http";



export default class App {

  private static _intance: App;

  public server: express.Application;
  public port: number;

  public io: SocketIOServer;
  private httpServer: http.Server;

  private constructor(){
    this.server = express();
    this.port = this.server.get("port"); 

    this.httpServer = new http.Server(this.server);
    this.io = new SocketIOServer(this.httpServer);

    this.listeningSockets();
  }

  public static get instance() {
    return this._intance || ( this._intance = new this() );
  }

  private listeningSockets(){
    console.log("Listening Sockets IO");
    this.io.on("connection", cliente => {
         console.log(`Client connected: ${cliente.id}`);
    });
  }

  start(callback: any) {
    this.httpServer.listen(this.port, callback);
  }
}




