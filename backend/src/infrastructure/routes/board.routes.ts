import { Router } from "express";
import { BoardController } from "../controllers/BoardController.js";

const boardRouter = Router();
const boardController = new BoardController();

boardRouter.get("/user/:userId", boardController.getAllBoardsForUser);
boardRouter.get(`/user/:userId/board/:boardId`, boardController.getTasksByBoard);
boardRouter.post("/", boardController.createBoard);
boardRouter.get("/:boardId", boardController.getBoardById);
boardRouter.put("/:id", boardController.updateBoard);
boardRouter.delete("/:id", boardController.deleteBoard);

export default boardRouter;
