export class User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  profile_pic?: string;

  constructor(
    id: string,
    username: string,
    fullname: string,
    email: string,
    password: string,
    profile_pic?: string
  ) {
    this.id = id;
    this.username = username;
    this.fullname = fullname;
    this.email = email;
    this.password = password;
    this.profile_pic = profile_pic;
  }

  static fromJSON(json: { id: string; username: string; fullname: string; email: string; password: string; profile_pic?: string }): User {
    return new User(
      json.id,
      json.username,
      json.fullname,
      json.email,
      json.password,
      json.profile_pic || ""
    );
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static validateUsername(username: string): boolean {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
  }

  static validateFullname(fullname: string): boolean {
    const fullnameRegex = /^[a-zA-Z\s]+$/;
    return fullnameRegex.test(fullname);
  }
}
