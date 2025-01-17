package main

import (
	"fmt"
	"log"
	"encoding/json"
	"github.com/streadway/amqp"
)

type Event struct {
	Type     string `json:"type"`
	UserId   string `json:"userId,omitempty"`
	Username string `json:"username,omitempty"`
	Task     string `json:"task,omitempty"`
	TaskId   string `json:"taskId,omitempty"`
}

func main() {
	conn, err := amqp.Dial("amqp://user:password@rabbitmq:5672/")
	if err != nil {
		log.Fatal("Error conectando a RabbitMQ:", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatal("Error abriendo un canal:", err)
	}
	defer ch.Close()

	q, err := ch.QueueDeclare(
		"notifications",
		true,  // Durable
		false, // Delete when unused
		false, // Exclusive
		false, // No-wait
		nil,   // Arguments
	)
	if err != nil {
		log.Fatal("Error declarando la cola:", err)
	}

	msgs, err := ch.Consume(
		q.Name, // Queue name
		"",     // Consumer name
		true,   // Auto-ack
		false,  // Exclusive
		false,  // No-local
		false,  // No-wait
		nil,    // Args
	)
	if err != nil {
		log.Fatal("Error al consumir la cola:", err)
	}

	forever := make(chan bool)

	go func() {
		for msg := range msgs {
			var event Event
			if err := json.Unmarshal(msg.Body, &event); err != nil {
				log.Println("Error al parsear mensaje:", err)
				continue
			}

			switch event.Type {
			case "USER_CONNECTED":
				fmt.Printf("✅ Usuario conectado: %s (ID: %s)\n", event.Username, event.UserId)
			case "USER_DISCONNECTED":
				fmt.Printf("❌ Usuario desconectado: %s (ID: %s)\n", event.Username, event.UserId)
			case "TASK_CREATED":
				fmt.Printf("🆕 Nueva tarea creada: %s\n", event.Task)
			case "TASK_UPDATED":
				fmt.Printf("✏️ Tarea actualizada: %s\n", event.Task)
			case "TASK_DELETED":
				fmt.Printf("🗑️ Tarea eliminada: %s\n", event.TaskId)
			default:
				fmt.Println("⚠️ Evento desconocido:", event)
			}
		}
	}()

	fmt.Println("📡 Escuchando eventos en la cola de RabbitMQ...")
	<-forever
}


// package main

// import (
// 	"fmt"
// 	"log"
// 	"os"

// 	"github.com/streadway/amqp"
// )



// func main() {
// 	// Conectar a RabbitMQ
// 	conn, err := amqp.Dial("amqp://user:password@rabbitmq:5672/")
// 	if err != nil {
// 		log.Fatalf("Error al conectar a RabbitMQ: %s", err)
// 		os.Exit(1)
// 	}
	
// 	defer conn.Close()

// 	// Crear un canal
// 	channel, err := conn.Channel()
// 	if err != nil {
// 		log.Fatalf("Error al crear el canal: %s", err)
// 		os.Exit(1)
// 	}
// 	defer channel.Close()

// 	// Declarar la cola 'notifications' que es la que usas en el backend
// 	queue, err := channel.QueueDeclare(
// 		"notifications", // Nombre de la cola (debe coincidir con el que usas en Node.js)
// 		true,            // Durable (persistente)
// 		false,           // AutoDelete
// 		false,           // Exclusive
// 		false,           // NoWait
// 		nil,             // Argumentos
// 	)
// 	if err != nil {
// 		log.Fatalf("Error al declarar la cola: %s", err)
// 		os.Exit(1)
// 	}

// 	fmt.Println("Esperando mensajes de la cola 'notifications'...")

// 	// Consumir los mensajes de la cola 'notifications'
// 	msgs, err := channel.Consume(
// 		queue.Name, // Nombre de la cola
// 		"",         // ConsumerTag
// 		true,       // AutoAck (automático al recibir el mensaje)
// 		false,      // Exclusive
// 		false,      // NoLocal
// 		false,      // NoWait
// 		nil,        // Argumentos
// 	)
// 	if err != nil {
// 		log.Fatalf("Error al consumir los mensajes: %s", err)
// 		os.Exit(1)
// 	}

// 	// Procesar los mensajes
// 	for msg := range msgs {
// 		fmt.Printf("Mensaje recibido: %s\n", msg.Body)
// 		// Aquí puedes procesar el mensaje (por ejemplo, actualizar base de datos, enviar notificación, etc.)

// 	}
// }
