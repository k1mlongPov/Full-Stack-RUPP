import {Pool} from "pg";

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.PORT),
    user: process.env.DB_USER,
    password: String(process.env.DB_PASSWORD),
    database: process.env.DB_NAME,
});


export default pool;