import { Request, Response, query } from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";
import Server from "../app";

export const createProduct = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { category_id, name_product, description, state} =  req.body;
    
    let Query = `INSERT INTO public."Product"
    (product_id, category_id, name_product, image, description, state, create_at)
    VALUES('$1', '$2', '$3', '$4', '$5', false, now()) RETURNING category_id;
    `;

    const response = await pool.query(Query, [uuidv4(), category_id, name_product, ,description, state]);

    return res.status(200).json(response.rows[0]);
};