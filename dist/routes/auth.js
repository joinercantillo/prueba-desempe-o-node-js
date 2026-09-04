"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role)
        return res.status(400).json({ message: 'Missing fields' });
    try {
        const hash = await bcrypt_1.default.hash(password, 10);
        const user = await User_1.User.create({ name, email, password: hash, role });
        return res.status(201).json({ id: user.id, email: user.email });
    }
    catch (err) {
        return res.status(400).json({ message: err.message });
    }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Missing fields' });
    const user = await User_1.User.findOne({ where: { email } });
    if (!user)
        return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt_1.default.compare(password, user.password);
    if (!ok)
        return res.status(401).json({ message: 'Invalid credentials' });
    const secret = process.env.JWT_SECRET || 'secret';
    const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, secret, { expiresIn: '8h' });
    res.json({ token });
});
exports.default = router;
