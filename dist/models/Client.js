"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Client extends sequelize_1.Model {
}
exports.Client = Client;
Client.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    cedula: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false }
}, { sequelize: database_1.sequelize, tableName: 'clients' });
