import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import { check } from "express-validator";
import validateJWT from "../middlewares/validate_jwt.middleware";
const router = Router();

router.post("/employee", [
    validateJWT,
    check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
    check("first_name").notEmpty().withMessage("Ingresa los nombres completos."),
    check("last_name").notEmpty().withMessage("Ingresa el apellido completo."),
    check("phone").notEmpty().withMessage("Ingresa el número telefónico."),
    check("email").isEmail().withMessage("Ingresa el correo electrónico."),
    check("password").notEmpty().withMessage("Ingresa la contraseña."),
    check("state").isBoolean().withMessage("Ingresa el estado de la cuenta."),
], UserController.userRegisterEmployee);

router.delete("/employee/:id", [validateJWT], UserController.userDeleteEmployee);

router.get("/employee", [validateJWT], UserController.userAllEmployeee);

router.put("/employee/:id", [
    validateJWT,
    check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
    check("first_name").notEmpty().withMessage("Ingresa los nombres completos."),
    check("last_name").notEmpty().withMessage("Ingresa el apellido completo."),
    check("phone").notEmpty().withMessage("Ingresa el número telefónico."),
    check("email").isEmail().withMessage("Ingresa el correo electrónico."),
    check("password").notEmpty().withMessage("Ingresa la contraseña."),
    check("state").optional().isBoolean(),
], UserController.userUpdateEmployee);


router.post("/employee/login", [
    check("email").isEmail().withMessage("Ingresa el correo electrónico."),
    check("password").notEmpty().withMessage("Ingresa la contraseña."),
], UserController.startSessionEmployee);

export default router;