import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { Order } from '../models/Order';
import { OrderItem } from '../models/OrderItem';
import { Product } from '../models/Product';
import { Client } from '../models/Client';
import { Warehouse } from '../models/Warehouse';

const router = Router();

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
    if (product.stock < it.quantity) return res.status(400).json({ message: `Insufficient stock for product ${product.code}` });
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

// Get history of orders
router.get('/history', authenticate, async (req, res) => {
  const orders = await Order.findAll({ include: [{ model: OrderItem, as: 'items' }] });
  res.json(orders);
});

// Get orders by client
router.get('/client/:clientId', authenticate, async (req, res) => {
  const clientId = Number(req.params.clientId);
  const orders = await Order.findAll({ where: { clientId }, include: [{ model: OrderItem, as: 'items' }] });
  res.json(orders);
});

export default router;
