import { sequelize } from '../config/database';
import { User } from './User';
import { Client } from './Client';
import { Address } from './Address';
import { Warehouse } from './Warehouse';
import { Product } from './Product';
import { Order } from './Order';
import { OrderItem } from './OrderItem';

// Associations
Client.hasMany(Address, { foreignKey: 'clientId', as: 'addresses' });
Address.belongsTo(Client, { foreignKey: 'clientId' });

Warehouse.hasMany(Product, { foreignKey: 'warehouseId', as: 'products' });
Product.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Client.hasMany(Order, { foreignKey: 'clientId', as: 'orders' });
Order.belongsTo(Client, { foreignKey: 'clientId' });

Warehouse.hasMany(Order, { foreignKey: 'warehouseId', as: 'orders' });
Order.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

export { sequelize, User, Client, Address, Warehouse, Product, Order, OrderItem };
