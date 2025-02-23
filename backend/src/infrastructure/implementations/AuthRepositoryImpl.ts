import { Knex } from "knex";
import process from "process";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AuthRepository } from "../../domain/repositories/AuthRepository.js";

export class AuthrepositoryImpl implements AuthRepository {
  private knex: Knex;
  constructor(knexInstance: Knex) {
    this.knex = knexInstance;
  }
  async login(email: string, password: string): Promise<{ token: string; user: { id: string; password: string } } | null> {
    const user = await this.knex("users")
      .where({ email })
      .first<{ id: string; password: string }>();
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return null;
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1h",
      }
    );
    return {token , user};
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      return !!decoded;
    } catch (error: unknown) {
      console.error("Error validating token:", error);
      return false;
    }
  }

  async logout(): Promise<void> {
    localStorage.removeItem("token");
  }
}