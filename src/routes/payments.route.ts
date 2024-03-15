import express, { Request, Response } from "express";
import * as PaymentsController from "../controllers/payments.controller";
import { body, check, param, query } from "express-validator";
import validateJWT from "../middlewares/validate_jwt.middleware";

const router = express.Router();

router.post("/", [
    validateJWT,
    check("effecty").isBoolean().withMessage("Tiene que ser Boolean").notEmpty().withMessage("Ingresa si cubre débito o efectivo."),
    check("card").isBoolean().withMessage("Tiene que ser Boolean").notEmpty().withMessage("Ingresa si cubre credito."),
    check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
  ], PaymentsController.createPaymentsMethod);

  router.put("/:payment_id", [
    validateJWT,
    check("effecty").isBoolean().withMessage("Tiene que ser Boolean").notEmpty().withMessage("Ingresa si cubre débito o efectivo."),
    check("card").isBoolean().withMessage("Tiene que ser Boolean").notEmpty().withMessage("Ingresa si cubre credito."),
    check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
  ], PaymentsController.updatePaymentsMethod);

  router.delete("/:payment_id", [
    validateJWT
  ], PaymentsController.deletePaymentsMethod);
  
export default router;