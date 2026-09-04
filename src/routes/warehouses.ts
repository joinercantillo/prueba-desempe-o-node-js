import { Router } from 'express';
import { Warehouse } from '../models/Warehouse';
import { Product } from '../models/Product';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

// List active warehouses with stock
router.get('/', authenticate, async (req, res) => {
  const warehouses = await Warehouse.findAll({ where: { active: true } });
  // include product counts
  const result = await Promise.all(
    warehouses.map(async (w) => {
      const products = await Product.findAll({ where: { warehouseId: w.id, deleted: false } });
      return { ...w.toJSON(), products };
    })
  );
  res.json(result);
});

// Admin: activate/deactivate warehouse
router.patch('/:id/active', authenticate, authorize(['admin']), async (req, res) => {
  const id = Number(req.params.id);
  const { active } = req.body;
  const warehouse = await Warehouse.findByPk(id);
  if (!warehouse) return res.status(404).json({ message: 'Not found' });
  warehouse.active = !!active;
  await warehouse.save();
  res.json(warehouse);
});

export default router;
