import { Document } from "../@types/Document";
import { prisma } from "../database/prisma";
import { NotFoundError } from "../errors/CreateCustomError";
export class DocumentRepository {
  async create(document: Omit<Document, "id">): Promise<Document | Error> {
    try {
      const newDocument = await prisma.document.create({
        data: document,
      });
      return newDocument;
    } catch (error) {
      throw error;
    }
  }

  async findById(id: string): Promise<Document | Error> {
    const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document) return new NotFoundError("Document does'nt exists");

    return document;
  }

  async findAllFromUser(userId: string): Promise<Document[]> {
    const documents = await prisma.document.findMany({
      where: { userId },
    });

    return documents;
  }

  async delete(id: string): Promise<Document | Error> {
    const document = await prisma.document.delete({
      where: { id },
    });

    return document;
  }
}
