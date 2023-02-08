import express from 'express';
import bodyParser from 'body-parser';
import configViewEngine from './configs/viewEngine';
import initWebRoutes from './route/web';

require('dotenv').config() // sử dụng để cấu hình file môi trường

let app = express();

let port = process.env.PORT || 1411;

//config app
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

configViewEngine(app);

initWebRoutes(app);

app.listen(port, () => {
    console.log('Tien iu Xuan');
})