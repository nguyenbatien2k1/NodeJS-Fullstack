import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
import doctorController from '../controllers/doctorController';
import patientController from '../controllers/patientController';
import specialtyController from '../controllers/specialtyController';
import clinicController from '../controllers/clinicController';
import handbookController from '../controllers/handbookController';

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

    router.get('/api/allcode', userController.getAllCode);

   
    //
    router.get('/api/outstanding-doctor', doctorController.getOutStandingDoctor);
    
    router.get('/api/all-doctors', doctorController.getAllDoctors); 

    router.post('/api/info-doctor', doctorController.createInfoDoctor);
    
    router.get('/api/detail-doctor', doctorController.getDetailDoctor);

    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);

    router.get('/api/get-schedule-doctor-by-date', doctorController.getScheduleDoctorByDate);

    router.get('/api/get-medical-address-doctor-by-id', doctorController.getMedicalAddressDoctorById);

    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);

    router.get('/api/get-list-patient', doctorController.getListPatient);

    router.post('/api/send-remedy', doctorController.sendRemedy);


    
    //
    router.post('/api/patient-book-appointment', patientController.postBookAppointment);

    router.post('/api/verify-book-appointment', patientController.postVerifyBookAppointment);

    router.post('/api/create-new-specialty', specialtyController.createNewSpecialty);

    router.get('/api/get-all-specialty', specialtyController.getAllSpecialty);

    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById);

    router.post('/api/create-new-clinic', clinicController.createNewClinic);

    router.get('/api/get-all-clinic', clinicController.getAllClinic);

    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById);

    //
    router.post('/api/create-handbook', handbookController.createHandbook);

    router.get('/api/get-all-handbook', handbookController.getAllHandbook);

    router.get('/api/get-detail-handbook-by-id', handbookController.getDetailHandbookById);


    return app.use('/', router);
}

export default initWebRoutes;