import {Router} from "express";
import * as UserController from "../controllers/user.controller";
import { check } from "express-validator";
const router = Router();

router.post("/employee", [
    check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
    check("first_name").notEmpty().withMessage("Ingresa los nombres completos."),
    check("last_name").notEmpty().withMessage("Ingresa el apellido completo."),
    check("phone").notEmpty().withMessage("Ingresa el número telefónico."),
    check("email").isEmail().withMessage("Ingresa el correo electrónico."),
    check("password").notEmpty().withMessage("Ingresa la contraseña."),
] , UserController.userRegisterEmploye)
export default router;