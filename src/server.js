import express from 'express';
import bodyParser from 'body-parser';
import configViewEngine from './config/viewEngine';
import initWebRoutes from './route/web';

import cors from "cors";

import connectDB from './config/connectDB'

require('dotenv').config() // sử dụng để cấu hình file môi trường

let app = express();

let port = process.env.PORT || 1411;

//
app.use(cors({ credentials: true, origin: true }));

//
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));

configViewEngine(app);

initWebRoutes(app);

// Connect Database
connectDB();

app.listen(port, () => {
    console.log('Tien iu Xuan');
})