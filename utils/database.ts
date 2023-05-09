import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const newPost = await prisma.post.create({
    data: {
      title: 'Hello World',
      content: 'This is my first post',
      published: true,
      author: {
        connect: { email: 'jane.doe@example.com' },
      },
    },
  });
  console.log('Created new post:', newPost);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());






// import { Pool } from 'pg';

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// export async function query(q: string, values?: any[]) {
//   const client = await pool.connect();
//   try {
//     const result = await client.query(q, values);
//     return result;
//   } catch (e) {
//     throw e;
//   } finally {
//     client.release();
//   }
// }

// // test the connection
// query('SELECT NOW()').then((res) => {
//   console.log('Connected to database at', res.rows[0].now);
// }).catch((err) => {
//   console.error('Error connecting to database', err);
// });
