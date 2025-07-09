import express, { json } from 'express';
import { connect } from 'mongoose';
import { config } from 'dotenv';
import routerA from './routes/authRoutes.js';
import routerJ from './routes/userAdminJobRoutes.js';
import routerApp    from './routes/jobApplication.js';
import routerUM  from './routes/userManageRoutes.js';
import routerI from './routes/interviewRoutes.js';
import testRoutes from './routes/testRoutes.js';
import cors from 'cors';

config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173' ],
  credentials: true,                  
}));
app.use(json());

connect(process.env.MONGODB_URI || "mongodb+srv://user:9gCEgNUYZYYXTMlH@cluster0.tmfdszp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.send('Welcome to the Job Portal API');
});

app.use('/api/auth', routerA);
app.use('/api/userjobs', routerJ);
app.use('/api/manageapplication', routerApp);
app.use('/api/manageusers', routerUM);
app.use('/api/interviews', routerI);
app.use('/api/tests', testRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
