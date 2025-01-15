import { Board } from "../entities/Board.js";

export interface BoardRepository {
  getAllBoardsForUser(userId: string): Promise<Board[]>;
  getBoardById(boardId: string): Promise<Board | null>;
  createBoard(board: Board): Promise<Board>;
  updateBoard(board: Board): Promise<Board>;
  deleteBoard(boardId: string): Promise<void>;
}
