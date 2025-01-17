import { createServer } from 'node:http';
import { Server } from 'socket.io';
import 'dotenv/config';
import process from 'process';
import app from './app.js';
import db from './infrastructure/DB/db.js';
import { up } from './infrastructure/DB/migrations/20250110120909_create_tables.js';
import { seed } from './infrastructure/DB/seeds/fill_tables.js';
import { connectRabbitMQ } from './utils/events/connectRabbitMQ.js';
import { socketHandler } from './utils/handlers/socketHandler.js';

const PORT = parseInt(process.env.PORT as string) || 5050;
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  },
});

socketHandler(io);

server.listen(PORT, async () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${PORT}`);

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('Running migrations and seeding...');
    await up(db);
    await seed(db);
  }

  await connectRabbitMQ();
});
