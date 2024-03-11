
import express, { Request, Response } from "express";
import * as ShoppingController from "../controllers/shopping.controller";
import { body, check, param, query } from "express-validator";

const router = express.Router();

router.post("/", [
    check("name_shopping").notEmpty().withMessage("Ingresa  el nombre de la tienda no puede estar vacio."),
    check("no_shopping").isNumeric().notEmpty().withMessage("Ingresa el número de la tineda."),
    check("address").notEmpty().withMessage("Ingresa la dirección."),
    check("emial").isEmail().withMessage("Ingresa el correoe electronico."),
    check("state").isBoolean().withMessage("Error no es boolean.")
], ShoppingController.createShopping);

export default router;