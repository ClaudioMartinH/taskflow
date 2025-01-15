import express, { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import 'dotenv/config';
import path from 'path';
import process from 'process'
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import userRouter from './infrastructure/routes/user.routes.js';
import taskRouter from './infrastructure/routes/task.routes.js';
import authRouter from './infrastructure/routes/auth.routes.js';
import boardRouter from './infrastructure/routes/board.routes.js';
import { seed } from './infrastructure/DB/seeds/fill_tables.js';
import db from './infrastructure/DB/db.js';
import { up } from './infrastructure/DB/migrations/20250110120909_create_tables.js';
import { connectRabbitMQ } from './utils/events/connectRabbitMQ.js';

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  },
});
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = parseInt(process.env.PORT as string) || 5050;

const options = {
  origin: 'http://localhost:4200', // Asegúrate de establecer la URL de tu frontend
  credentials: true,
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Authorization',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  maxAge: 86400, // 24 horas
};

// io.on('connection', (socket) => {
//   io.emit('connection', socket)
  
//   socket.on('disconnect', () => {
//     io.emit('disconnection', socket)
//   });
// });


app.use(cors(options));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/boards', boardRouter);

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API!' });
});

server.listen(PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);
  await up(db);
  await seed(db);
  await connectRabbitMQ();
});
