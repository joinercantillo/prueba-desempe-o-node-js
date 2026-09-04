import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface AddressAttributes {
  id: number;
  clientId: number;
  address: string;
}

type AddressCreationAttributes = Optional<AddressAttributes, 'id'>;

export class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: number;
  public clientId!: number;
  public address!: string;
}

Address.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    clientId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false }
  },
  { sequelize, tableName: 'addresses' }
);
