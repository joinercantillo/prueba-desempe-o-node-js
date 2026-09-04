import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ClientAttributes {
  id: number;
  cedula: string;
  name: string;
  email: string;
}

type ClientCreationAttributes = Optional<ClientAttributes, 'id'>;

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public cedula!: string;
  public name!: string;
  public email!: string;
}

Client.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    cedula: { type: DataTypes.STRING, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false }
  },
  { sequelize, tableName: 'clients' }
);
