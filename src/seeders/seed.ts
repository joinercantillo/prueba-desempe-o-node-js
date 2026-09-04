import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcrypt';
import { sequelize } from '../config/database';
import { User } from '../models/User';
import { Client } from '../models/Client';
import { Warehouse } from '../models/Warehouse';
import { Product } from '../models/Product';

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('DB synced (force)');

    const pass = await bcrypt.hash('password123', 10);
    await User.create({ name: 'Admin', email: 'admin@fhl.com', password: pass, role: 'admin' });
    await User.create({ name: 'Analyst', email: 'analyst@fhl.com', password: pass, role: 'analyst' });

    const client1 = await Client.create({ cedula: '12345678', name: 'Cliente Uno', email: 'cliente1@example.com' });
    const client2 = await Client.create({ cedula: '87654321', name: 'Cliente Dos', email: 'cliente2@example.com' });

    const w1 = await Warehouse.create({ name: 'Bodega Norte', active: true });
    const w2 = await Warehouse.create({ name: 'Bodega Sur', active: true });

    await Product.create({ code: 'P001', name: 'Producto A', stock: 100, warehouseId: w1.id });
    await Product.create({ code: 'P002', name: 'Producto B', stock: 50, warehouseId: w1.id });
    await Product.create({ code: 'P003', name: 'Producto C', stock: 200, warehouseId: w2.id });

    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
