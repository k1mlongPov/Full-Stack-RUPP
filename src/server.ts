import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import pool from "./config/db";

const PORT = Number(process.env.APP_PORT) || 3000;
console.log({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
pool.connect().then(() => {
    console.log('Connected database successfully');
}).catch(error => {
    console.log('Failed to connect to database', error);
});
app.listen(PORT, () => {
    console.log(`Server is running on port: http://localhost:${PORT}/api-docs`);
});
