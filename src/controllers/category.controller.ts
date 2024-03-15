import { Request, Response, query } from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";

const loggsConfig: LoggsConfig = new LoggsConfig();

export const updateCategory = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let Query = `UPDATE "Category"
        SET name_category=$2, update_at=now()
        WHERE category_id=$1 RETURNING category_id;
    `;
        const response = await pool.query(Query, [req.params.category_id, req.body.name_category]);
        return res.status(200).json(response.rows[0]);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    try {

        let category_id = req.params.category_id;

        const category_exist = await pool.query(`SELECT category_id
        FROM "Category" WHERE category_id =  $1;
   `, [category_id]);

        if (category_exist.rows.length <= 0) {
            return res.status(400).json({msg: "La categoria que desea eliminar no existe."});
        }


        let Query = `DELETE FROM public."Category"
        WHERE category_id=$1 RETURNING category_id;
    `;
        const response = await pool.query(Query, [category_id]);
        return res.status(200).json(response.rows[0]);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
}

export const crearCategory = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        let Query = `INSERT INTO "Category"
    (category_id, name_category, create_at)
    VALUES($1, $2, now()) RETURNING category_id;
    `;

        const response = await pool.query(Query, [uuidv4(), req.body.name_category]);
        return res.status(200).json(response.rows[0]);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
}