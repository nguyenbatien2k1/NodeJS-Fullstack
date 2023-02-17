import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController'

let router = express.Router();

let initWebRoutes = (app) => {
    router.get('/', homeController.homePage);

    router.get('/crud', homeController.getCRUD);

    router.post('/post-crud', homeController.postCRUD);

    router.get('/get-crud', homeController.displayCRUD);

    router.get('/edit-crud', homeController.editCRUD);

    router.post('/put-crud', homeController.putCRUD);

    router.get('/delete-crud', homeController.deleteCRUD);
    
    router.post('/api/login', userController.handleLogin);

    router.get('/api/get-all-users', userController.handleGetAllUsers);

    return app.use('/', router);
}

export default initWebRoutes;