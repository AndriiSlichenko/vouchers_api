import { Router } from 'express';
import campaignsRoutes from './campaigns';
import vouchersRoutes from './vouchers';

const router = Router();

router.use('/campaigns', campaignsRoutes);
router.use('/campaigns', vouchersRoutes);

export default router;
