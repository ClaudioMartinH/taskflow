export interface AuthRepository {
  login(
    email: string,
    password: string
  ): Promise<{ token: string; user: { id: number; password: string } } | null>;
  validateToken(token: string): Promise<boolean>;
  logout(): Promise<void>;
}
