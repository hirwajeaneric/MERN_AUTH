import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import colors from 'colors';
import userRoutes from './routes/user.route.js';

mongoose.connect(process.env.MONGODB_URI)
.then((res)=>console.log('> Database Connected...'.bgCyan))
.catch(err=>console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red ))

const app = express();

app.listen(3000, () => {
    console.log('> Server listening on port 3000...'.bgMagenta);
});

app.use('/api/user', userRoutes)