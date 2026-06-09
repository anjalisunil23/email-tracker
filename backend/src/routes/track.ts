import { Router } from 'express';
import { trackOpen, trackClick } from '../controllers/trackController';

const router = Router();

router.get('/open/:trackingId', trackOpen);
router.get('/click/:trackingId', trackClick);

export default router;
