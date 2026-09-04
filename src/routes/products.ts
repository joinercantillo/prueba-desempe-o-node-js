import { Router } from 'express';
import { Product } from '../models/Product';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// Get product by code
router.get('/:code', authenticate, async (req, res) => {
  const product = await Product.findOne({ where: { code: req.params.code, deleted: false } });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

// Logical delete (soft delete) - admin
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  const id = Number(req.params.id);
  const product = await Product.findByPk(id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  product.deleted = true;
  await product.save();
  res.status(204).send();
});

export default router;
