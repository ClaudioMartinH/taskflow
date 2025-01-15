import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { User } from "../../domain/entities/User.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { NotFoundError } from "../../utils/errors/Errors.js";

export class UserService {
  private UserRepository: UserRepository;
  constructor(userRepository: UserRepository) {
    this.UserRepository = userRepository;
  }
  async getAllUsers(): Promise<User[]> {
    const users = await this.UserRepository.getAllUsers();
    return users;
  }
  async getUserById(id: string): Promise<User | null> {
    const user = await this.UserRepository.getUserById(id);
    if (!user) {
      throw new NotFoundError(`User not found`);
    }
    return user;
  }
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.UserRepository.getUserByEmail(email);
    if (!user) {
      throw new NotFoundError(`User not found`);
    }
    return user;
  }
  async getUserByUsername(username: string): Promise<User | null> {
    const user = await this.UserRepository.getUserByUsername(username);
    if (!user) {
      throw new NotFoundError(`User not found`);
    }
    return user;
  }
  async createUser(
    username: string,
    fullname: string,
    email: string,
    password: string,
    profile_pic: string
  ): Promise<User> {
    const id = uuidv4();
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User(id, username, fullname, email, hashedPassword, profile_pic);
    const savedUser = await this.UserRepository.createUser(user);
    return savedUser;
  }
  async updateUser(
    id: string,
    username: string,
    fullname: string,
    email: string,
    password: string,
  ): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) throw new NotFoundError("Unable to update. User not found");
    user.username = username;
    user.fullname = fullname;
    user.email = email;
    user.password = password;
    const updatedUser = await this.UserRepository.updateUser(user);
    return updatedUser;
  }
  async deleteUser(id: string): Promise<void> {
    const user = await this.UserRepository.getUserById(id);
    if (!user) throw new NotFoundError("Unable to delete. User not found");
    await this.UserRepository.deleteUser(id);
  }
  async changeProfilePicture(id: string, profile_pic: string): Promise<void> {
    await this.UserRepository.updateProfilePic(id, profile_pic);
  }
}
