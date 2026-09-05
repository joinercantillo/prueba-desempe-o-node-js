import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Product } from '../models/Product';
import { Client } from '../models/Client';
import { Warehouse } from '../models/Warehouse';

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Create and order (admin)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: integer
 *               warehouseId:
 *                 type: integer
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: integer
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Invalid data
 */
// Create order
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  const { clientId, warehouseId, items } = req.body; // items: [{ productId, quantity }]
  if (!clientId || !warehouseId || !items || !Array.isArray(items)) return res.status(400).json({ message: 'Missing fields' });
  const client = await Client.findByPk(clientId);
  if (!client) return res.status(400).json({ message: 'Client not found' });
  const warehouse = await Warehouse.findByPk(warehouseId);
  if (!warehouse || !warehouse.active) return res.status(400).json({ message: 'Warehouse invalid' });

  // Validate stock
  for (const it of items) {
    const product = await Product.findByPk(it.productId);
    if (!product || product.deleted) return res.status(400).json({ message: 'Product invalid' });
    if (product.warehouseId !== warehouseId) return res.status(400).json({ message: 'Product not in warehouse' });
    if (product.stock < it.quantity) return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
  }

  const order = await Order.create({ clientId, warehouseId, status: 'pending' });
  for (const it of items) {
    await OrderItem.create({ orderId: order.id, productId: it.productId, quantity: it.quantity });
    // decrement stock
    const product = await Product.findByPk(it.productId);
    if (product) {
      product.stock = product.stock - it.quantity;
      await product.save();
    }
  }

  res.status(201).json(order);
});

/**
 * @openapi
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Change the order status (admin and analyst functions)
 *     tags:
 *       - Orders
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
 *               status:
 *                 type: string
 *                 enum: [pending, in_transit, delivered]
 *     responses:
 *       200:
 *         description: Order updated
 *       404:
 *         description: Not found
 */
// Change order status (admin + analyst can update status)
router.patch('/:id/status', authenticate, authorize(['admin', 'analyst']), async (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body; // pending | in_transit | delivered
  if (!['pending', 'in_transit', 'delivered'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
  const order = await Order.findByPk(id);
  if (!order) return res.status(404).json({ message: 'Not found' });
  order.status = status as any;
  await order.save();
  res.json(order);
});

/**
 * @openapi
 * /api/orders/history:
 *   get:
 *     summary: Order history
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order list
 */
// Get history of orders
router.get('/history', authenticate, async (req, res) => {
  const orders = await Order.findAll({ include: [{ model: OrderItem, as: 'items' }] });
  res.json(orders);
});

/**
 * @openapi
 * /api/orders/client/{clientId}:
 *   get:
 *     summary: Order by client
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Client order list
 */
// Get orders by client
router.get('/client/:clientId', authenticate, async (req, res) => {
  const clientId = Number(req.params.clientId);
  const orders = await Order.findAll({ where: { clientId }, include: [{ model: OrderItem, as: 'items' }] });
  res.json(orders);
});

export default router;
