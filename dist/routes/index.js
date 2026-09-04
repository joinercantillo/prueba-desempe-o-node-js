"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const clients_1 = __importDefault(require("./clients"));
const warehouses_1 = __importDefault(require("./warehouses"));
const products_1 = __importDefault(require("./products"));
const orders_1 = __importDefault(require("./orders"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
router.use('/clients', clients_1.default);
router.use('/warehouses', warehouses_1.default);
router.use('/products', products_1.default);
router.use('/orders', orders_1.default);
exports.default = router;
