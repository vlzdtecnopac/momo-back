import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";
import { pool } from "../config/db";

const loggsConfig: LoggsConfig = new LoggsConfig();
const saltRounds = 10;

export const userAllEmployeee =  async (req: Request, res: Response) => {
    try {
        const response = await pool.query(`SELECT id, shopping_id, kiosko_id, first_name, last_name, phone, email, "password", create_at, update_at
        FROM public."Employes";
        `);

        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
}

export const userRegisterEmployee = async (req: Request, res: Response) => {

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

export const userUpdateEmployee = async (req: Request, res: Response) => {
    const user_exist = await pool.query(`SELECT * FROM "Employes" WHERE id = $1`, [req.params.id]);
    if (user_exist.rows.length <= 0) {
        return res.status(400).json("El usuario no existe.");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { shopping_id, kiosko_id, first_name, last_name, phone, email, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    try {
        const response = await pool.query(`
        UPDATE public."Employes"
        SET shopping_id=$2, kiosko_id=$3, first_name=$4, last_name=$5, phone=$6, email=$7, "password"=$8,  update_at=now()
        WHERE id=$1;
        `, [req.params.id, shopping_id, kiosko_id, first_name, last_name, phone, email, hash]);
        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }

}

export const userDeleteEmployee = async (req: Request, res: Response) => {

    const user_exist = await pool.query(`SELECT * FROM "Employes" WHERE id = $1`, [req.params.id]);
    if (user_exist.rows.length <= 0) {
        return res.status(400).json("El usuario no existe.");
    }

    try {
        const response = await pool.query(`
        DELETE FROM "Employes"
        WHERE id=$1;
        `, [req.params.id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }

}