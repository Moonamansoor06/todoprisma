import { NextApiRequest, NextApiResponse } from 'next'
import { query } from '../../../utils/database'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req

  switch (method) {
    case 'GET':
      try {
        const { rows: books } = await query('SELECT * FROM books')
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
          res.status(400).json({ message: 'Missing required fields' })
        } else {
          const { rows: book } = await query(
            `INSERT INTO books (bookname, author, booktype, price, qty, isbn) 
            VALUES (${bookname}, ${author}, ${booktype}, ${price}, ${qty}, ${isbn}) RETURNING *`,
            [bookname, author, booktype, price, qty, isbn]
          )
          res.status(201).json(book[0])
        }
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).json({ message: `Method ${method} not allowed` })
  }
}
