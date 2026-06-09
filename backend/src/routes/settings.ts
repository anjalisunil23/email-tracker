import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getSettings);
router.post('/', authMiddleware, updateSettings);

export default router;
