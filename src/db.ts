import 'dotenv/config';
import pg from 'pg';

const {Pool} = pg;

const pool = new Pool({
  user:process.env.DB_USER,
  password: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME
})

export default pool;

