import express, { Request, Response, Router } from "express";
import * as ConfigController from "../controllers/config.controller";
import { body, check, param, query } from "express-validator";
import validateJWT from "../middlewares/validate_jwt.middleware";

const router: Router = Router();

router.get("/", [validateJWT,
    query("shopping_id").notEmpty().withMessage("Ingrese la ID SHOPPING.")
  ], ConfigController.getConfigShop);


router.put("/:shopping_id", [validateJWT,
  query("type_text").notEmpty().withMessage("Ingrese el tipo de texto."),
  query("type_column").notEmpty().withMessage("Ingrese el tipo de columna."),
], ConfigController.getConfigShop);

router.post("/", [validateJWT,
  check("shopping_id").notEmpty().withMessage("Ingrese la ID SHOPPING."),
  check("type_text").notEmpty().withMessage("Ingrese el tipo de texto."),
  check("type_column").notEmpty().withMessage("Ingrese el tipo de columna."),
], ConfigController.postConfigShop);

export default router;