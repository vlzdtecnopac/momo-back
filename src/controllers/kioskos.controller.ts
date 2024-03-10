import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";

const loggsConfig: LoggsConfig = new LoggsConfig();

export const kioskos = async (req: Request, res: Response) => {

  try {
    const response = await
      pool.query("select * from \"Turno\" t join \"Kiosko\" k  on k.kiosko_id  = t.kiosko_id  limit 1");
    
    return res.status(200).json(response.rows);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};

export const createKiosko = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try{
    console.log("sada 21");
    const response = await pool.query(`
    INSERT INTO "Kiosko"
(id, kiosko_id, state, nombre, create_at)
VALUES(3, '${uuidv4()}', ${req.body.state}, '${req.body.nombre}', now());
    `);
   
    return res.status(200).json(response.rows);
  }catch(e){
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};