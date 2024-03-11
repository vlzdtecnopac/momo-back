import { Request, Response } from "express";
import { LoggsConfig } from "../config/logs";

const loggsConfig: LoggsConfig = new LoggsConfig();

export const userRegister = async (req: Request, res: Response) => {
    return res.status(200).json("Hola")
}