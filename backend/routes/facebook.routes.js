// routes/facebook.js
import express from 'express'
import { FBCallback } from '../controllers/facebook.controller.js';

const router = express.Router();

router.get('/callback',FBCallback);

export default router;