export const options = {
  origin: ['http://localhost:4200', 'https://taskflow.martinherranzc.es','https://www.taskflow.martinherranzc.es'],
  credentials: true,
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Authorization',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  maxAge: 86400,
};
