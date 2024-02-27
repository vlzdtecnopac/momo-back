import * as homeController from "../controllers/home.controller";
import {Router} from "express";
const router: Router = Router();

router.get("/", homeController.index);

export default router;