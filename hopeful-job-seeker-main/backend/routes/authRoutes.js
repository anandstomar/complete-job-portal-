import { Router } from 'express';
const routerA = Router();
import { register, login } from '../controller/authController.js';

routerA.post('/register', register);

routerA.post('/login', login);

export default routerA;
