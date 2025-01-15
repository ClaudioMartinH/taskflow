import amqp from "amqplib";
import process from 'process'
import "dotenv/config";

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect({
      hostname: process.env.RABBITMQ_HOST ?? "rabbitmq",
      port: parseInt(process.env.RABBITMQ_PORT ?? "5672", 10),
      username: process.env.RABBITMQ_USER ?? "user",
      password: process.env.RABBITMQ_PASS ?? "password",
    });
    const channel = await connection.createChannel();
    // eslint-disable-next-line no-console
    console.log("Conectado a RabbitMQ");
    return channel;
  } catch (error) {
    console.error("Error al conectar con RabbitMQ:", error);
    throw error;
  }
}
