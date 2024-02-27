import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import path from "path";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./../docs/swagger";
import cors from "cors";
import {API_ROUTER} from "./routes";

const app =  express();

dotenv.config({path: ".env"});

export const paths = {
    home:       "/",
    user:       "/user",
};

console.log(__dirname);


const options = {
    customSiteTitle: "Documentación Mono", // Aquí es donde especificas el nuevo título
  };

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


export default app;