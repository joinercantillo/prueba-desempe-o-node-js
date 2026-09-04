"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Client_1 = require("../models/Client");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
// List all clients (protected)
router.get('/', auth_1.authenticate, async (req, res) => {
    const clients = await Client_1.Client.findAll();
    res.json(clients);
});
// Find client by cedula
router.post('/search', auth_1.authenticate, async (req, res) => {
    const { cedula } = req.body;
    if (!cedula)
        return res.status(400).json({ message: 'cedula required' });
    const client = await Client_1.Client.findOne({ where: { cedula } });
    if (!client)
        return res.status(404).json({ message: 'Not found' });
    res.json(client);
});
// Admin: create client
router.post('/', auth_1.authenticate, async (req, res) => {
    const { cedula, name, email } = req.body;
    if (!cedula || !name || !email)
        return res.status(400).json({ message: 'Missing fields' });
    try {
        const existing = await Client_1.Client.findOne({ where: { cedula } });
        if (existing)
            return res.status(400).json({ message: 'Client with cedula exists' });
        const client = await Client_1.Client.create({ cedula, name, email });
        res.status(201).json(client);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.default = router;
