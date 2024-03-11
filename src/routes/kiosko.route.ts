import express, { Request, Response } from "express";
import * as KioskoController from "../controllers/kioskos.controller";
import { body, check, param, query } from "express-validator";

const router = express.Router();

router.post("/",  [
  check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
  check("nombre").notEmpty().withMessage("Ingresa el nombre del kiosko."),
  check("state").isBoolean().withMessage("Error no es boolean.")
],KioskoController.createKiosko);

router.get("/",  KioskoController.kioskos);

router.delete("/:id", KioskoController.deleteKiosko);

router.put("/:id", [query('state').isBoolean().trim().withMessage("Ingrese el estado Kiosko.")], KioskoController.updateKiosko)

export default router;