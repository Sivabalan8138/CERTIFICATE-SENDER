import { Router } from 'express';
import { sendCertificateEmail } from '../controllers/emailController';

const router = Router();

router.post('/send-email', sendCertificateEmail);

export default router;
