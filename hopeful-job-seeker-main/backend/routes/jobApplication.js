// src/routes/applicationRoutes.js
import express from 'express';
import {
  listApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
} from '../controller/jobApplicationManage.js';

const routerApp = express.Router();
routerApp.route('/')
  .get(listApplications)
  .post(createApplication);

  routerApp.route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

export default routerApp;
