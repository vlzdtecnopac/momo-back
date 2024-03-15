import { Request, Response, query } from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";

const loggsConfig: LoggsConfig = new LoggsConfig();

export const createPaymentsMethod = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {effecty, card, shopping_id} = req.body;
    try{
    let Query = `INSERT INTO public."Payments"
    (payment_id, effecty, card, shopping_id, create_at)
    VALUES($1, $2, $3, $4, now()) RETURNING payment_id;`;

    const response = await pool.query(Query, [uuidv4(), effecty, card, shopping_id]);

    return res.status(200).json(response.rows[0]);
    }catch(e){
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
}