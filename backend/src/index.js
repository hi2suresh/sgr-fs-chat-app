import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
// Import routers
import authRouter from './routes/auth.route.js';
import messageRouter from './routes/message.route.js';
// Import database connection
import connectDB from './lib/db.js';
import dotenv from 'dotenv';
dotenv.config();
// Initialize express app and middleware
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent
  })
);
app.use('/api/auth', authRouter);
app.use('/api/messages', messageRouter);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
    .then(() => console.log('Database connected successfully'))
    .catch((err) => console.error('Database connection error:', err));
});
