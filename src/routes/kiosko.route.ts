import express, { Request, Response } from "express";
import * as KioskoController from "../controllers/kioskos.controller";
import { UserType } from "../types/user.type";
import Server from "../app";
import { body, check, param, query } from "express-validator";

const router = express.Router();

/**
 * @swagger
 * /user/users:
 *   get:
 *     summary: Obtener Lista de usuarios
 *     tags: 
 *        - users
 *     responses:
 *       200:
 *         description: Aqui Optienes todas la lista usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                  $ref: "#/components/schemas/user"
 *     security:
 *      - bearerAuth: []
 */
router.get("/users", (req: Request, res: Response) => {
  const data: UserType[] = [
    {
      name: "Leifer",
      avatar: "http://",
    },
    {
      name: "Leifer",
      avatar: "http://",
    },
  ];
  Server.instance.io.emit("mensaje-welcome", "Hola David desde server");
  res.send({ data });
});

/**
 * Post track
 * @swagger
 * /users:
 *    post:
 *      tags:
 *        - users
 *      summary: "Listar usuario"
 *      description: Este endpoint es para listar los usuario totales 
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/user"
 *      responses:
 *        '200':
 *          description: Retorna el objeto insertado en la coleccion.
 *        '422':
 *          description: Error de validacion.
 *      security:
 *       - bearerAuth: []
 */
router.post("/users", (req: Request, res: Response) => {
  const { body } = req;
  Server.instance.io.emit("mensaje-welcome", "Hola David desde server");
  res.send({ data: body });
});


router.post("/",  [
  check("nombre").notEmpty().withMessage("Ingresa el nombre del kiosko."),
  check("state").isBoolean().withMessage("Error no es boolean.")
],KioskoController.createKiosko);

router.get("/",  KioskoController.kioskos);

router.delete("/:id", KioskoController.deleteKiosko);

router.put("/:id", [query('state').isBoolean().trim().withMessage("Ingrese el estado Kiosko.")], KioskoController.updateKiosko)

export default router;