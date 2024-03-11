
import express, { Request, Response } from "express";
import * as ShoppingController from "../controllers/shopping.controller";
import { body, check, param, query } from "express-validator";

const router = express.Router();

router.post("/", [
    check("name_shopping").notEmpty().withMessage("Ingresa  el nombre de la tienda no puede estar vacio."),
    check("no_shopping").isNumeric().notEmpty().withMessage("Ingresa el número de la tienda."),
    check("address").notEmpty().withMessage("Ingresa la dirección."),
    check("email").isEmail().withMessage("Ingresa el correoe electronico."),
    check("idenfication").notEmpty().withMessage("Ingresa una identificación de la tienda"),
    check("phone").notEmpty().withMessage("Ingresa el número telefonico de la tienda"),
], ShoppingController.createShopping);

router.get("/", ShoppingController.getShopping);

router.delete("/:id", ShoppingController.deleteShopping);

export default router;