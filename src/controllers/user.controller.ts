import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";
import { pool } from "../config/db";

const loggsConfig: LoggsConfig = new LoggsConfig();
const saltRounds = 10;


export const userRegisterEmploye = async (req: Request, res: Response) => {
    
    const { shopping_id, first_name, last_name, phone, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    
    try {
        const response = await pool.query(`
        INSERT INTO public."Employes"
        (shopping_id, first_name, last_name, phone, email, "password", create_at)
        VALUES($1, $2, $3, $4, $5, $6, now());
        `, [shopping_id, first_name, last_name, phone, email, hash]);

        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
}