import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

export async function query(q: string, values?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    throw e;
  } finally {
    client.release();
  }
}

// test the connection
query('SELECT NOW()').then((res) => {
  console.log('Connected to database at', res.rows[0].now);
}).catch((err) => {
  console.error('Error connecting to database', err);
});
