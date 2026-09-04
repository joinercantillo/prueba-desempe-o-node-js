"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const routes_1 = __importDefault(require("./routes"));
const database_1 = require("./config/database");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Test DB connection
database_1.sequelize
    .authenticate()
    .then(() => console.log('Database connected'))
    .catch((err) => console.error('DB connection error', err))
    .finally(async () => {
    try {
        await database_1.sequelize.sync();
        console.log('Database synced');
    }
    catch (err) {
        console.error('Sync error', err);
    }
});
const swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: '3.0.0',
        info: { title: 'FHL Delivery API', version: '1.0.0' }
    },
    apis: ['./src/routes/*.ts']
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
app.use('/api', routes_1.default);
app.get('/', (req, res) => res.json({ ok: true }));
exports.default = app;
