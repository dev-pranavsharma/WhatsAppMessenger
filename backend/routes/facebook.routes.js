// routes/facebook.js
import express from 'express'
import { FBCodeExchange } from '../controllers/facebook.controller.js';

const router = express.Router();

router.post('/exchange',FBCodeExchange)
export default router;