import { Router } from "express";
import multer from "multer";
import { uploadController } from "../controllers/upload.controller";

// Use memory storage — file bytes are passed directly to upload service as a Buffer
const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// POST /api/upload-image — multipart/form-data with 'file', 'fileName', 'folder' fields
router.post("/", upload.single("file"), uploadController.upload);

export { router as uploadRouter };
