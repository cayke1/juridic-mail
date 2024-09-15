import { Document } from "../@types/Document";
import { DocumentRepository } from "../repositories/DocumentRepository";

export class DocumentService {
  constructor(private documentRepository: DocumentRepository) {}

  async createDocument(document: Omit<Document, "id">) {
    const insertedDocument = await this.documentRepository.create(document);
    return insertedDocument;
  }

  async getDocumentById(id: string) {
    const document = await this.documentRepository.findById(id);
    return document;
  }

  async getDocumentsFromUser(userId: string) {
    const documents = await this.documentRepository.findAllFromUser(userId);
    return documents;
  }

  async deleteDocument(id: string) {
    const document = await this.documentRepository.delete(id);
    return document;
  }
}
