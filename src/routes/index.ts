import { Router } from 'express';
import auth from './auth';
import clients from './clients';
import warehouses from './warehouses';
import products from './products';
import orders from './orders';

const router = Router();

router.use('/auth', auth);
router.use('/clients', clients);
router.use('/warehouses', warehouses);
router.use('/products', products);
router.use('/orders', orders);

export default router;
