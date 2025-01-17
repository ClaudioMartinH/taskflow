import express from 'express';
import cors from 'cors';
import process from 'process';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import path from 'path';
import { options } from './utils/config/cors.js';
import { Request, Response } from 'express';
import userRouter from './infrastructure/routes/user.routes.js';
import taskRouter from './infrastructure/routes/task.routes.js';
import authRouter from './infrastructure/routes/auth.routes.js';
import boardRouter from './infrastructure/routes/board.routes.js';
import { sendResponse } from './utils/handlers/http.js';
import { STATUS } from './utils/states/Status.js';

const app = express();

app.use(cors(options));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.get('/uploads/:filename', (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'uploads', req.params.filename);
  res.sendFile(filePath);
});

app.use('/api/v1/', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/boards', boardRouter);

app.get('/', (_req: Request, res: Response) => {
  sendResponse(res, STATUS.OK, 'Welcome to the API!');
});

export default app;
