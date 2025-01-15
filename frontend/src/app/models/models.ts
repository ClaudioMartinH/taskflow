export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  profile_pic: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  user_id: string;
  board: Board;
  task_status: string;
  completed: boolean;
  assigned_user_id?: string;
}


export interface Board {
  id: string;
  name: string;
  user: User;
  parentBoard?: Board | null;
  tasks?: Task[];
}

export interface Login {
  email: string;
  password: string;
}