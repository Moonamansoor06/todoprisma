//import { applyCors } from '../../../middlewares/cors';
import { NextApiRequest, NextApiResponse } from "next";
import {PrismaClient} from '@prisma/client';


export const prisma = new PrismaClient({
  log: ["query"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  switch (method) {
    case "GET":
      try {
        const todo = await prisma.todo.findMany();
        res.status(200).json(todo);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
      break;
    case "POST":
      try {
        console.log("request.body i s",req.body)
        const body = JSON.parse(req.body);
        console.log("body from post query",body)
        const { name,completed } = body;
        console.log("name and completed extracted from body",name,completed)
        // if (!name||!completed) {
        //   res.status(400).json({ message: "Missing required fields" });
        // } else {
          const newTodo = await prisma.todo.create({
            data: {
              name,
              completed
            },
          });
          res.status(201).json(newTodo);
        // }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
      break;
  }
}
