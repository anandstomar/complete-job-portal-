import express from 'express';
import * as jobController from '../controller/userJobsController.js';
import { authenticateUser, isAdmin } from '../middlewares/authMiddlewares.js';

const routerJ = express.Router();

routerJ.get('/jobs', jobController.getAllJobs);
routerJ.get('/jobs/:id', jobController.getJobById);
routerJ.post('/jobs/:id/apply', authenticateUser, jobController.applyToJob);
routerJ.get('/jobs/applied', authenticateUser, jobController.getUserApplications);
routerJ.get('/admin/jobs', authenticateUser, isAdmin, jobController.getAllJobsAdmin);
routerJ.post('/admin/jobs', authenticateUser, isAdmin, jobController.createJob);
routerJ.get('/admin/jobs/:id', authenticateUser, isAdmin, jobController.getJobByIdAdmin);
routerJ.patch('/admin/jobs/:id', authenticateUser, isAdmin, jobController.updateJob);
routerJ.delete('/admin/jobs/:id', authenticateUser, isAdmin, jobController.deleteJob);

export default routerJ;