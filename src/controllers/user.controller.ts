import { Request, Response, query } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";
import { pool } from "../config/db";
import { generateAuthToken } from "../helpers/generate_jwt.helpers";

const loggsConfig: LoggsConfig = new LoggsConfig();
const saltRounds = 10;

export const startSessionClient = async (req: Request, res: Response) => {
    const { email, phone, code } = req.body;
    let response;
    if (req.body.hasOwnProperty("email")) {
        if (email == null) res.status(401).json({ msg: "Ingresa el correo electrónico", attribute: 'email' });
        response = await pool.query(`SELECT client_id, avatar, first_name, last_name FROM "Client"
        WHERE email=$1;
        `, [email]);
    } else {
        if (phone == null || code == null) res.status(401).json({ msg: "Ingresa el número telefónico y el codigo del pais", attribute: ['code', 'phone'] });
        response = await pool.query(`SELECT client_id, avatar, first_name, last_name FROM "Client"
        WHERE phone=$1 AND code=$2;
        `, [phone, code]);
    }

    if (response.rows[0] == undefined || response.rows[0] == null) {
        return res.status(401).json({ msg: "No existe usuario." });
    }

    return res.status(200).json(response.rows);
}

export const startSessionEmployee = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password } = req.body;
        const response = await pool.query(`SELECT employee_id, shopping_id, "password", state FROM "Employes"
    WHERE email=$1
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
                const respJson = {
                    employee_id: response.rows[0].employee_id,
                    shopping_id: response.rows[0].shopping_id,
                    state: response.rows[0].state,
                    token: generateAuthToken(response.rows[0].employee_id)
                };
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

export const userAllEmployee = async (req: Request, res: Response) => {
    try {
        let Query = `SELECT id, employee_id, shopping_id, first_name, last_name, phone, email, "password", create_at, update_at
        FROM "Employes"
        `;

        const { shopping_id, employee_id } = req.query;

        if (shopping_id != undefined || employee_id != undefined) {
            const arrayWehere = [];
            shopping_id == "" ? "" : arrayWehere.push({ "shopping_id": shopping_id });
            employee_id == "" ? "" : arrayWehere.push({ "employee_id": employee_id });

            const result_consult = arrayWehere.map(item => ` ${Object.keys(item)} = '${Object.values(item)}'`).join("OR");
            Query += ` WHERE ${result_consult}`;
        }
        const response = await pool.query(Query);
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
    const user_exist = await pool.query("SELECT * FROM \"Employes\" WHERE employee_id=$1", [req.params.id]);
    if (user_exist.rows.length <= 0) {
        return res.status(400).json({ msg: "El usuario no existe." });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { shopping_id, first_name, last_name, phone, email, state, password } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    try {
        const response = await pool.query(`
        UPDATE "Employes"
        SET shopping_id=$2, first_name=$4, last_name=$5, phone=$6, email=$7, state=$8 "password"=$8, update_at=now()
        WHERE employee_id=$1;
        `, [req.params.id, shopping_id, first_name, last_name, phone, email, state, hash]);
        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }

};

export const userDeleteEmployee = async (req: Request, res: Response) => {

    const user_exist = await pool.query("SELECT * FROM \"Employes\" WHERE employee_id=$1", [req.params.id]);
    if (user_exist.rows.length <= 0) {
        return res.status(400).json({ msg: "El usuario no existe." });
    }

    try {
        const response = await pool.query(`
        DELETE FROM "Employes"
        WHERE employee_id=$1;
        `, [req.params.id]);
        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }

};

export const userRegisterClient = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { first_name, last_name, phone, code, country, email } = req.body

    try {
        const response = await pool.query(`
        INSERT INTO "Client"
        (client_id, first_name, last_name, phone, email, country, code, state, create_at )
        VALUES($1, $2, $3, $4, $5, $6, $7, $8,now()) RETURNING client_id, first_name, last_name, phone, phone, email;
        `, [uuidv4(), first_name, last_name, phone, email, country, code, true]);

        return res.status(200).json(response.rows[0]);

    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }

}

export const updateToken = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const user_exist = await pool.query("SELECT * FROM \"Employes\" WHERE employee_id=$1", [req.body.id]);
    if (user_exist.rows.length <= 0) {
        return res.status(400).json({ msg: "El usuario no existe." });
    }

    try {
        const secretKey: jwt.Secret = process.env.SECRETORPRIVATEKEY || "MOMO123456";
        const expiresIn = "1h";
        const payload = {
            uid: req.body.id
        };

        const token = jwt.sign(payload, secretKey, { expiresIn });

        const decodedToken = jwt.verify(token, secretKey) as JwtPayload;
        const uid = decodedToken.uid;
        const newToken = jwt.sign({ uid }, secretKey, { expiresIn });
        res.status(200).json({ token: newToken });
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }

}

export const getClients = async (req: Request, res: Response) => {
    try {
        let Query = `SELECT * FROM "Client"`;
        const { shopping_id, client_id, email, phone } = req.query;

        if (shopping_id != undefined || client_id != undefined || email != undefined || phone != undefined) {
            const arrayWehere = [];
            shopping_id == "" ? "" : arrayWehere.push({ "shopping_id": shopping_id });
            client_id == "" ? "" : arrayWehere.push({ "client_id": client_id });
            email == "" ? "" : arrayWehere.push({ "email": email });
            phone == "" ? "" : arrayWehere.push({ "phone": phone });

            const result_consult = arrayWehere.map(item => ` ${Object.keys(item)} = '${Object.values(item)}'`).join("OR");
            Query += ` WHERE ${result_consult}`;
        }
        const response = await pool.query(Query);


        return res.status(200).json(response.rows);
    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }


}

