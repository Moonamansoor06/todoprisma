import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../utils/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
console.log("books is",prisma.books)
  switch (method) {
    case 'GET':
      try {
        const books = await prisma.books.findMany()
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
          const newBook = await prisma.books.create({
            data: {
              bookname,
              author,
              booktype,
              price,
              qty,
              isbn
            }
          })
          res.status(201).json(newBook)
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
