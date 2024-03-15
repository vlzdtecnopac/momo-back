import * as fileController from "../controllers/file.controller";
import {Router} from "express";
const router: Router = Router();

router.post("/", fileController.uploadFile);
router.get("/:fileName", fileController.getFile);
router.get("/", fileController.getFiles);
export default router;