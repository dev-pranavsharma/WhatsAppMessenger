import express from 'express';
import { AddTenant } from '../controllers/tenants.controller.js';

const routes = express.Router();

routes.post('/add', AddTenant);

export default routes;