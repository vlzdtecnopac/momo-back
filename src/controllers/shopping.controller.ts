import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { v4 as uuidv4 } from "uuid";
import { pool } from "../config/db";
import { LoggsConfig } from "../config/logs";

const loggsConfig: LoggsConfig = new LoggsConfig();

export const createShopping = async (req: Request, res: Response) => {
  const { name_shopping, no_shopping, address, email, idenfication, phone } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const response = await pool.query(`
        INSERT INTO "Shopping" (
          shopping_id, name_shopping, no_shooping, address, email, idenfication, phone, create_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, now()) RETURNING shopping_id;
      `, [uuidv4(), name_shopping, no_shopping, address, email, idenfication, phone]);

    return res.status(200).json(response.rows[0]);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }

};

export const getShopping = async (req: Request, res: Response) => {
  const {shopping_id, name_shopping, no_shooping, phone, idenfication} = req.query;
  try {

    let Query = `SELECT id, shopping_id, name_shopping, no_shooping, address, email, idenfication, phone, closing, "open", create_at, update_at
    FROM "Shopping"`;

    if(shopping_id != undefined || name_shopping != undefined || no_shooping != undefined || phone != undefined || idenfication != undefined){
      const arrayWehere = [];
      
      shopping_id == "" ? "" : arrayWehere.push({"shopping_id": shopping_id});
      name_shopping  == "" ? "" : arrayWehere.push({"name_shopping": name_shopping});
      no_shooping  == "" ? "" : arrayWehere.push({"no_shooping": no_shooping});
      phone  == "" ? "" : arrayWehere.push({"phone": phone});
      idenfication == "" ? "" : arrayWehere.push({"idenfication": idenfication});
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

export const updateShopping = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {name_shopping, no_shopping, address, email, idenfication, phone} = req.body;

  const shopping_exist = await pool.query("SELECT * FROM \"Shopping\" WHERE shopping_id = $1", [req.params.id]);
  if (shopping_exist.rows.length <= 0) {
    return res.status(400).json({msg:"El Shopping que desea actualizar no existe."});
  }


  try {
    const response = await pool.query(`
    UPDATE public."Shopping"
    SET  name_shopping=$1, no_shooping=$2, address=$3, email=$4, idenfication=$5, phone=$6, update_at=now()
    WHERE shopping_id=$7;
    `,[name_shopping, no_shopping, address, email, idenfication, phone, req.params.id]);
    return res.status(200).json(response.rows);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};

export const deleteShopping =  async (req: Request, res: Response) =>{
  const shopping_exist = await pool.query("SELECT * FROM \"Shopping\" WHERE shopping_id = $1", [req.params.id]);
  if (shopping_exist.rows.length <= 0) {
    return res.status(400).json({msg:"El Shopping que desea eliminar no existe."});
  }

  try {
    const response = await pool.query(`
    DELETE FROM "Shopping"
    WHERE shopping_id = $1;
    `, [req.params.id]);
    return res.status(200).json(response.rows);
  } catch (e) {
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};

export const updateCloseShopping =  async (req: Request, res: Response) =>{
  try{
    const response = await pool.query(`
    UPDATE "Shopping"
SET closing=now(), update_at=now()
WHERE shopping_id=$1;
    `, [req.params.shopping_id]);
    return res.status(200).json(response.rows);
  }catch(e){
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};

export const updateOpenShopping =  async (req: Request, res: Response) =>{
  try{
    const response = await pool.query(`
    UPDATE "Shopping"
SET "open"=now(), update_at=now()
WHERE shopping_id=$1;
    `, [req.params.shopping_id]);
    return res.status(200).json(response.rows);
  }catch(e){
    loggsConfig.error(`${e}`);
    return res.status(500).json(e);
  }
};