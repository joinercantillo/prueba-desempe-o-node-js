import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ProductAttributes {
  id: number;
  code: string;
  name: string;
  stock: number;
  warehouseId: number;
  deleted: boolean;
}

type ProductCreationAttributes = Optional<ProductAttributes, 'id' | 'deleted'>;

export class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public stock!: number;
  public warehouseId!: number;
  public deleted!: boolean;
}

Product.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    stock: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, defaultValue: 0 },
    warehouseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  { sequelize, tableName: 'products' }
);
