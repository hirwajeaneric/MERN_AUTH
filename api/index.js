import express from 'express';
import mongoose from 'mongoose';
import colors from 'colors';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
.then((res)=>console.log('> Database Connected...'.bgCyan))
.catch(err=>console.log(`> Error while connecting to mongoDB : ${err.message}`.underline.red ))

const app = express();

app.listen(3000, () => {
    console.log('> Server listening on port 3000...'.bgMagenta);
});