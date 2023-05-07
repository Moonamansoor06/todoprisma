import { NextApiResponse, NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';

export async function POST({

  params
} : {
  params: { id: string ,bookname:string, author:string, booktype:string, price:string,
     qty:number, isbn:string}
},   response:NextApiResponse,) {
    
    const baseUrl = process.env.API_BASE_URL;
const url = `${baseUrl}/api/books`;
  const client = await db.connect();
  
 // console.log("request body post",request.body)

  try {
    const {bookname,booktype,author,price,qty,isbn  } = params;
   
    await client.sql`
      INSERT INTO books (bookname, author, booktype, price, qty, isbn)
      VALUES (${bookname}, ${author}, ${booktype}, ${price}, ${qty}, ${isbn})
      RETURNING *
    `, [bookname, author, booktype, price, qty, isbn];
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  } finally {
    client.release();
  }

  const client2 = await db.connect();
  try {
    const { rows } = await client2.sql`SELECT * FROM books`;
    const books = rows;
    return response.status(200).json({ books });
  } catch (error) {
    console.error(error);
    return response.json(error);
  } finally {
    client2.release();
  }
}

export async function GET( res: NextResponse) {
  const client = await db.connect();

  try {
    const { rows } = await client.sql`SELECT * FROM books`;
    const books = rows;
    return NextResponse.json(books);
  } catch (error) {
    console.error(error);
    return res.json();
  } finally {
    client.release();
  }
}

export async function PUT(
 
  response: NextResponse,
  {
    params
  } : {
    params: { id: string ,bookname:string, author:string, booktype:string, price:string,
      qty:number, isbn:string}
  },
  query:{qid:string})
{
  const client = await db.connect();

  try {
    
    const { id, bookname, author, booktype, price, qty, isbn } = params;
    const {qid}=query
    await client.sql`
      UPDATE books SET bookname = $1, author = $2, booktype = $3, price = $4, qty = $5, isbn = $6
      WHERE id = ${qid}
    `, [bookname, author, booktype, price, qty, isbn, id];
  } catch (error) {
    console.error(error);
    return NextResponse.json({error}) ;
  } finally {
    client.release();
  }

  const { rows } = await client.query(`SELECT * FROM books`);
  const books = rows;
  return NextResponse.json({ books });
}

export async function DELETE(
  request: NextApiRequest,
  response: NextApiResponse,
  {
    params
  } : {
    params: { id: string ,bookname:string, author:string, booktype:string, price:string,
      qty:number, isbn:string}
  },
  query:{qid:string}
) {
  const client = await db.connect();

  try {
    const {id}=params
    const { qid } = query;
    await client.sql`DELETE FROM books WHERE id = ${id}`, [id];
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error });
  } finally {
    client.release();
  }

}