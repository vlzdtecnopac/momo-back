import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";

const loggsConfig: LoggsConfig = new LoggsConfig();

export const createShopping = async (req: Request, res: Response) => {
    const {name_shopping, no_shopping, address, email, idenfication, phone } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    try{
        const response = await pool.query(`
        INSERT INTO "Shopping" (
          shopping_id, name_shopping, no_shooping, address, email, idenfication, phone, create_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, now());
      `, [uuidv4(), name_shopping, no_shopping, address, email, idenfication, phone]);
      
        return res.status(200).json(response.rows);
    }catch(e){
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
    
}