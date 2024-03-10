import { Request, Response } from "express";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";

export const kioskos = async (req: Request, res: Response) => {

  const loggsConfig: LoggsConfig = new LoggsConfig();

  try {
    const response = await
      pool.query("select * from \"Turno\" t join \"Kiosko\" k  on k.kiosko_id  = t.kiosko_id  limit 1");
    loggsConfig.log("Hola Log");
    return res.status(200).json(response.rows);
  } catch (e) {
    return res.status(500).json(e);
  }
};