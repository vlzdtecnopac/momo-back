import { Request, Response, query } from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";

const loggsConfig: LoggsConfig = new LoggsConfig();


export const createProduct = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
    const { category_id, name_product, description, state} =  req.body;
    
    let Query = `INSERT INTO public."Product"
    (product_id, category_id, name_product, image, description, state, create_at)
    VALUES($1, $2, $3, $4, $5, $6, now()) RETURNING product_id;
    `;

    const response = await pool.query(Query, [uuidv4(), category_id, name_product, ,description, state]);

    return res.status(200).json(response.rows[0]);
    }catch(e){
      loggsConfig.error(`${e}`);
      return res.status(500).json(e);
    }
};