import { v4 as uuidv4 } from "uuid";
import { Board } from "../../domain/entities/Board.js";
import { Task } from "../../domain/entities/Task.js";
import { BoardRepository } from "../../domain/repositories/BoardRepository.js";
import { NotFoundError, ValidationError } from "../../utils/errors/Errors.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { TaskRepository } from "../../domain/repositories/TaskRepository.js";

export class BoardService {
  private boardRepository: BoardRepository;
  private userRepository: UserRepository;
  private taskRepository: TaskRepository;
  constructor(
    boardRepository: BoardRepository,
    userRepositpry: UserRepository,
    taskRepository: TaskRepository
  ) {
    this.boardRepository = boardRepository;
    this.userRepository = userRepositpry;
    this.taskRepository = taskRepository;
  }

  async getAllBoardsForUser(userId: string): Promise<Board[]> {
    const boards = await this.boardRepository.getAllBoardsForUser(userId);
    if (!boards) return [];
    return boards;
  }
  async getBoardById(boardId: string): Promise<Board | null> {
    const board = await this.boardRepository.getBoardById(boardId);
    if (!board) throw new NotFoundError(`Board not found`);
    return board;
  }
  async createBoard(
    name: string,
    user_id: string,
    parent_board_id?: string
  ): Promise<Board> {
    if (!name || name.trim().length === 0) {
      throw new ValidationError("Invalid board name");
    }
    if (!user_id) {
      throw new ValidationError("User ID is required");
    }

    const foundUser = await this.userRepository.getUserById(user_id);
    if (!foundUser) throw new NotFoundError(`User not found`);

    const id = uuidv4();
    let parentBoardEntity: Board | null = null;

    if (parent_board_id) {
      parentBoardEntity = await this.boardRepository.getBoardById(
        parent_board_id
      );
      if (!parentBoardEntity) throw new NotFoundError(`Parent board not found`);
    }
    const board = new Board(id, name, user_id, parent_board_id);
    const newBoard = await this.boardRepository.createBoard(board);
    return newBoard;
  }

  async updateBoard(boardId: string, name: string, user_id :string): Promise<Board> {
    const board = await this.boardRepository.getBoardById(boardId);
    if (!board) throw new NotFoundError(`Board not found`);
    if (!name || name.trim().length === 0) {
      throw new ValidationError("Invalid board name");
    }
    if (!user_id) {
      throw new ValidationError("User is required");
    }
    const foundUser = await this.userRepository.getUserById(user_id);

    if (foundUser?.id !== board.user_id) {
      throw new ValidationError(
        `User does not have permission to update this board`
      );
    }
    board.name = name.trim();
    const updatedBoard = await this.boardRepository.updateBoard(board);
    return updatedBoard;
  }
  async deleteBoard(boardId: string): Promise<void> {
    await this.boardRepository.deleteBoard(boardId);
  }

  async getTasksByBoard(boardId: string): Promise<Task[] | null> {
    
    const tasks = await this.taskRepository.getAllTasksByBoardId(boardId)
    if (!tasks) throw new NotFoundError(`Board not found`);
    return tasks;
  }
}
