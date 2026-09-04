"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const Order_1 = require("../models/Order");
const OrderItem_1 = require("../models/OrderItem");
const Product_1 = require("../models/Product");
const Client_1 = require("../models/Client");
const Warehouse_1 = require("../models/Warehouse");
const router = (0, express_1.Router)();
// Create order
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    const { clientId, warehouseId, items } = req.body; // items: [{ productId, quantity }]
    if (!clientId || !warehouseId || !items || !Array.isArray(items))
        return res.status(400).json({ message: 'Missing fields' });
    const client = await Client_1.Client.findByPk(clientId);
    if (!client)
        return res.status(400).json({ message: 'Client not found' });
    const warehouse = await Warehouse_1.Warehouse.findByPk(warehouseId);
    if (!warehouse || !warehouse.active)
        return res.status(400).json({ message: 'Warehouse invalid' });
    // Validate stock
    for (const it of items) {
        const product = await Product_1.Product.findByPk(it.productId);
        if (!product || product.deleted)
            return res.status(400).json({ message: 'Product invalid' });
        if (product.warehouseId !== warehouseId)
            return res.status(400).json({ message: 'Product not in warehouse' });
        if (product.stock < it.quantity)
            return res.status(400).json({ message: `Insufficient stock for product ${product.code}` });
    }
    const order = await Order_1.Order.create({ clientId, warehouseId, status: 'pending' });
    for (const it of items) {
        await OrderItem_1.OrderItem.create({ orderId: order.id, productId: it.productId, quantity: it.quantity });
        // decrement stock
        const product = await Product_1.Product.findByPk(it.productId);
        if (product) {
            product.stock = product.stock - it.quantity;
            await product.save();
        }
    }
    res.status(201).json(order);
});
// Change order status (admin + analyst can update status)
router.patch('/:id/status', auth_1.authenticate, (0, auth_1.authorize)(['admin', 'analyst']), async (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body; // pending | in_transit | delivered
    if (!['pending', 'in_transit', 'delivered'].includes(status))
        return res.status(400).json({ message: 'Invalid status' });
    const order = await Order_1.Order.findByPk(id);
    if (!order)
        return res.status(404).json({ message: 'Not found' });
    order.status = status;
    await order.save();
    res.json(order);
});
// Get history of orders
router.get('/history', auth_1.authenticate, async (req, res) => {
    const orders = await Order_1.Order.findAll({ include: [{ model: OrderItem_1.OrderItem, as: 'items' }] });
    res.json(orders);
});
// Get orders by client
router.get('/client/:clientId', auth_1.authenticate, async (req, res) => {
    const clientId = Number(req.params.clientId);
    const orders = await Order_1.Order.findAll({ where: { clientId }, include: [{ model: OrderItem_1.OrderItem, as: 'items' }] });
    res.json(orders);
});
exports.default = router;
