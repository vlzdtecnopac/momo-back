
import { Pool } from "pg";

export const pool = new Pool({
    host: "mongocofee.cflkp1qysre8.us-east-1.rds.amazonaws.com",
    database: "postgres",
    user: "postgres",
    password: "Atenea1989",
    max: 20,
    connectionTimeoutMillis: 20000,
    idleTimeoutMillis: 5000,
    ssl: {
      rejectUnauthorized: false,
    },
});






