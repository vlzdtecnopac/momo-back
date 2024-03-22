import express, { Request, Response } from "express";
import * as KioskoController from "../controllers/kioskos.controller";
import { body, check, param, query } from "express-validator";
import validateJWT from "../middlewares/validate_jwt.middleware";

const router = express.Router();

router.post("/", [
  validateJWT,
  check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
  check("nombre").notEmpty().withMessage("Ingresa el nombre del kiosko."),
  check("state").isBoolean().withMessage("Error no es boolean.")
], KioskoController.createKiosko);

router.get("/", [validateJWT,
  query("shopping_id").optional(),
  query("state").optional()
], KioskoController.kioskos);

router.get("/activate/", [validateJWT,
  query("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
  query("state").isBoolean().withMessage("Error no es boolean.")
], KioskoController.activeKioskoAuto);

router.delete("/:kiosko_id", [validateJWT, query("shopping_id").notEmpty().withMessage("Ingrese la ID Shopping.")], KioskoController.deleteKiosko);

router.put("/:kiosko_id", [validateJWT, 
  check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping."),
  check("state").isBoolean().trim().withMessage("Ingrese el estado Kiosko.")
], KioskoController.updateKiosko);

router.post("/desactive_all_kioskos", [validateJWT, 
  check("shopping_id").notEmpty().withMessage("Ingresa el ID Shopping.")
], KioskoController.desactiveAllKiosko);

export default router;