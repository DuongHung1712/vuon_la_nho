import express from 'express';
import { detectDisease } from '../controllers/diseaseController.js';
import upload from '../middleware/multer.js';

const diseaseRouter = express.Router();

// POST route for disease detection
diseaseRouter.post('/detect', upload.single('image'), detectDisease);

export default diseaseRouter;
