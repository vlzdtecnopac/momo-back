import App from "./app";
import bodyParser from "body-parser";
import passport from "passport";
import path from "path";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerSetup from "./../docs/swagger";
import cors from "cors";
import { API_ROUTER } from "./routes";

const app = App.instance;

dotenv.config({ path: ".env" });

export const paths = {
    home: "/",
    user: "/user",
};

console.log(__dirname);


const options = {
    customSiteTitle: "Documentación Mono", // Aquí es donde especificas el nuevo título
};

app.server.set("port", process.env.PORT || 3000);
app.server.set("views", path.join(__dirname, "../../views"));
app.server.set("view engine", "pug");
app.server.set("env", process.env.APP_MODE || "production");
app.server.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerSetup, options));
app.server.use(cors({ origin: true, credentials: true }));
app.server.use(bodyParser.json());
app.server.use(bodyParser.urlencoded({ extended: true }));
app.server.use(passport.initialize());


app.server.use(paths.home, API_ROUTER.homeRouter);
app.server.use(paths.user, API_ROUTER.userRouter);

const server = app.server.listen(app.server.get("port"), () => {
    console.log("App is runnig at http://localhost:%d in %s mode", app.server.get("port"), app.server.get("env"));
    console.log(" Press CTRL-C to stop\n");
},);

export default server;