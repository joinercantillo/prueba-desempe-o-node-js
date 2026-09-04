import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import routes from './routes';
import { sequelize } from './config/database';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('DB connection error', err))
  .finally(async () => {
    try {
      await sequelize.sync();
      console.log('Database synced');
    } catch (err) {
      console.error('Sync error', err);
    }
  });

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'FHL Delivery API', version: '1.0.0' }
  },
  apis: ['./src/routes/*.ts']
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', routes);

app.get('/', (req, res) => res.json({ ok: true }));

export default app;
