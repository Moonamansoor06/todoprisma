import { NextApiRequest, NextApiResponse } from 'next'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const client = await pool.connect()
        const result = await client.query('SELECT * FROM books')
        const books = result.rows
        client.release()

        res.status(200).json(books)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
      break
    case 'POST':
      try {
        const { bookname, author, booktype, price, qty, isbn } = req.body

        if (!bookname || !author || !booktype || !price || !qty || !isbn) {
          res.status(400).json({ message: 'Invalid request' })
          return
        }

        const client = await pool.connect()
        const result = await client.query(
          `INSERT INTO books (bookname, author, booktype, price, qty, isbn) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
          [bookname, author, booktype, price, qty, isbn]
        )
        const book = result.rows[0]
        client.release()

        res.status(201).json(book)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
      break
    case 'DELETE':
      try {
        const { id } = req.query

        if (!id) {
          res.status(400).json({ message: 'Invalid request' })
          return
        }

        const client = await pool.connect()
        const result = await client.query(
          `DELETE FROM books WHERE id=${id} RETURNING *`
        )
        const book = result.rows[0]
        client.release()

        if (!book) {
          res.status(404).json({ message: 'Book not found' })
          return
        }

        res.status(200).json(book)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
      break
    default:
      res.status(405).json({ message: 'Method not allowed' })
  }
}
