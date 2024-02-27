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

app.app.set("port", process.env.PORT || 3000);
app.app.set("views", path.join(__dirname, "../../views"));
app.app.set("view engine", "pug");
app.app.set("env", process.env.APP_MODE || "production");
app.app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerSetup, options));
app.app.use(cors({ origin: true, credentials: true }));
app.app.use(bodyParser.json());
app.app.use(bodyParser.urlencoded({ extended: true }));
app.app.use(passport.initialize());


app.app.use(paths.home, API_ROUTER.homeRouter);
app.app.use(paths.user, API_ROUTER.userRouter);

const server = app.app.listen(app.app.get("port"), () => {
    console.log("App is runnig at http://localhost:%d in %s mode", app.app.get("port"), app.app.get("env"));
    console.log(" Press CTRL-C to stop\n");
},);

export default server;