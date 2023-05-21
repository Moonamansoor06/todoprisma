// middlewares/cors.ts
import Cors, { CorsOptions } from 'cors';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

// Define the CORS options
const corsOptions: CorsOptions = {
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

// Create the CORS middleware
const corsMiddleware = Cors(corsOptions);

// Helper function to apply the middleware
export const applyCors = (handler: NextApiHandler) => {
  return (req: NextApiRequest, res: NextApiResponse) => {
    return new Promise((resolve, reject) => {
      corsMiddleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    })
      .then(() => handler(req, res))
      .catch((error) => {
        console.error('CORS error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  };
};
