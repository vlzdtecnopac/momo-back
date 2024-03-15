import { Request, Response, query } from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";

const loggsConfig: LoggsConfig = new LoggsConfig();

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