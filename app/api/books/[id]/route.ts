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
  const { id } = req.query

  switch (method) {
    case 'GET':
      try {
        if (!id) {
          res.status(400).json({ message: 'Invalid request' })
          return
        }

        const client = await pool.connect()
        const result = await client.query(
          `SELECT * FROM books WHERE id=${id}`
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
    case 'PUT':
      try {
        if (!id) {
          res.status(400).json({ message: 'Invalid request' })
          return
        }

        const { bookname, author, booktype, price, qty, isbn } = req.body

        if (!bookname || !author || !booktype || !price || !qty || !isbn) {
          res.status(400).json({ message: 'Invalid request' })
          return
        }

        const client = await pool.connect()
        const result = await client.query(
          `UPDATE books SET bookname=${bookname}, author=${author}, booktype=${booktype}, price=${price}, qty=${qty}, isbn=${isbn} WHERE id=$7 RETURNING *`,
          [bookname, author, booktype, price, qty, isbn, id]
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
    case 'DELETE':
      try {
        if (!id) {
          res.status(400).json({ message: 'Invalid request' })
          return
        }

        const client = await pool.connect()
        const result = await client.query(
          `DELETE FROM books WHERE id=${id} RETURNING *`,
          [id]
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
