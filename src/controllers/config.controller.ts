import { Request, Response, query } from "express";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";
import Server from "../app";
import { validationResult } from "express-validator";
const loggsConfig: LoggsConfig = new LoggsConfig();

export const getConfigShop = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    try {
        const response = await pool.query(`SELECT type_text, type_column, create_at, update_at
        FROM "Config" WHERE shopping_id = $1;`, [req.query.shopping_id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
};

export const postConfigShop =  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {shopping_id, type_text, type_column} = req.body;
  
    try {
        const response = await pool.query(`INSERT INTO public."Config"
        (shopping_id, type_text, type_column, create_at)
        VALUES($1, $2, $3, now());`, [shopping_id, type_text, type_column]);
        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
};

export const updateConfigShop = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {type_text, type_column, update_at} = req.body;

    try {
        const response = await pool.query(`UPDATE "Config"
        SET shopping_id=$1, type_text=$2, type_column=$3, update_at=now()
        WHERE shopping_id=$1;`, [req.params.shopping_id, type_text, type_column]);
        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
};