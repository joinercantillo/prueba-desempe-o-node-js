"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Warehouse_1 = require("../models/Warehouse");
const Product_1 = require("../models/Product");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// List active warehouses with stock
router.get('/', auth_1.authenticate, async (req, res) => {
    const warehouses = await Warehouse_1.Warehouse.findAll({ where: { active: true } });
    // include product counts
    const result = await Promise.all(warehouses.map(async (w) => {
        const products = await Product_1.Product.findAll({ where: { warehouseId: w.id, deleted: false } });
        return { ...w.toJSON(), products };
    }));
    res.json(result);
});
// Admin: activate/deactivate warehouse
router.patch('/:id/active', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    const id = Number(req.params.id);
    const { active } = req.body;
    const warehouse = await Warehouse_1.Warehouse.findByPk(id);
    if (!warehouse)
        return res.status(404).json({ message: 'Not found' });
    warehouse.active = !!active;
    await warehouse.save();
    res.json(warehouse);
});
exports.default = router;
