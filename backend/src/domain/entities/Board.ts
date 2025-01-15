
export class Board {
  id: string;
  name: string;
  user_id: string;
  parent_board_id?: string; // Relación recursiva
  

  constructor(
    id: string,
    name: string,
    user_id: string,
    parent_board_id?: string,

  ) {
    this.id = id;
    this.name = name;
    this.user_id = user_id;
    this.parent_board_id = parent_board_id;
  }
}
