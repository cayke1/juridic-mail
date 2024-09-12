import { compare, hash } from "bcrypt";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../@types/User";
import { UnauthorizedError } from "../errors/CreateCustomError";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwt";

interface IAuthRequest {
  email: string;
  password: string;
}

interface IAuthResponse {
  token: string;
  user: Omit<User, "password">;
}

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async singin({
    email,
    password,
  }: IAuthRequest): Promise<IAuthResponse | Error> {
    const user = await this.userRepository.findByEmail(email);
    if (user instanceof Error) {
      return user;
    }
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      return new UnauthorizedError("Incorrect Info");
    }

    const resultToken = jwt.sign({ id: user.id }, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    const token = resultToken;

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    };
  }

  async signup(user: Omit<User, "id">) {
    const saltRounds = 8;

    const encriptedUser = {
      ...user,
      password: await hash(user.password, saltRounds),
    };

    const insertedUser = await this.userRepository.create(encriptedUser);

    return insertedUser;
  }

  async verify(token: string, secret: string) {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch(error) {
        return error;
    }
  }
}