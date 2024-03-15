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

  try {
    const { category_id, name_product, description, state } = req.body;

    let Query = `INSERT INTO public."Product"
    (product_id, category_id, name_product, image, description, state, create_at)
    VALUES($1, $2, $3, $4, $5, $6, now()) RETURNING product_id;
    `;

    const response = await pool.query(Query, [uuidv4(), category_id, name_product, , description, state]);

    return res.status(200).json(response.rows[0]);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};


export const updateProduct = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { category_id, name_product, image, description, state } = req.body;
    let Query = `UPDATE "Product"
  SET category_id=$1, name_product=$2, image=$3, description=$4, state=$5, update_at=now() WHERE product_id=$6 RETURNING product_id;`;
    const response = await pool.query(Query, [category_id, name_product, image, description, state, req.params.product_id]);
    return res.status(200).json(response.rows[0]);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }

}

export const deleteProduct = async (req: Request, res: Response) => {
  let product_id = req.params.product_id;

  const product_exist = await pool.query(`SELECT product_id FROM "Product" WHERE  product_id = $1
`, [product_id]);

  if (product_exist.rows.length <= 0) {
    return res.status(400).json("El producto que desea eliminar no existe.");
  }

  try {
    let Query = `DELETE FROM "Product"
    WHERE product_id=$1 RETURNING product_id;`;
    const response = await pool.query(Query, [product_id]);
    return res.status(200).json(response.rows[0]);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
}