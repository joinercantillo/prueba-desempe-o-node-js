"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Address extends sequelize_1.Model {
}
exports.Address = Address;
Address.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    clientId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: false },
    address: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, { sequelize: database_1.sequelize, tableName: 'addresses' });
