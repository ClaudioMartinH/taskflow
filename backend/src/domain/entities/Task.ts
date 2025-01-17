import { TASK_STATUS } from '../../utils/types/types.js';

export class Task {
  id: string;
  title: string;
  description: string;
  user_id: string;
  board_id: string;
  task_status: TASK_STATUS;
  completed: boolean;
  assigned_user_id?: string;
  assigned_username?: string;
  assigned_profile_pic?: string

  constructor(
    id: string,
    title: string,
    description: string,
    user_id: string,
    board_id: string,
    task_status: TASK_STATUS = TASK_STATUS.NEW, 
    completed: boolean = false,
    assigned_user_id?: string,
    assigned_username?: string,
    assigned_profile_pic?: string,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.user_id = user_id;
    this.board_id = board_id;
    this.task_status = task_status;
    this.completed = completed;
    this.assigned_user_id = assigned_user_id;
    this.assigned_username = assigned_username;
    this.assigned_profile_pic = assigned_profile_pic;
  }

  public toggleComplete() {
    this.completed = !this.completed;
  }
  public new() {
    this.task_status = TASK_STATUS.NEW;
  }
  public assigned() {
    this.task_status = TASK_STATUS.ASSIGNED;
  }
  public inProgress() {
    this.task_status = TASK_STATUS.IN_PROGRESS;
  }
  public complete() {
    this.task_status = TASK_STATUS.COMPLETED;
  }

  public assignedTask(userId: string) {
    this.assigned_user_id = userId;
  }
}
