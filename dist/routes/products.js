"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_1 = require("../models/Product");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// Get product by code
router.get('/:code', auth_1.authenticate, async (req, res) => {
    const product = await Product_1.Product.findOne({ where: { code: req.params.code, deleted: false } });
    if (!product)
        return res.status(404).json({ message: 'Not found' });
    res.json(product);
});
// Logical delete (soft delete) - admin
router.delete('/:id', auth_1.authenticate, (0, auth_1.authorize)(['admin']), async (req, res) => {
    const id = Number(req.params.id);
    const product = await Product_1.Product.findByPk(id);
    if (!product)
        return res.status(404).json({ message: 'Not found' });
    product.deleted = true;
    await product.save();
    res.status(204).send();
});
exports.default = router;
