import { Router } from 'express';
import { Warehouse } from '../models/Warehouse';
import { Product } from '../models/Product';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * @openapi
 * /api/warehouses:
 *   get:
 *     summary: Active warehouses list
 *     tags:
 *       - Warehouses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Warehouses list with their products
 */
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

/**
 * @openapi
 * /api/warehouses/{id}/active:
 *   patch:
 *     summary: Active or desactive a warehouse (admin)
 *     tags:
 *       - Warehouses
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: warehouse updated
 *       404:
 *         description: Not found
 */
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
