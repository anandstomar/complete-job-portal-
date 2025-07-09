import express from 'express';
import * as testCtrl from '../controller/testController.js';
// import { requireAdmin, requireAuth } from '../middlewares/authMiddlewares.js';

const router = express.Router();

// Admin routes (now public)
router.post('/create', testCtrl.createTest);
router.get('/all', testCtrl.listTests);
router.post('/assign', testCtrl.assignTest);
router.get('/assigned', testCtrl.listAssignedTests);

// Candidate routes (now public)
router.get('/my', testCtrl.listMyTests);
router.post('/submit', testCtrl.submitTest);

router.delete('/:id', testCtrl.deleteTest);
router.put('/:id', testCtrl.updateTest)

export default router;