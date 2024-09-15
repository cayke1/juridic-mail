import { Request, Response } from "express";
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../errors/CreateCustomError";
import { randomUUID } from "crypto";
import { DocumentService } from "../services/DocumentService";
import { SupabaseService } from "../services/SupabaseService";
import { GetIdByToken } from "../utils/GetIdByToken";
import { SendMailService } from "../services/SendMailService";

export class DocumentController {
  constructor(
    private documentService: DocumentService,
    private supabaseService: SupabaseService
  ) {
    this.create = this.create.bind(this);
    this.get = this.get.bind(this);
    this.sendDocuments = this.sendDocuments.bind(this);
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

    const insertedDocument = await this.documentService.createDocument(
      document
    );
    await this.supabaseService.uploadFile(file);

    return res.status(201).json(insertedDocument);
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

  async sendDocuments(req: Request, res: Response) {
    const sendMailService = new SendMailService();
    const { recipients } = req.body;
    const { id } = req.params;
    const document = await this.documentService.getDocumentById(id);
    if (document instanceof Error) {
      throw document;
    }
    const pdf = await this.supabaseService.getFile(document.title);
    if (pdf instanceof Error) {
      throw pdf;
    }
    try {
      await sendMailService.execute(recipients, pdf);

      return res.status(200).json({ message: "Email sent" });
    } catch (error) {
      console.log(error);
      throw new InternalServerError("Error sending email");
    }
  }
}
