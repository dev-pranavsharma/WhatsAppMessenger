import express from 'express';
import { AddTenant,TenantbyID,UpdateTenant } from '../controllers/tenants.controller';
import { authMiddleware } from '../middleware/auth.js';

const routes = express.Router();

routes.use(authMiddleware);

routes.post('/add', AddTenant);
routes.get('/tenant',TenantbyID);
routes.put('/update',UpdateTenant)

export default routes;