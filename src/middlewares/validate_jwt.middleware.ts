import { Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import { LoggsConfig } from "../config/logs";
import { pool } from "../config/db";
const loggsConfig: LoggsConfig = new LoggsConfig();

const validateJWT = async (req: Request, res: Response) => {

    const token = req.header("x-token");
    const secretKey: jwt.Secret = process.env.SECRET_KEY || 'defaultSecretKey';

    if(!token){
        return res.status(401).json({
            msg: "No hay token por registrar."
        })
    }
    
    const { uid } = jwt.verify( token, secretKey )  as { uid: string };

    // Verificar Usuario
     const employee = await pool.query(`SELECT state FROM "Employes" WHERE employee_id = $1 ;`, [uid]);

     if( !employee ) {
         return res.status(401).json({
             msg: 'Token no válido - Usuario no existe DB'
         })
     }

     // State de la cuenta
     if ( !employee.state ) {
         return res.status(401).json({
             msg: 'Token no válido - Usuario con estado: false'
         })
     }
     

    try{

    }catch(e){
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }



}

export default validateJWT;