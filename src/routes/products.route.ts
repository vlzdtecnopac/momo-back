import express, { Request, Response, Router } from "express";
import * as ProductController from "../controllers/product.controller";
import { body, check, param, query } from "express-validator";
import validateJWT from "../middlewares/validate_jwt.middleware";


const router: Router = Router();

router.post("/", [
    validateJWT, 
    check('category_id').notEmpty().withMessage("Ingresa la CETEGORIA ID, la que pertenece."),
    check('name_product').notEmpty().withMessage("Ingresa el nombre del producto."),
    check('description').notEmpty().withMessage("Ingresa la descripción del prodcuto."),
    check('state').isBoolean().withMessage("Ingresa el estado del producto.")
], ProductController.createProduct)


export default router;