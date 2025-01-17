import { Server } from 'socket.io';
import { sendMessage } from '../events/listener.js';

export function socketHandler(io: Server) {
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId as string;
    const username = socket.handshake.query.username as string;

    // eslint-disable-next-line no-console
    console.log(`🔵 ${username} connected`);
    io.emit('userConnected', { userId, username });

    sendMessage(
      'notifications',
      JSON.stringify({
        type: 'USER_CONNECTED',
        userId,
        username,
      }),
    );

    socket.on('disconnect', () => {
      // eslint-disable-next-line no-console
      console.log(`🔴 ${username} disconnected`);
      io.emit('userDisconnected', { userId, username });

      sendMessage(
        'notifications',
        JSON.stringify({
          type: 'USER_DISCONNECTED',
          userId,
          username,
        }),
      );
    });

    socket.on('taskUpdated', (task) => {
      io.emit('taskUpdated', task);
      sendMessage(
        'notifications',
        JSON.stringify({
          type: 'TASK_UPDATED',
          task,
        }),
      );
    });

    socket.on('taskAssigned', (task) => {
      io.emit('taskAssigned', task);
      sendMessage(
        'notifications',
        JSON.stringify({
          type: 'TASK_ASSIGNED',
          task,
        }),
      );
    });

    socket.on('taskCompleted', (taskId) => {
      io.emit('taskCompleted', taskId);
      sendMessage(
        'notifications',
        JSON.stringify({
          type: 'TASK_COMPLETED',
          taskId,
        }),
      );
    });
  });
}

// import { Server } from 'socket.io';
// import { sendMessage } from '../events/listener.js';

// export function socketHandler(io: Server) {
//   io.on('connection', (socket) => {
//     const userId = socket.handshake.query.userId as string;
//     const username = socket.handshake.query.username as string;

//     console.log(`✅ Usuario conectado: ${username} (ID: ${userId})`);

//     io.emit('userConnected', { userId, username });
//     sendMessage('userConnected', { userId, username });

//     // 🔥 Manejo de eventos específicos desde el cliente
//     socket.on('newTask', (task) => {
//       console.log(`🆕 Nueva tarea creada: ${task.title}`);
//       io.emit('newTask', task);
//       sendMessage('newTask', task);
//     });

//     socket.on('taskUpdated', (task) => {
//       console.log(`✏️ Tarea actualizada: ${task.title}`);
//       io.emit('taskUpdated', task);
//     });

//     socket.on('taskDeleted', (taskId) => {
//       console.log(`🗑️ Tarea eliminada: ${taskId}`);
//       io.emit('taskDeleted', taskId);
//     });

//     socket.on('taskAssigned', (task) => {
//       console.log(`👤 Tarea asignada a usuario: ${task.assigned_user_id}`);
//       io.emit('taskAssigned', task);
//     });

//     socket.on('taskCompleted', (task) => {
//       console.log(`✅ Tarea completada: ${task.id}`);
//       io.emit('taskCompleted', task);
//     });

//     socket.on('taskStatusUpdated', ({ taskId, status }) => {
//       console.log(`🔄 Estado actualizado para ${taskId}: ${status}`);
//       io.emit('taskStatusUpdated', { taskId, status });
//     });

//     socket.on('taskMovedToColumn', ({ taskId, columnId }) => {
//       console.log(`📌 Tarea ${taskId} movida a columna ${columnId}`);
//       io.emit('taskMovedToColumn', { taskId, columnId });
//     });

//     socket.on('message', (message) => {
//       console.log(`📨 Mensaje recibido: ${message}`);
//       io.emit('message', message);
//     });

//     socket.on('notification', (message) => {
//       console.log(`🔔 Notificación recibida: ${message}`);
//       io.emit('notification', message);
//     });

//     socket.on('error', (error) => {
//       console.error('❌ Socket error:', error);
//       io.emit('error', error);
//     });

//     // 🔥 Manejo de desconexión
//     socket.on('disconnect', () => {
//       console.log(`❌ Usuario desconectado: ${username} (ID: ${userId})`);
//       io.emit('userDisconnected', { userId, username });
//       sendMessage('userDisconnected', { userId, username });
//     });
//   });
// }
