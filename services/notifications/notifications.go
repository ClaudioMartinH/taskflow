package notifications

import (
	"encoding/json"
	"log"

	"github.com/streadway/amqp"
)

type NotificationMessage struct {
	Type       string `json:"type"`
	TaskID     string `json:"taskId"`
	Title      string `json:"title"`
	AssignedTo string `json:"assignedTo"`
	CreatedAt  string `json:"createdAt"`
}

func StartRabbitMQListener() error {
	conn, err := amqp.Dial("amqp://user:password@localhost:5672")
	if err != nil {
		return err
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	queueName := "notifications"
	msgs, err := ch.Consume(
		queueName,
		"",
		true,  // Auto-acknowledge
		false, // No exclusive
		false, // No local
		false, // No-wait
		nil,   // Args
	)
	if err != nil {
		return err
	}

	log.Printf("Esperando mensajes en la cola '%s'...", queueName)

	// Procesar mensajes en un canal
	go func() {
		for d := range msgs {
			var notification NotificationMessage
			err := json.Unmarshal(d.Body, &notification)
			if err != nil {
				log.Printf("Error deserializando mensaje: %v", err)
				continue
			}

			log.Printf("Mensaje recibido: %+v", notification)

			// Procesar notificación (ej. enviar email o push notification)
			processNotification(notification)
		}
	}()

	// Mantener la conexión activa
	// Espera por un canal para recibir los mensajes
	<-ch.NotifyClose(make(chan *amqp.Error))
	log.Println("Conexión cerrada con RabbitMQ")
	return nil
}

func processNotification(notification NotificationMessage) {
	// Aquí puedes implementar la lógica para enviar notificaciones.
	log.Printf("Procesando notificación para la tarea '%s', asignada a '%s'.", notification.Title, notification.AssignedTo)
}
