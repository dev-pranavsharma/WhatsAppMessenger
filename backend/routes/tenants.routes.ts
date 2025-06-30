import express from 'express';
import { AddTenant,TenantbyID,AllTenants } from '../controllers/tenants.controller';

const routes = express.Router();

routes.post('/add', AddTenant);
routes.get('/:id',TenantbyID);
routes.get('/list',AllTenants)

export default routes;