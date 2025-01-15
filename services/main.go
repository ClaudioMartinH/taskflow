package main

import (
	"fmt"
	"log"
	"os"

	"github.com/streadway/amqp"
)



func main() {
	// Conectar a RabbitMQ
	conn, err := amqp.Dial("amqp://user:password@rabbitmq:5672/")
	if err != nil {
		log.Fatalf("Error al conectar a RabbitMQ: %s", err)
		os.Exit(1)
	}
	
	defer conn.Close()

	// Crear un canal
	channel, err := conn.Channel()
	if err != nil {
		log.Fatalf("Error al crear el canal: %s", err)
		os.Exit(1)
	}
	defer channel.Close()

	// Declarar la cola 'notifications' que es la que usas en el backend
	queue, err := channel.QueueDeclare(
		"notifications", // Nombre de la cola (debe coincidir con el que usas en Node.js)
		true,            // Durable (persistente)
		false,           // AutoDelete
		false,           // Exclusive
		false,           // NoWait
		nil,             // Argumentos
	)
	if err != nil {
		log.Fatalf("Error al declarar la cola: %s", err)
		os.Exit(1)
	}

	fmt.Println("Esperando mensajes de la cola 'notifications'...")

	// Consumir los mensajes de la cola 'notifications'
	msgs, err := channel.Consume(
		queue.Name, // Nombre de la cola
		"",         // ConsumerTag
		true,       // AutoAck (automático al recibir el mensaje)
		false,      // Exclusive
		false,      // NoLocal
		false,      // NoWait
		nil,        // Argumentos
	)
	if err != nil {
		log.Fatalf("Error al consumir los mensajes: %s", err)
		os.Exit(1)
	}

	// Procesar los mensajes
	for msg := range msgs {
		fmt.Printf("Mensaje recibido: %s\n", msg.Body)
		// Aquí puedes procesar el mensaje (por ejemplo, actualizar base de datos, enviar notificación, etc.)

	}
}
