import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { LoggsConfig } from "../config/logs";
import { pool } from "../config/db";
const loggsConfig: LoggsConfig = new LoggsConfig();

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {

    const token = req.header("x-token");
    const secretKey: jwt.Secret = process.env.SECRET_KEY || 'defaultSecretKey';

    if (!token) {
        return res.status(401).json({
            msg: "No hay token por registrar."
        })
    }


    try {
        const { uid } = jwt.verify(token, secretKey) as { uid: string };

        // Verificar Usuario
        const employee: any = await pool.query(`SELECT first_name, last_name, phone, email, state FROM "Employes" WHERE employee_id = $1 ;`, [uid]);

        if (!employee) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe DB'
            })
        }

        // State de la cuenta
        if (!employee.state) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado: false'
            })
        }


        req.user = employee;
        next();

    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }



}

export default validateJWT;