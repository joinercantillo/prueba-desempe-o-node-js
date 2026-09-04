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

    const client1 = await Client.create({ cedula: '12345678', name: 'Juancho', email: 'lirio322222@example.com' });
    const client2 = await Client.create({ cedula: '87654321', name: 'Polo', email: 'listeilor@example.com' });
    const client3 = await Client.create({ cedula: '12355678', name: 'Valencia', email: 'seiya432@example.com' });
    const client4 = await Client.create({ cedula: '876544321', name: 'Cassiani', email: 'juanchopolo33@example.com' });

    const w1 = await Warehouse.create({ name: 'Bodega Norteñita', active: true });
    const w2 = await Warehouse.create({ name: 'Bodega Costeñita', active: true });

    await Product.create({ code: 'P001', name: 'Productito Aguado', stock: 100, warehouseId: w1.id });
    await Product.create({ code: 'P002', name: 'Productito Bolsitas', stock: 50, warehouseId: w1.id });
    await Product.create({ code: 'P003', name: 'Productito Carga pesada', stock: 200, warehouseId: w2.id });
    await Product.create({ code: 'P004', name: 'Productito Carga ancha', stock: 200, warehouseId: w2.id });
    await Product.create({ code: 'P005', name: 'Productito listones', stock: 200, warehouseId: w1.id });
    await Product.create({ code: 'P006', name: 'Productito librito', stock: 200, warehouseId: w1.id });
    await Product.create({ code: 'P007', name: 'Productito Carga larga', stock: 200, warehouseId: w2.id });

    console.log('Seed completed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
