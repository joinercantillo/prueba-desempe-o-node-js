import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/fhldb';

export const sequelize = new Sequelize(databaseUrl, {
  logging: false,
});
