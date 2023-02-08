import express from 'express';

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', (req, res) => {
        return res.send('Hi Tien!');
    })
    return app.use('/', router);
}

export default initWebRoutes;