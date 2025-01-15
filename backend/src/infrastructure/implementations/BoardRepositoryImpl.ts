import { Knex } from 'knex';
import { BoardRepository } from '../../domain/repositories/BoardRepository.js';
import { Board } from '../../domain/entities/Board.js';
import { Task } from '../../domain/entities/Task.js';

export class BoardRepositoryImpl implements BoardRepository {
  private knex: Knex;
  constructor(knexInstance: Knex) {
    this.knex = knexInstance;
  }

  async getBoardById(boardId: string): Promise<Board | null> {
    return this.knex('boards').where({ id: boardId }).first();
  }
  async getAllBoardsForUser(userId: string): Promise<Board[]> {
    return this.knex('boards').where({ user_id: userId });
  }
  async createBoard(board: Board): Promise<Board> {
    await this.knex('boards').insert(board);
    return board;
   
  }
  async updateBoard(board: Board): Promise<Board> {
    await this.knex('boards').update(board).where({ id: board.id });
    return board;
  }
  async deleteBoard(boardId: string): Promise<void> {
    await this.knex('boards').delete().where({ id: boardId });
  }
  async getTasksByBoard(boardId: string): Promise<Task[]> {
    return this.knex('tasks').where({ board_id: boardId }).select(); // TODO: Implement this method to fetch tasks related to a board
  }
}
