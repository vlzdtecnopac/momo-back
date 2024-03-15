import * as fileController from "../controllers/file.controller";
import {Router} from "express";
const router: Router = Router();

router.post("/", fileController.uploadFile);
router.get("/", fileController.getFiles);
router.get("/:fileName", fileController.getFile);
router.delete("/:fileName", fileController.deleteFile);


export default router;