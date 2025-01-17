import { Knex } from 'knex';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const id1 = uuidv4();
const id2 = uuidv4();
const id3 = uuidv4();
const boardId1 = uuidv4();
const boardId2 = uuidv4();
const boardId3 = uuidv4();
const boardId4 = uuidv4();
const boardId5 = uuidv4();
const boardId6 = uuidv4();
const password1 = '123456';
const password1Hashed = bcrypt.hashSync(password1, 10);
const profilePic =
  'https://img.freepik.com/free-photo/user-profile-icon-front-side_187299-39596.jpg?t=st=1736809225~exp=1736812825~hmac=c6de8ea9a4642e2325e963b9f6698a755205fdd200500d89a9f6724b0cc4cd81&w=740';

export async function seed(knex: Knex): Promise<void> {
  await knex('boards').del();
  await knex('tasks').del();
  await knex('users').del();

  await knex('users').insert([
    {
      id: id1,
      username: 'johndoe',
      fullname: 'John Doe',
      email: 'johndoe@example.com',
      password: password1Hashed,
      profile_pic: profilePic,
    },
    {
      id: id2,
      username: 'alicejones',
      fullname: 'Alice Jones',
      email: 'alicejones@example.com',
      password: password1Hashed,
      profile_pic: profilePic,
    },
    {
      id: id3,
      username: 'michaeljones',
      fullname: 'Michael Jones',
      email: 'michaeljones@example.com',
      password: password1Hashed,
      profile_pic: profilePic,
    },
  ]);
  await knex('boards').insert([
    { id: boardId1, name: 'Board 1', user_id: id1 },
    { id: boardId4, name: 'Board 4', user_id: id1 },
    { id: boardId2, name: 'Board 2', user_id: id2 },
    { id: boardId5, name: 'Board 5', user_id: id2 },
    { id: boardId3, name: 'Board 3', user_id: id3 },
    { id: boardId6, name: 'Board 6', user_id: id3 },
  ]);
  await knex('tasks').insert([
    {
      id: uuidv4(),
      title: 'Task 1',
      description: 'Description 1',
      board_id: boardId1,
      user_id: id1,
      task_status: 'IN_PROGRESS',
      completed: false,
      assigned_user_id: id2,
    },
    {
      id: uuidv4(),
      title: 'Task 2',
      description: 'Description 2',
      board_id: boardId2,
      user_id: id2,
      task_status: 'COMPLETED',
      completed: true,
      assigned_user_id: id1,
    },
    {
      id: uuidv4(),
      title: 'Task 3',
      description: 'Description 3',
      board_id: boardId3,
      user_id: id3,
      task_status: 'IN_PROGRESS',
      completed: false,
      assigned_user_id: id1,
    },
    {
      id: uuidv4(),
      title: 'Task 4',
      description: 'Description 4',
      board_id: boardId2,
      user_id: id2,
      task_status: 'ASSIGNED',
      completed: false,
      assigned_user_id: id1,
    },
    {
      id: uuidv4(),
      title: 'Task 5',
      description: 'Description 5',
      board_id: boardId3,
      user_id: id3,
      task_status: 'ASSIGNED',
      completed: false,
      assigned_user_id: id2,
    },
    {
      id: uuidv4(),
      title: 'Task 6',
      description: 'Description 6',
      board_id: boardId4,
      user_id: id1,
      task_status: 'NEW',
      completed: false,
      assigned_user_id: id2,
    },
    {
      id: uuidv4(),
      title: 'Task 7',
      description: 'Description 7',
      board_id: boardId3,
      user_id: id3,
      task_status: 'IN_PROGRESS',
      completed: false,
      assigned_user_id: id2,
    },
    {
      id: uuidv4(),
      title: 'Task 8',
      description: 'Description 8',
      board_id: boardId4,
      user_id: id1,
      task_status: 'NEW',
      completed: false,
      assigned_user_id: id3,
    },
    {
      id: uuidv4(),
      title: 'Task 9',
      description: 'Description 9',
      board_id: boardId1,
      user_id: id1,
      task_status: 'IN_PROGRESS',
      completed: false,
      assigned_user_id: id2,
    },
    {
      id: uuidv4(),
      title: 'Task 10',
      description: 'Description 10',
      board_id: boardId2,
      user_id: id2,
      task_status: 'COMPLETED',
      completed: true,
      assigned_user_id: id3,
    },
    {
      id: uuidv4(),
      title: 'Task 11',
      description: 'Description 11',
      board_id: boardId3,
      user_id: id3,
      task_status: 'IN_PROGRESS',
      completed: false,
      assigned_user_id: id2,
    },
    {
      id: uuidv4(),
      title: 'Task 12',
      description: 'Description 12',
      board_id: boardId5,
      user_id: id2,
      task_status: 'ASSIGNED',
      completed: false,
      assigned_user_id: id3,
    },
    {
      id: uuidv4(),
      title: 'Task 13',
      description: 'Description 13',
      board_id: boardId3,
      user_id: id3,
      task_status: 'ASSIGNED',
      completed: false,
      assigned_user_id: id1,
    },
    {
      id: uuidv4(),
      title: 'Task 14',
      description: 'Description 14',
      board_id: boardId4,
      user_id: id1,
      task_status: 'NEW',
      completed: false,
      assigned_user_id: id2,
    },
    {
      id: uuidv4(),
      title: 'Task 15',
      description: 'Description 15',
      board_id: boardId3,
      user_id: id3,
      task_status: 'ASSIGNED',
      completed: false,
      assigned_user_id: id1,
    },
    {
      id: uuidv4(),
      title: 'Task 16',
      description: 'Description 16',
      board_id: boardId4,
      user_id: id1,
      task_status: 'NEW',
      completed: false,
      assigned_user_id: id3,
    },
  ]);
  // eslint-disable-next-line no-console
  console.log('Seeding done SUCCESSFULLY.');
}
