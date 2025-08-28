import express from 'express';
import { AddTenant,TenantbyID,TenantPhoneNumbers,UpdateTenant } from '../controllers/tenants.controller';
import { authMiddleware } from '../middleware/auth.js';

const routes = express.Router();

routes.use(authMiddleware);

routes.post('/add', AddTenant); // add tenant
routes.get('/tenant',TenantbyID); // get tenant
routes.put('/update',UpdateTenant) // update tenant


routes.post('/:waba_id/phone_numbers',TenantPhoneNumbers)

export default routes;