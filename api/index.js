import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import colors from 'colors';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

mongoose.connect(process.env.MONGODB_URI)
.then((res)=>console.log('> Database Connected...'.bgBlue))
.catch(err=>console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red ))

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log('> Server listening on port 3000...'.bgMagenta.yellow);
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
