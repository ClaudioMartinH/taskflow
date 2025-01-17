import { Knex } from 'knex';
import { Task } from '../../domain/entities/Task.js';
import { TaskRepository } from '../../domain/repositories/TaskRepository.js';
import { NotFoundError } from '../../utils/errors/Errors.js';
import { User } from '../../domain/entities/User.js';
import { Board } from '../../domain/entities/Board.js';
import { TASK_STATUS } from '../../utils/types/types.js';

export class TaskRepositoryImpl implements TaskRepository {
  private knex: Knex;

  constructor(knexInstance: Knex) {
    this.knex = knexInstance;
  }

  private baseSelect() {
    return [
      'tasks.*',
      'task_users.id as user_id',
      'task_users.username',
      'task_users.fullname',
      'task_users.email',
      'task_users.profile_pic', 
      'assigned_users.id as assigned_user_id',
      'assigned_users.username as assigned_username',
      'assigned_users.profile_pic as assigned_profile_pic',
      'boards.id as board_id',
      'boards.name as board_name',
    ];
  }

  private async getTaskWithJoins(query: Knex.QueryBuilder) {
    const taskData = await query
      .leftJoin('users as task_users', 'tasks.user_id', 'task_users.id')
      .leftJoin(
        'users as assigned_users',
        'tasks.assigned_user_id',
        'assigned_users.id',
      )
      .leftJoin('boards', 'tasks.board_id', 'boards.id')
      .first();

    if (!taskData) {
      throw new NotFoundError('Task not found.');
    }

    const user = new User(
      taskData.user_id,
      taskData.username,
      taskData.fullname,
      taskData.email,
      '',
      taskData.profile_pic,
    );

    const board = new Board(
      taskData.board_id,
      taskData.board_name,
      taskData.user_id,
    );

    return new Task(
      taskData.id,
      taskData.title,
      taskData.description,
      user.id,
      board.id,
      taskData.task_status,
      taskData.completed,
      taskData.assigned_user_id,
      taskData.assigned_username,
      taskData.assigned_profile_pic, 
    );
  }

  async getAllTasks(): Promise<Task[]> {
    const tasks = await this.knex('tasks')
      .select(this.baseSelect())
      .leftJoin('users as task_users', 'tasks.user_id', 'task_users.id')
      .leftJoin(
        'users as assigned_users',
        'tasks.assigned_user_id',
        'assigned_users.id',
      )
      .leftJoin('boards', 'tasks.board_id', 'boards.id');

    return tasks.map((task) => {
      const user = new User(
        task.user_id,
        task.username,
        task.fullname,
        task.email,
        '',
        task.profile_pic,
      );

      const board = new Board(task.board_id, task.board_name, task.user_id);

      return new Task(
        task.id,
        task.title,
        task.description,
        user.id,
        board.id,
        task.task_status,
        task.completed,
        task.assigned_user_id,
      );
    });
  }

  async getTaskById(taskId: string): Promise<Task | null> {
    return this.getTaskWithJoins(
      this.knex('tasks').select(this.baseSelect()).where('tasks.id', taskId),
    );
  }

  async createTask(task: Task): Promise<void> {
    await this.knex('tasks').insert(task);
  }

  async updateTask(taskId: string, updatedTask: Task): Promise<void> {
    await this.knex('tasks').update(updatedTask).where({ id: taskId });
  }

  async deleteTask(taskId: string): Promise<void> {
    await this.knex('tasks').delete().where({ id: taskId });
  }

  async getAllTasksByBoardId(boardId: string): Promise<Task[]> {
    const tasks = await this.knex('tasks')
      .select(this.baseSelect())
      .leftJoin('users as task_users', 'tasks.user_id', 'task_users.id')
      .leftJoin('boards', 'tasks.board_id', 'boards.id')
      .where('tasks.board_id', boardId);

    return tasks.map((task) => {
      const user = new User(
        task.user_id,
        task.username,
        task.fullname,
        task.email,
        '',
        task.profile_pic,
      );

      const board = new Board(task.board_id, task.board_name, task.user_id);

      return new Task(
        task.id,
        task.title,
        task.description,
        user.id,
        board.id,
        task.task_status,
        task.completed,
        task.assigned_user_id,
      );
    });
  }

  async completeTask(taskId: string): Promise<Task> {
    await this.knex('tasks').update({ completed: true }).where({ id: taskId });
    return this.getTaskById(taskId) as Promise<Task>;
  }

  async toggleState(taskId: string, state: string): Promise<void> {
    await this.knex('tasks')
      .update({ task_status: state })
      .where({ id: taskId });
  }

  async assignTaskToUser(taskId: string, userId: string): Promise<void> {
    await this.knex('tasks')
      .update({ assigned_user_id: userId, task_status: TASK_STATUS.ASSIGNED })
      .where({ id: taskId });
  }
}

// import { Knex } from 'knex';
// import { Task } from '../../domain/entities/Task.js';
// import { TaskRepository } from '../../domain/repositories/TaskRepository.js';
// import { NotFoundError } from '../../utils/errors/Errors.js';
// import { User } from '../../domain/entities/User.js';
// import { Board } from '../../domain/entities/Board.js';
// import { TASK_STATUS } from '../../utils/types/types.js';

// export class TaskRepositoryImpl implements TaskRepository {
//   private knex: Knex;
//   constructor(knexInstance: Knex) {
//     this.knex = knexInstance;
//   }

//   async getAllTasks(): Promise<Task[]> {
//     const tasks = await this.knex('tasks')
//       .select(
//         'tasks.*',
//         'users.id as user_id',
//         'users.username',
//         'users.fullname',
//         'users.email',
//         'boards.id as board_id',
//         'boards.name as board_name'
//       )
//       .leftJoin('users', 'tasks.user_id', 'users.id')
//       .leftJoin('users', 'tasks.assigned_user_id', 'users.id')
//       .leftJoin('boards', 'tasks.board_id', 'boards.id');

//     // Mapea los datos para crear instancias de Task
//     return tasks.map((task) => {
//       const user = new User(
//         task.user_id,
//         task.username,
//         task.fullname,
//         task.email,
//         '',
//         task.profile_pic
//       );
//       const board = new Board(task.board_id, task.board_name, task.user_id);
//       return new Task(
//         task.id,
//         task.title,
//         task.description,
//         user.id,
//         board.id,
//         task.task_status,
//         task.completed,
//         task.assigned_user_id
//       );
//     });
//   }

//   async getTaskById(taskId: string): Promise<Task | null> {
//     const taskData = await this.knex('tasks')
//       .select(
//         'tasks.*',
//         'users.id as user_id',
//         'users.username',
//         'users.fullname',
//         'users.email',
//         'boards.id as board_id',
//         'boards.name as board_name'
//       )
//       .leftJoin('users', 'tasks.user_id', 'users.id')
//       .leftJoin('users', 'tasks.assigned_user_id', 'users.id')
//       .leftJoin('boards', 'tasks.board_id', 'boards.id')
//       .where('tasks.id', taskId)
//       .first();

//     if (!taskData) return null;

//     const user = taskData.user_id
//       ? new User(
//           taskData.user_id,
//           taskData.username,
//           taskData.fullname,
//           taskData.email,
//         '',
//           taskData.profile_pic
//         )
//       : null;
//     const board = taskData.board_id
//       ? new Board(taskData.board_id, taskData.board_name, taskData.user_id)
//       : null;

//     if (!user || !board) {
//       throw new NotFoundError('User or Board not found.');
//     }

//     return new Task(
//       taskData.id,
//       taskData.title,
//       taskData.description,
//       user.id,
//       board.id,
//       taskData.task_status,
//       taskData.completed,
//       taskData.assigned_user_id
//     );
//   }

//   async createTask(task: Task): Promise<void> {
//     await this.knex('tasks').insert(task);
//   }
//   async updateTask(taskId: string, updatedTask: Task): Promise<void> {
//     await this.knex('tasks').update(updatedTask).where({ id: taskId });
//   }
//   async deleteTask(taskId: string): Promise<void> {
//     await this.knex('tasks').delete().where({ id: taskId });
//   }
//   async getAllTasksByBoardId(boardId: string): Promise<Task[]> {
//     return this.knex('tasks').where({ board_id: boardId }).select();
//   }
//   async getTasksByUser(userId: string): Promise<Task[]> {
//     const tasks = await this.knex('tasks')
//       .select(
//         'tasks.*',
//         'users.id as user_id',
//         'users.username',
//         'users.fullname',
//         'users.email',
//         'boards.id as board_id',
//         'boards.name as board_name'
//       )
//       .leftJoin('users', 'tasks.user_id', 'users.id')
//       .leftJoin('users', 'tasks.assigned_user_id', 'users.id')
//       .leftJoin('boards', 'tasks.board_id', 'boards.id')
//       .where('tasks.user_id', userId);

//     return tasks.reduce<Task[]>((acc, task) => {
//       if (task.user_id && task.board_id) {
//         const user = new User(
//           task.user_id,
//           task.username,
//           task.fullname,
//           task.email,
//           '',
//           task.profile_pic
//         );
//         const board = new Board(task.board_id, task.board_name, task.user_id);
//         acc.push(
//           new Task(
//             task.id,
//             task.title,
//             task.description,
//             user.id,
//             board.id,
//             task.task_status,
//             task.completed,
//             task.assigned_user_id
//           )
//         );
//       }
//       return acc;
//     }, []);
//   }

//   async getTaskCountByBoardId(boardId: string): Promise<number> {
//     const result = await this.knex('tasks')
//       .where({ board_id: boardId })
//       .count('id as task_count')
//       .first();
//     return result ? Number(result.task_count) : 0;
//   }
//   async getTaskCountByUser(userId: string): Promise<number> {
//     const result = await this.knex('tasks')
//       .where({ user_id: userId })
//       .count('id as task_count')
//       .first();
//     return result ? Number(result.task_count) : 0;
//   }
//   async completeTask(taskId: string): Promise<Task> {
//     try {
//      this.knex('tasks')
//         .update({ completed: true })
//         .where({ id: taskId })
//         .toSQL();

//      await this.knex('tasks')
//         .update({ completed: true })
//         .where({ id: taskId });

//       const updatedTaskData = await this.knex('tasks')
//         .select(
//           'tasks.*',
//           'users.id as user_id',
//           'users.username',
//           'users.fullname',
//           'users.email',
//           'boards.id as board_id',
//           'boards.name as board_name'
//         )
//         .leftJoin('users', 'tasks.user_id', 'users.id')
//         .leftJoin('users', 'tasks.assigned_user_id', 'users.id')
//         .leftJoin('boards', 'tasks.board_id', 'boards.id')
//         .where('tasks.id', taskId)
//         .first();

//       if (!updatedTaskData) {
//         throw new NotFoundError('Task not found.');
//       }

//       if (!updatedTaskData.user_id || !updatedTaskData.board_id) {
//         throw new NotFoundError('User or Board not found.');
//       }

//       const userNew = new User(
//         updatedTaskData.user_id,
//         updatedTaskData.username,
//         updatedTaskData.fullname,
//         updatedTaskData.email,
//         '',
//         updatedTaskData.profile_pic
//       );
//       const boardNew = new Board(
//         updatedTaskData.board_id,
//         updatedTaskData.board_name,
//         updatedTaskData.user_id
//       );

//       const updatedTask = new Task(
//         updatedTaskData.id,
//         updatedTaskData.title,
//         updatedTaskData.description,
//         userNew.id,
//         boardNew.id,
//         updatedTaskData.task_status,
//         updatedTaskData.completed,
//         updatedTaskData.assigned_user_id
//       );

//       return updatedTask;
//     } catch (error) {
//       console.error('Error al completar la tarea:', error);
//       throw error;
//     }
//   }

//   async toggleState(taskId: string, state: string): Promise<void> {
//     await this.knex('tasks')
//      .update({ task_status: state })
//      .where({ id: taskId });
//   }

//   async assignTaskToUser(taskId: string, userId: string): Promise<void> {
//     await this.knex('tasks')
//      .update({ assigned_user_id: userId, task_status: TASK_STATUS.ASSIGNED })
//      .where({ id: taskId });
//   }
// }
