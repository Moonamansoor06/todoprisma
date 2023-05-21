//import { applyCors } from '../../../middlewares/cors';
import { NextApiRequest, NextApiResponse } from "next";
//import { prisma } from '../../../utils/prisma'
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["query"],
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    method,
    query: { id } 
  } = req;

  switch (method) {
    case "GET":
      try {
        const todo =await prisma.todo.findUnique({
          where: { id:String(id) },
        });
        if (todo) {
          res.status(200).json(todo);
        } else {
          res.status(404).json({ message: "todo not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect();
      }
      break;
    case "PUT":
      try {
        console.log("request.body i s",req.body)
        const body = JSON.parse(req.body);
        console.log("body from post query",body)
        const { name,completed } = body;
        console.log("name and completed extracted from body",name,completed)
        // if (!name||!completed) {
        //   res.status(400).json({ message: "Missing required fields" });
        // } else {
          const updatedTodo = await prisma.todo.update({
            where: { id: String(id) },

            data: {
              name,
              completed,
            
            },
          });
          res.status(200).json(updatedTodo);
        // }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
      break;
    case "DELETE":
      try {
        const todo = await prisma.todo.delete({
          where: { id:String(id) },
        });
        if (todo) {
          res.status(204).send("todo deleted");
        } else {
          res.status(404).json({ message: `Todo with ID ${id} not found` });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      } finally {
        await prisma.$disconnect(); 
      }
      break;
  }
}
