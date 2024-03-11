import {Router} from "express";
import * as UserController from "../controllers/user.controller";
const router = Router();

router.post("/", [] , UserController.userRegister)
export default router;