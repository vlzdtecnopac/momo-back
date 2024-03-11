import express, { Request, Response } from "express";
import * as KioskoController from "../controllers/kioskos.controller";
import { body, check, param, query } from "express-validator";
import validateJWT from "../middlewares/validate_jwt.middleware";

const router = express.Router();

router.post("/",  [
  validateJWT,
  check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
  check("nombre").notEmpty().withMessage("Ingresa el nombre del kiosko."),
  check("state").isBoolean().withMessage("Error no es boolean.")
],KioskoController.createKiosko);

router.get("/", [validateJWT], KioskoController.kioskos);

router.delete("/:id", [validateJWT], KioskoController.deleteKiosko);

router.put("/:id", [validateJWT, query('state').isBoolean().trim().withMessage("Ingrese el estado Kiosko.")], KioskoController.updateKiosko)

export default router;