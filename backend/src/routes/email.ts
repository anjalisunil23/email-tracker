import { Router } from 'express';
import { sendEmail, listEmails, getEmailById } from '../controllers/emailController';
import auth from '../middleware/auth';

const router = Router();

router.get('/', auth, listEmails);
router.get('/list', auth, listEmails); // Alias for /
router.get('/:id', auth, getEmailById);
router.post('/send', auth, sendEmail);

export default router;
