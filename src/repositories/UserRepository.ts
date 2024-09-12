import { User } from "../@types/User";
import { prisma } from "../database/prisma";
import { ConflictError, NotFoundError } from "../errors/CreateCustomError";

export class UserRepository {
  async create(user: Omit<User, "id">): Promise<User | Error> {
    const alreadyExists = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (alreadyExists) {
      return new ConflictError("User already exists");
    }
    try {
      const newUser = await prisma.user.create({
        data: user,
      });
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | Error> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) return new NotFoundError("User does'nt exists");

    return user;
  }

  async findById(id: string): Promise<User | Error> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) return new NotFoundError("User does'nt exists");

    return user;
  }
}
