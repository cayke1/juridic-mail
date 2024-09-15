import { Router } from "express";
import { DocumentRepository } from "../repositories/DocumentRepository";
import { DocumentService } from "../services/DocumentService";
import { SupabaseService } from "../services/SupabaseService";
import { DocumentController } from "../controllers/DocumentController";
import multer from "multer";

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);
const supabaseService = new SupabaseService();
const documentController = new DocumentController(documentService, supabaseService);

const upload = multer({ storage: multer.memoryStorage() });

const documentRoutes = Router();

documentRoutes.post("/", upload.single('document') ,documentController.create);
documentRoutes.get("/:id", documentController.get);
documentRoutes.post("/:id/send", documentController.sendDocuments);

export { documentRoutes }