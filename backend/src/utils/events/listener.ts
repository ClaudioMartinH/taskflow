import amqp from "amqplib";
import { Buffer } from "buffer";

export async function sendMessage(queue: string, message: string) {
  try {
    const connection = await amqp.connect("amqp://user:password@rabbitmq:5672");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
}
