import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface WarehouseAttributes {
  id: number;
  name: string;
  active: boolean;
}

type WarehouseCreationAttributes = Optional<WarehouseAttributes, 'id'>;

export class Warehouse extends Model<WarehouseAttributes, WarehouseCreationAttributes> implements WarehouseAttributes {
  public id!: number;
  public name!: string;
  public active!: boolean;
}

Warehouse.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, tableName: 'warehouses' }
);
