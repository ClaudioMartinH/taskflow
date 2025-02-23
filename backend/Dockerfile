FROM node:20-alpine

RUN apk add --no-cache bash postgresql-client

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

COPY .env.example /.env

RUN npm run build

EXPOSE 5050

CMD ["npm", "run", "dev"]