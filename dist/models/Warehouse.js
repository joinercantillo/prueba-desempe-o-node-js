"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Warehouse = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Warehouse extends sequelize_1.Model {
}
exports.Warehouse = Warehouse;
Warehouse.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    active: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { sequelize: database_1.sequelize, tableName: 'warehouses' });
