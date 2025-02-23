import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    DROP TABLE IF EXISTS boards;
    DROP TABLE IF EXISTS tasks;
    DROP TABLE IF EXISTS users;

    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(100) NOT NULL,
      fullname VARCHAR(100),
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      profile_pic VARCHAR(255)
    );
    CREATE TABLE IF NOT EXISTS boards (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      parent_board_id UUID REFERENCES boards(id) ON DELETE
      SET NULL
    );
    CREATE TYPE task_status_enum AS ENUM ('NEW', 'IN_PROGRESS', 'ASSIGNED', 'COMPLETED');

    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title VARCHAR(100) NOT NULL,
      description TEXT,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
      task_status task_status_enum NOT NULL DEFAULT 'NEW',
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      assigned_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
      assigned_username VARCHAR(255),
      assigned_profile_pic VARCHAR(255)
 );
  `);
  // eslint-disable-next-line no-console
  console.log('Tables created successfully.');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('tasks');
  await knex.schema.dropTableIfExists('boards');
  await knex.schema.dropTableIfExists('users');
}
