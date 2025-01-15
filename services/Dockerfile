# Usa la imagen oficial de Go
FROM golang:1.23.2-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el código fuente de Go al contenedor
COPY . .

# Compila la aplicación Go
RUN go build -o app .

# Expone el puerto si es necesario (no obligatorio para RabbitMQ)
EXPOSE 8080

# Ejecuta la aplicación Go
CMD ["./app"]
