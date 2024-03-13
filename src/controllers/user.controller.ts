import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";
import { pool } from "../config/db";
import { generateAuthToken } from "../helpers/generate_jwt.helpers";

const loggsConfig: LoggsConfig = new LoggsConfig();
const saltRounds = 10;

export const startSessionEmployee = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;

        const response = await pool.query(`SELECT employee_id, shopping_id, "password", state FROM "Employes"
    WHERE email = $1
    `, [email]);

        if (response.rows[0] == undefined) {
            return res.status(401).json({ msg: "No existe usuario." });
        }

        if (!response.rows[0].state) {
            return res.status(401).json({ msg: "La cuenta se encuentra inactiva." });
        }

        bcrypt.compare(password, response.rows[0].password, (err, match) => {
            if (err) {
                loggsConfig.error(`Error comparing passwords: $${err}`);
            } else if (match) {
                let respJson =  {
                    employee_id: response.rows[0].employee_id,
                    shopping_id: response.rows[0].shopping_id,
                    state: response.rows[0].state,
                    token: generateAuthToken(response.rows[0].employee_id) 
                }
                return res.status(200).json(respJson);
            } else {
                loggsConfig.error("Login failed. Incorrect password.");
            }
        });
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }

};

export const userAllEmployeee = async (req: Request, res: Response) => {
    try {
        const response = await pool.query(`SELECT id, shopping_id, kiosko_id, first_name, last_name, phone, email, "password", create_at, update_at
        FROM public."Employes";
        `);

        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
};

export const userRegisterEmployee = async (req: Request, res: Response) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { shopping_id, first_name, last_name, phone, email, password, state } = req.body;


    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    const employee_id = uuidv4();

    try {
        const response = await pool.query(`
        INSERT INTO "Employes"
        (employee_id, shopping_id, first_name, last_name, phone, email, state, "password", create_at)
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, now());
        `, [employee_id, shopping_id, first_name, last_name, phone, email, state, hash]);

        return res.status(200).json({ ...response.rows, token: generateAuthToken(employee_id) });
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
};

export const userUpdateEmployee = async (req: Request, res: Response) => {
    const user_exist = await pool.query("SELECT * FROM \"Employes\" WHERE id = $1", [req.params.id]);
    if (user_exist.rows.length <= 0) {
        return res.status(400).json("El usuario no existe.");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { shopping_id, kiosko_id, first_name, last_name, phone, email, state, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    try {
        const response = await pool.query(`
        UPDATE "Employes"
        SET shopping_id=$2, kiosko_id=$3, first_name=$4, last_name=$5, phone=$6, email=$7, state=$8 "password"=$8, update_at=now()
        WHERE id=$1;
        `, [req.params.id, shopping_id, kiosko_id, first_name, last_name, phone, email, state, hash]);
        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }

};

export const userDeleteEmployee = async (req: Request, res: Response) => {

    const user_exist = await pool.query("SELECT * FROM \"Employes\" WHERE id = $1", [req.params.id]);
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

};

export const userUpdateKioskoEmployee = async (req: Request, res: Response) => {
    const user_exist = await pool.query("SELECT * FROM \"Employes\" WHERE id = $1", [req.params.id]);
    if (user_exist.rows.length <= 0) {
        return res.status(400).json("El usuario no existe.");
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const {kiosko_id} = req.body;
  
    try {
        const response = await pool.query(`
        UPDATE "Employes"
        SET kiosko_id=$2, update_at=now()
        WHERE id=$1;
        `, [req.params.id, kiosko_id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
  }