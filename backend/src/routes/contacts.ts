import express from 'express';
import { getContacts, createContact, deleteContact } from '../controllers/contactController';
import authMiddleware from '../middleware/auth';

const router = express.Router();

router.get('/', authMiddleware, getContacts);
router.post('/', authMiddleware, createContact);
router.delete('/:id', authMiddleware, deleteContact);

export default router;
