import { NextApiRequest,NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { db } from "@vercel/postgres";

export  async function GET(
    request: NextApiRequest,
    response: NextApiResponse
  ) {
    const client = await db.connect();
  
    try {  
      const b=    request.body
    const { query: { id } } = request;
    
      const { rows } = await client.query(`SELECT * FROM books WHERE id = ${id}`);
      const book = rows[0];
    
      return NextResponse.json(book);
    } catch (error) {
      console.error(error);
      return response.json({error});
    } finally {
      client.release();
    }
  
  }
