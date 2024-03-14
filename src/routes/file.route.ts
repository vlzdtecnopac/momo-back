import * as fileController from "../controllers/file.controller";
import {Router} from "express";
const router: Router = Router();

router.post("/", fileController.uploadFile);
export default router;