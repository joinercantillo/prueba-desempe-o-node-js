"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Order extends sequelize_1.Model {
}
exports.Order = Order;
Order.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    clientId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    warehouseId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: { type: sequelize_1.DataTypes.ENUM('pending', 'in_transit', 'delivered'), allowNull: false, defaultValue: 'pending' }
}, { sequelize: database_1.sequelize, tableName: 'orders' });
