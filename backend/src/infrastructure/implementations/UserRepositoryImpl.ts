import { Knex } from "knex";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { User } from "../../domain/entities/User.js";
import { NotFoundError } from "../../utils/errors/Errors.js";

export class UserRepositoryImpl implements UserRepository {
  private knex: Knex;
  constructor(knexInstance: Knex) {
    this.knex = knexInstance;
  }

  async getAllUsers(): Promise<User[]> {
    return this.knex("users").select();
  }
  async getUserById(id: string): Promise<User | null> {
    return this.knex("users").where({ id }).first();
  }
  async getUserByEmail(email: string): Promise<User | null> {
    return this.knex("users").where({ email }).first();
  }
  async getUserByUsername(username: string): Promise<User | null> {
    return this.knex("users").where({ username }).first();
  }
  async createUser(user: User): Promise<User> {
    const result = await this.knex("users").insert(user);
    return { ...user, id: String(result[0]) };
  }
  async updateUser(user: User): Promise<User> {
    await this.knex("users").update(user).where({ id: user.id });
    return user;
  }
  async deleteUser(id: string): Promise<void> {
    await this.knex("users").delete().where({ id });
  }
  async updateProfilePic(id: string, profile_pic: string): Promise<void> {
    const updatedRows = await this.knex("users")
      .update({ profile_pic })
      .where({ id })
      .returning(["id", "profile_pic"]);

    if (updatedRows.length === 0) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
  }
}
