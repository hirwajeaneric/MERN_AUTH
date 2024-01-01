import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import colors from 'colors';
import cookieParser from 'cookie-parser';
import path from 'path';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

mongoose.connect(process.env.MONGODB_URI)
.then((res)=>console.log('> Database Connected...'.bgBlue))
.catch(err=>console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red ))

const app = express();

// For deployment --------------------------------------------------------------
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});
// ------------------------------------------------------------------------------

app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
    console.log('> Server listening on port 3000...'.bgMagenta.yellow);
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
});