import { Request, Response } from "express";
import {
  BadRequestError,
  UnauthorizedError,
} from "../errors/CreateCustomError";
import { randomUUID } from "crypto";
import { DocumentService } from "../services/DocumentService";
import { SupabaseService } from "../services/SupabaseService";
import { GetIdByToken } from "../utils/GetIdByToken";

export class DocumentController {
  constructor(
    private documentService: DocumentService,
    private supabaseService: SupabaseService
  ) {
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
  }
  async create(req: Request, res: Response) {
    const file = req.file;
    if (!req.headers.authorization)
      throw new UnauthorizedError("Token not found");

    const id = GetIdByToken(req.headers.authorization);
    if (!file) {
      throw new BadRequestError("File not found");
    }
    const document = {
      title: file.originalname,
      slug: file.filename + "-" + randomUUID(),
      userId: id,
      created_at: new Date(Date.now()),
    };

    //    const insertedDocument = await this.documentService.createDocument(
    //    document
    //);
    await this.supabaseService.uploadFile(file);

    return res.status(201).json("ok");
  }

  async get(req: Request, res: Response) {
    const { id } = req.params;
    const document = await this.documentService.getDocumentById(id);
    if (document instanceof Error) {
      throw document;
    }
    const url = await this.supabaseService.getFileUrl(document.title);
    return res.status(200).json(url);
  }
}
