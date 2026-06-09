import express from 'express';
import { getTemplates, createTemplate, deleteTemplate } from '../controllers/templateController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getTemplates);
router.post('/', authMiddleware, createTemplate);
router.delete('/:id', authMiddleware, deleteTemplate);

export default router;
