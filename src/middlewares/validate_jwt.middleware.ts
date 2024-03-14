import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { LoggsConfig } from "../config/logs";
import { pool } from "../config/db";
const loggsConfig: LoggsConfig = new LoggsConfig();

if (process.env.NODE_ENV === "development") {
    require('dotenv').config({ path: ".env.development" });
} else if (process.env.NODE_ENV === "production") {
    require('dotenv').config({ path: ".env.production" });
}


const validateJWT = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.header("x-token");
    const secretKey: jwt.Secret = process.env.SECRETORPRIVATEKEY || "MOMO123456";

    if (!token) {
        return res.status(401).json({
            msg: "No hay token por registrar."
        });
    }


    try {
        const { uid } = jwt.verify(token, secretKey) as { uid: string };

        // Verificar Usuario
        const employee = await pool.query("SELECT first_name, last_name, phone, email, state FROM \"Employes\" WHERE employee_id = $1 ;", [uid]);
      
        if (!employee.rows) {
            return res.status(401).json({
                msg: "Token no válido - Usuario no existe DB."
            });
        }

        // State de la cuenta is TRUE
        if (!employee.rows[0].state) {
            return res.status(401).json({
                msg: "Token no válido - Usuario inactivo."
            });
        }


        req.user = employee;
        next();

    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }



};

export default validateJWT;