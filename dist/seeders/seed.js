"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const Client_1 = require("../models/Client");
const Warehouse_1 = require("../models/Warehouse");
const Product_1 = require("../models/Product");
async function seed() {
    try {
        await database_1.sequelize.sync({ force: true });
        console.log('DB synced (force)');
        const pass = await bcrypt_1.default.hash('password123', 10);
        await User_1.User.create({ name: 'Admin', email: 'admin@fhl.com', password: pass, role: 'admin' });
        await User_1.User.create({ name: 'Analyst', email: 'analyst@fhl.com', password: pass, role: 'analyst' });
        const client1 = await Client_1.Client.create({ cedula: '12345678', name: 'Cliente Uno', email: 'cliente1@example.com' });
        const client2 = await Client_1.Client.create({ cedula: '87654321', name: 'Cliente Dos', email: 'cliente2@example.com' });
        const w1 = await Warehouse_1.Warehouse.create({ name: 'Bodega Norte', active: true });
        const w2 = await Warehouse_1.Warehouse.create({ name: 'Bodega Sur', active: true });
        await Product_1.Product.create({ code: 'P001', name: 'Producto A', stock: 100, warehouseId: w1.id });
        await Product_1.Product.create({ code: 'P002', name: 'Producto B', stock: 50, warehouseId: w1.id });
        await Product_1.Product.create({ code: 'P003', name: 'Producto C', stock: 200, warehouseId: w2.id });
        console.log('Seed completed');
        process.exit(0);
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
}
seed();
