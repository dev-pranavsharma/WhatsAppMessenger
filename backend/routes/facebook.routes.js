// routes/facebook.js
import express from 'express'
import { FBCodeExchange,FBCallback } from '../controllers/facebook.controller.js';

const router = express.Router();

router.get('/callback',FBCallback);
router.post('/exchange',FBCodeExchange)
export default router;