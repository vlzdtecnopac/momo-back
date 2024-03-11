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
    check("state").isBoolean().withMessage("Ingresa el estado de la cuenta."),
] , UserController.userRegisterEmployee)

router.delete("/employee/:id", UserController.userDeleteEmployee);

router.get("/employee", UserController.userAllEmployeee);

router.put("/employee/:id",[
    check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
    check("kiosko_id").optional(),
    check("first_name").notEmpty().withMessage("Ingresa los nombres completos."),
    check("last_name").notEmpty().withMessage("Ingresa el apellido completo."),
    check("phone").notEmpty().withMessage("Ingresa el número telefónico."),
    check("email").isEmail().withMessage("Ingresa el correo electrónico."),
    check("password").notEmpty().withMessage("Ingresa la contraseña."),
    check("state").optional().isBoolean(),
],UserController.userUpdateEmployee);

export default router;