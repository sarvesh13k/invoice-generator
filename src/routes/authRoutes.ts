import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { generateInvoice} from '../controllers/invoiceController';

const router = Router();

router.post('/register', registerUser as any);
router.post('/login', loginUser as any);
router.post('/generate-pdf', generateInvoice)

export default router;
