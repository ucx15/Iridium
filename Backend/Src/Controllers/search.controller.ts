// Controllers/search.controller.ts

import dotenv from 'dotenv';

// Controllers and Models
import Post from '../Models/post.model.js';
import User from '../Models/user.model.js';


// Types
import { Request, Response, RequestHandler } from 'express';
import validateRequestBody from '../utils.js';

dotenv.config();

const search: RequestHandler = async (req: Request, res: Response) => {
  const { body } = validateRequestBody(req.body, ['query']);

  if (!body || !body.query) {
    res.status(400).json({
      message: 'Missing required fields',
      status: 'error'
    });
    return;
  }

  const query = body.query.toLowerCase();
  const users = await User.search(query);

  if (!users || users.length === 0) {
    res.status(404).json({
      message: 'No users found',
      status: 'error',
      users: null
    });
    return;
  }

  // const returnData = users.map(user => user.username);
  const returnData = users.map(({_id, ...rest}) => rest);

  res.status(200).json({
    message: 'Search results found',
    status: 'success',
    users: returnData,
  });
}

export { search };
