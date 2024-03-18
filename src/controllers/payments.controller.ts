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
    const Query = `INSERT INTO public."Payments"
    (payment_id, effecty, card, shopping_id, create_at)
    VALUES($1, $2, $3, $4, now()) RETURNING payment_id;`;

    const response = await pool.query(Query, [uuidv4(), effecty, card, shopping_id]);

    return res.status(200).json(response.rows[0]);
    }catch(e){
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
};

export const updatePaymentsMethod = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const payments_exist = await pool.query("SELECT * FROM \"Payments\" WHERE payment_id = $1", [req.params.payment_id]);
  if (payments_exist.rows.length <= 0) {
    return res.status(400).json({msg:"El metodo payment que desea actualizar no existe."});
  }

  const {effecty, card, shopping_id} = req.body;
  try{
  const Query = `UPDATE "Payments"
  SET effecty=$1, card=$2, shopping_id=$3, update_at=now()
  WHERE payment_id=$4  RETURNING payment_id;`;

  const response = await pool.query(Query, [effecty, card, shopping_id, req.params.payment_id]);

  return res.status(200).json(response.rows[0]);
  }catch(e){
      loggsConfig.error(`${e}`);
      return res.status(500).json(e);
  }
};

export const deletePaymentsMethod =  async (req: Request, res: Response) => {
  try{
    const payments_exist = await pool.query("SELECT * FROM  \"Payments\" WHERE payment_id=$1", [req.params.payment_id]);
    if (payments_exist.rows.length <= 0) {
      res.status(400).json({msg:"El metodo payment que desea eliminar no existe."});
      return;
    }

    const Query = "DELETE FROM \"Payments\" WHERE payment_id=$1 RETURNING payment_id;";
  
    const response = await pool.query(Query, [req.params.payment_id]);
  
    return res.status(200).json(response.rows[0]);
    }catch(e){
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
};