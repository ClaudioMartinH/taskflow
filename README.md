# 🚀 TaskBoard - Project Management App

## 🌍 English Version

### 📌 Description
TaskBoard is a web-based project management application that allows users to create, assign, and track tasks in an organized way. The system includes real-time updates via WebSockets, user authentication, and a clean interface for managing boards and tasks efficiently.

![TaskBoard Screenshot](/demo.gif) <!-- Replace with actual screenshot -->

### 🎥 Demo
Watch a demo of TaskBoard in action:

[![Watch the video](path/to/thumbnail.png)](sample.mp4) <!-- Replace with actual video thumbnail -->

---

## 🛠 Installation & Setup

### 1️⃣ **Clone the Repository**
```sh
 git clone https://github.com/ClaudioMartinH/taskflow.git
 cd taskflow
```

### 2️⃣ **Setup Environment Variables**
Create a `.env` file in the root directory and configure it as follows:
```ini
NODE_ENV=development
PORT=5050
DATABASE_URL=postgres://user:password@localhost:5432/taskboard
RABBITMQ_URL=amqp://user:password@rabbitmq:5672
```

### 3️⃣ **Install Dependencies**
```sh
npm install
```

### 4️⃣ **Run Migrations & Seed Database**
```sh
npm run migrate && npm run seed
```

### 5️⃣ **Start the Application**
```sh
npm run dev  # Development Mode
npm run start # Production Mode
```

### 6️⃣ **Run with Docker (Optional)**
```sh
docker-compose up --build
```

---

## 🚀 Features
- User authentication (JWT-based)
- Real-time updates with WebSockets
- Task assignment to users
- Drag & Drop functionality for task management
- RESTful API with Express & PostgreSQL
- RabbitMQ for message queuing

---

## 🤝 Contributing
Contributions are welcome! Please submit a pull request or open an issue.

---

## 📜 License
This project is licensed under the MIT License.

---

# 🌎 Versión en Español

### 📌 Descripción
TaskBoard es una aplicación web para la gestión de proyectos que permite a los usuarios crear, asignar y hacer seguimiento de tareas de manera organizada. Incluye actualizaciones en tiempo real con WebSockets, autenticación de usuarios y una interfaz intuitiva para la gestión de tableros y tareas.

![Captura de pantalla de TaskBoard](path/to/screenshot.png) <!-- Reemplazar con una captura real -->

### 🎥 Demo
Mira un video demostrativo de TaskBoard en acción:

[![Ver el video](path/to/thumbnail.png)](sample.mp4) <!-- Reemplazar con la miniatura real del video -->

---

## 🛠 Instalación y Configuración

### 1️⃣ **Clonar el Repositorio**
```sh
 git clone https://github.com/your-repo/taskboard.git
 cd taskboard
```

### 2️⃣ **Configurar Variables de Entorno**
Crea un archivo `.env` en la raíz del proyecto y configúralo de la siguiente manera:
```ini
NODE_ENV=development
PORT=5050
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/taskboard
RABBITMQ_URL=amqp://usuario:contraseña@rabbitmq:5672
```

### 3️⃣ **Instalar Dependencias**
```sh
npm install
```

### 4️⃣ **Ejecutar Migraciones y Poblar la Base de Datos**
```sh
npm run migrate && npm run seed
```

### 5️⃣ **Iniciar la Aplicación**
```sh
npm run dev  # Modo Desarrollo
npm run start # Modo Producción
```

### 6️⃣ **Ejecutar con Docker (Opcional)**
```sh
docker-compose up --build
```

---

## 🚀 Funcionalidades
- Autenticación de usuarios (JWT)
- Actualizaciones en tiempo real con WebSockets
- Asignación de tareas a usuarios
- Funcionalidad de arrastrar y soltar para gestión de tareas
- API RESTful con Express y PostgreSQL
- RabbitMQ para mensajería

---

## 🤝 Contribuir
¡Las contribuciones son bienvenidas! Envía un pull request o abre un issue.

---

## 📜 Licencia
Este proyecto está bajo la licencia MIT.

