"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Product extends sequelize_1.Model {
}
exports.Product = Product;
Product.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    code: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    stock: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    warehouseId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    deleted: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { sequelize: database_1.sequelize, tableName: 'products' });
