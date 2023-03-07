import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';

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

    router.post('/api/create-new-user', userController.handleCreateNewUser);

    router.put('/api/edit-user', userController.handleEditUser);

    router.delete('/api/delete-user', userController.handleDeleteUser);

    router.get('/api/allcode', userController.getAllCode)

    router.get('/api/outstanding-doctor', doctorController.getOutStandingDoctor);
    
    router.get('/api/all-doctors', doctorController.getAllDoctors); 

    router.post('/api/info-doctor', doctorController.createInfoDoctor);
    
    router.get('/api/detail-doctor', doctorController.getDetailDoctor);

    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);

    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);

    router.get('/api/get-medical-address-doctor-by-id', doctorController.getMedicalAddressDoctorById);

    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.post('/api/patient-book-appointment', patientController.postBookAppointment);


    return app.use('/', router);
}

export default initWebRoutes;