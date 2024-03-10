import {Request, Response} from "express";
import { pool } from "../config/db";

export const  kioskos = async (req: Request, res: Response) => {

  try{
    const response = await
    pool.query("select * from \"Turno\" t join \"Kiosko\" k  on k.kiosko_id  = t.kiosko_id  limit 1");
return res.status(200).json(response.rows);
  }catch(e){
    console.log(e);
    return res.status(500).json("Internal Server error");
  }
};