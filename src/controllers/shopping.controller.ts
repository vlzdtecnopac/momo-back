import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { pool } from "../config/db";


export const createShopping = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
        const response = await pool.query(`UPDATE "Kiosko"
        SET  state = ${req.query.state}, update_at= now()
        WHERE id = '${req.params.id}'`);

        return res.status(200).json(response.rows);

    }catch(e){
        return res.status(500).json(e);
    }
    
}