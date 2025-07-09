// src/routes/userManagementRoutes.js
import express from 'express';
import {
  getUserActivity,
  getRoleCounts,
  exportUsers
} from '../controller/userManagementController.js';

const routerUM = express.Router();

routerUM.get('/activity', getUserActivity);
routerUM.get('/activity', getUserActivity);
routerUM.get('/roles',    getRoleCounts);
routerUM.get('/export',   exportUsers);

export default routerUM;
