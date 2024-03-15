import express, { Request, Response } from "express";
import * as CategoryController from "../controllers/category.controller";
import { body, check, param, query } from "express-validator";
import validateJWT from "../middlewares/validate_jwt.middleware";

const router = express.Router();

router.post('/', [validateJWT,
    check("name_category").notEmpty().withMessage("Ingresa el nombre Categoria")
], CategoryController.crearCategory)

export default router;