import express from 'express';
import {
  listInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview
} from '../controller/interviewController.js';

const routerI = express.Router();

// Collection routes
routerI
  .route('/')
  .get(listInterviews)
  .post(createInterview);

// Single-resource routes
routerI
  .route('/:id')
  .get(getInterview)
  .put(updateInterview)
  .delete(deleteInterview);

export default routerI;
