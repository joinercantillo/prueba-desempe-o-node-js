import { Router } from 'express';
import { Product } from '../models/Product';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

/**
 * @openapi
 * /api/products/{code}:
 *   get:
 *     summary: Obtener producto por código
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto
 *       404:
 *         description: No encontrado
 */
// Get product by code
router.get('/:code', authenticate, async (req, res) => {
  const product = await Product.findOne({ where: { code: req.params.code, deleted: false } });
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
});

/**
 * @openapi
 * /api/products/{id}:
 *   delete:
 *     summary: Eliminación lógica de producto (admin)
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Eliminado
 *       404:
 *         description: No encontrado
 */
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
