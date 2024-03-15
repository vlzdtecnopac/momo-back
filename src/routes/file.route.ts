import * as fileController from "../controllers/file.controller";
import {Router} from "express";
import validateJWT from "../middlewares/validate_jwt.middleware";
const router: Router = Router();

router.post("/", [validateJWT], fileController.uploadFile);
router.get("/", [validateJWT], fileController.getFiles);
router.get("/:fileName", [validateJWT], fileController.getFile);
router.delete("/:fileName", [validateJWT], fileController.deleteFile);


export default router;