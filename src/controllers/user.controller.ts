import { Request, Response } from "express";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";

const loggsConfig: LoggsConfig = new LoggsConfig();

export const userRegisterEmploye = async (req: Request, res: Response) => {
    const { shopping_id, first_name, last_name, phone, email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {

    } catch (e) {
        loggsConfig.error(`${e}`);
        return res.status(500).json(e);
    }
}