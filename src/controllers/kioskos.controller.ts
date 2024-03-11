import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";
import Server from "../app";

const loggsConfig: LoggsConfig = new LoggsConfig();

export const kioskos = async (req: Request, res: Response) => {
  try {
    const response = await
      pool.query(`
      SELECT k.*, s.name_shopping FROM "Kiosko" k
join "Shopping" s on s.shopping_id = k.shopping_id 
ORDER BY k.id ASC`);
    Server.instance.io.emit("kiosko-socket", response.rows);
    return res.status(200).json(response.rows);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};

export const updateKiosko = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const kiosko_exist = await pool.query(`SELECT * FROM "Kiosko" WHERE id = $1`, [req.params.id]);
    if (kiosko_exist.rows.length <= 0) {
      return res.status(400).json("El kiosko que desea actualizar no existe.");
    }
    const response = await pool.query(`UPDATE "Kiosko"
    SET  state = $1, update_at= now()
    WHERE id = $2`, [req.query.state, req.params.id]);

    const consult = await
      pool.query(`SELECT k.*, s.name_shopping FROM "Kiosko" k
      join "Shopping" s on s.shopping_id = k.shopping_id 
      ORDER BY k.id ASC`);
    Server.instance.io.emit("kiosko-socket", consult.rows);

    return res.status(200).json(response.rows);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }

}

export const deleteKiosko = async (req: Request, res: Response) => {
  try{
    const kiosko_exist = await pool.query(`SELECT * FROM "Kiosko" WHERE id = $1`, [req.params.id]);
    if (kiosko_exist.rows.length <= 0) {
      return res.status(400).json("El kiosko que desea eliminar no existe.");
    }

    const response = await pool.query(`DELETE FROM "Kiosko" WHERE id = $1`, [req.params.id]);
    const consult = await pool.query(`SELECT k.*, s.name_shopping FROM "Kiosko" k
    join "Shopping" s on s.shopping_id = k.shopping_id 
    ORDER BY k.id ASC`);

    Server.instance.io.emit("kiosko-socket", consult.rows);
    return res.status(200).json(response.rows);
  }catch(e){
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
}


export const createKiosko = async (req: Request, res: Response) => {
  const {state, nombre, shopping_id} = req.body;
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const kiosko_exist = await pool.query(`SELECT * FROM "Kiosko" WHERE id = $1`, [req.params.id]);
    if (kiosko_exist.rows.length >= 1) {
      return res.status(400).json("El kiosko ya existe cambia el nombre");
    }

    const response = await pool.query(`
    INSERT INTO "Kiosko"
(kiosko_id, state, nombre, shopping_id, create_at)
VALUES($1, $2, $3, $4, now());
    `, [uuidv4(), state, nombre, shopping_id]);

    const consult = await
    pool.query(`SELECT k.*, s.name_shopping FROM "Kiosko" k
join "Shopping" s on s.shopping_id = k.shopping_id 
ORDER BY k.id ASC`);
    Server.instance.io.emit("kiosko-socket", consult.rows);
    return res.status(200).json(response.rows);

  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};