import express, { Request, Response } from "express";
import * as CategoryController from "../controllers/category.controller";
import { body, check, param, query } from "express-validator";
import validateJWT from "../middlewares/validate_jwt.middleware";

const router = express.Router();

router.get('/', [validateJWT], CategoryController.getCategoryAll)

router.post('/', [validateJWT,
    check("name_category").notEmpty().withMessage("Ingresa el nombre Categoria")
], CategoryController.crearCategory)

router.put('/:category_id', [validateJWT,
    check("name_category").notEmpty().withMessage("Ingresa el nombre Categoria")
], CategoryController.updateCategory)

router.delete('/:category_id', [validateJWT], CategoryController.deleteCategory)

export default router;