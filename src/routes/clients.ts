import { Router } from 'express';
import { Client } from '../models/Client';
import { authenticate } from '../middlewares/auth';

const router = Router();

/**
 * @openapi
 * /api/clients:
 *   get:
 *     summary: Listar clientes
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
// List all clients (protected)
router.get('/', authenticate, async (req, res) => {
  const clients = await Client.findAll();
  res.json(clients);
});

/**
 * @openapi
 * /api/clients/search:
 *   post:
 *     summary: Buscar cliente por cédula
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 *       404:
 *         description: No encontrado
 */
// Find client by cedula
router.post('/search', authenticate, async (req, res) => {
  const { cedula } = req.body;
  if (!cedula) return res.status(400).json({ message: 'cedula required' });
  const client = await Client.findOne({ where: { cedula } });
  if (!client) return res.status(404).json({ message: 'Not found' });
  res.json(client);
});

/**
 * @openapi
 * /api/clients:
 *   post:
 *     summary: Crear cliente (admin)
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente creado
 */
// Admin: create client
router.post('/', authenticate, async (req, res) => {
  const { cedula, name, email } = req.body;
  if (!cedula || !name || !email) return res.status(400).json({ message: 'Missing fields' });
  try {
    const existing = await Client.findOne({ where: { cedula } });
    if (existing) return res.status(400).json({ message: 'Client with cedula exists' });
    const client = await Client.create({ cedula, name, email });
    res.status(201).json(client);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
