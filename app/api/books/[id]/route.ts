import { NextApiRequest,NextApiResponse } from "next";
import { NextResponse,NextRequest } from "next/server";
import { db } from "@vercel/postgres";

export  async function GET(
    request: NextRequest,
    response: NextApiResponse,{ query }: {query:{qid:string}}
  ) {
    const client = await db.connect();
  
    try {  
      const {qid}=query
    
      const { rows } = await client.query(`SELECT * FROM books WHERE id = ${qid}`);
      const book = rows[0];
    
      return NextResponse.json(book);
    } catch (error) {
      console.error(error);
      return response.json({error});
    } finally {
      client.release();
    }
  
  }
