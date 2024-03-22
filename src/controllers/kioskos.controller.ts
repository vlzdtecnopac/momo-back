import { Request, Response, query } from "express";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";
import { validationResult } from "express-validator";
import Server from "../app";

const loggsConfig: LoggsConfig = new LoggsConfig();

export const kioskos = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { shopping_id, state } = req.query;
  try {
    let Query = `
    SELECT k.* FROM "Kiosko" k
join "Shopping" s on s.shopping_id = k.shopping_id  `;
    if (shopping_id != undefined || state != undefined) {
      const arrayWehere = [];

      shopping_id == "" ? "" : arrayWehere.push({ "s.shopping_id": shopping_id });
      state == undefined ? "" : arrayWehere.push({ "k.state": state });

      const result_consult = arrayWehere.map(item => ` ${Object.keys(item)} = '${Object.values(item)}'`).join("AND");

      Query += ` WHERE ${result_consult}`;
    }

    Query += " ORDER BY k.id ASC";

    const response = await
      pool.query(Query);
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

  const { shopping_id, state } = req.body;

  try {
    const kiosko_exist = await pool.query("SELECT * FROM \"Kiosko\" WHERE kiosko_id = $1", [req.params.kiosko_id]);
    if (kiosko_exist.rows.length <= 0) {
      return res.status(400).json("El kiosko que desea actualizar no existe.");
    }
    const response = await pool.query(`UPDATE "Kiosko"
    SET  state=$1, shopping_id=$2, update_at=now()
    WHERE kiosko_id=$3  RETURNING kiosko_id, shopping_id;`, [state, shopping_id, req.params.kiosko_id]);

    const consult = await
      pool.query(`SELECT k.*, s.name_shopping FROM "Kiosko" k
      join "Shopping" s on s.shopping_id=k.shopping_id  WHERE k.shopping_id=$1
      ORDER BY k.id ASC`, [shopping_id]);
    Server.instance.io.emit("kiosko-socket", consult.rows);
    if (state == "false") {
      Server.instance.io.emit("kiosko-verify-socket", response.rows[0]);
    }
    return res.status(200).json(response.rows);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }

};

export const deleteKiosko = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const kiosko_exist = await pool.query("SELECT * FROM \"Kiosko\" WHERE kiosko_id = $1", [req.params.kiosko_id]);
    if (kiosko_exist.rows.length <= 0) {
      return res.status(400).json("El kiosko que desea eliminar no existe.");
    }

    const response = await pool.query("DELETE FROM \"Kiosko\" WHERE kiosko_id = $1  RETURNING kiosko_id, shopping_id;", [req.params.kiosko_id]);
    const consult = await pool.query(`SELECT k.*, s.name_shopping FROM "Kiosko" k
    join "Shopping" s on s.shopping_id = k.shopping_id  WHERE k.shopping_id = $1 
    ORDER BY k.id ASC`, [req.query.shopping_id]);
    Server.instance.io.emit("kiosko-socket", consult.rows);
    Server.instance.io.emit("kiosko-verify-socket", response.rows[0]);
    return res.status(200).json(response.rows);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};


export const createKiosko = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { state, nombre, shopping_id } = req.body;

  try {
    const kiosko_exist = await pool.query("SELECT * FROM \"Kiosko\" WHERE id = $1", [req.params.id]);
    if (kiosko_exist.rows.length >= 1) {
      return res.status(400).json({ msg: "El kiosko ya existe cambia el nombre" });
    }

    const response = await pool.query(`
    INSERT INTO "Kiosko"
(kiosko_id, state, nombre, shopping_id, create_at)
VALUES($1, $2, $3, $4, now()) RETURNING kiosko_id;
    `, [uuidv4(), state, nombre, shopping_id]);

    const consult = await
      pool.query(`SELECT k.*, s.name_shopping FROM "Kiosko" k
join "Shopping" s on s.shopping_id = k.shopping_id  WHERE k.shopping_id = $1
ORDER BY k.id ASC`, [shopping_id]);
    Server.instance.io.emit("kiosko-socket", consult.rows);
    return res.status(200).json(response.rows[0]);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};


export const activeKioskoAuto = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const response = await pool.query(`SELECT 
    s.*,
    json_build_object('data', k.* ) as kiosko
    FROM "Shopping" s 
  join "Kiosko" k on k.shopping_id = s.shopping_id  
  WHERE s.shopping_id = $1 and k.state = $2 ORDER BY k.id ASC;`, [req.query.shopping_id, req.query.state]);
    const kiosko_inactives = response.rows;
    if (kiosko_inactives.length > 0) {
      kiosko_inactives.map(async (item, i: number) => {
        const { name_shopping, kiosko: { data } } = item;
        if (!data?.state && i == 0) {
          const SQL = `UPDATE public."Kiosko"
        SET kiosko_id=$1, shopping_id=$2, state=$3, nombre=$4, update_at=now()
        WHERE kiosko_id=$1 RETURNING kiosko_id;
        `;
          const response = await pool.query(SQL, [data?.kiosko_id, data?.shopping_id, true, data?.nombre]);

          const consult = await
            pool.query(`SELECT k.*, s.name_shopping FROM "Kiosko" k
    join "Shopping" s on s.shopping_id = k.shopping_id  WHERE k.shopping_id = $1
    ORDER BY k.id ASC`, [data?.shopping_id]);
          Server.instance.io.emit("kiosko-socket", consult.rows);
          return res.status(200).json({ name_shopping, data });
        }
      });
    } else {
      return res.status(400).json({ msg: "No hay kioskos dispobles por activar." });
    }
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }


};


export const desactiveAllKiosko = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { shopping_id } = req.body;
  try {

    const kactives: string[] = [];

    const Query = "SELECT * FROM \"Kiosko\" k WHERE k.shopping_id = $1 and k.state=true";
    const response = await pool.query(Query, [shopping_id]);

    const QueryTwo = `UPDATE "Kiosko"
    SET  state=false, update_at=now()
    WHERE kiosko_id=$1;
    `;
    response.rows.map((kiosko_actives) => kactives.push(kiosko_actives.kiosko_id));
    kactives.map(async (kiosko_id) => await pool.query(QueryTwo, [kiosko_id]));

    const consult = await
      pool.query(`SELECT k.*, s.name_shopping FROM "Kiosko" k
join "Shopping" s on s.shopping_id = k.shopping_id  WHERE k.shopping_id = $1
ORDER BY k.id ASC`, [shopping_id]);
    Server.instance.io.emit("kiosko-socket", consult.rows);
    Server.instance.io.emit("kiosko-verify-socket", response.rows);
    return res.status(200).json(response.rows);

  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
}

export const getVerifyKiosko = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {kiosko_id} = req.body;
  try{
    let Query = `SELECT * FROM "Kiosko" k WHERE k.kiosko_id = $1`;
    const consult = await
    pool.query(Query, [kiosko_id]);
    return res.status(200).json(consult.rows);
  }catch(e){
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
}
