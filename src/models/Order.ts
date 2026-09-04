import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface OrderAttributes {
  id: number;
  clientId: number;
  warehouseId: number;
  status: 'pending' | 'in_transit' | 'delivered';
}

type OrderCreationAttributes = Optional<OrderAttributes, 'id'>;

export class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public clientId!: number;
  public warehouseId!: number;
  public status!: 'pending' | 'in_transit' | 'delivered';
}

Order.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    clientId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    warehouseId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'in_transit', 'delivered'), allowNull: false, defaultValue: 'pending' }
  },
  { sequelize, tableName: 'orders' }
);
