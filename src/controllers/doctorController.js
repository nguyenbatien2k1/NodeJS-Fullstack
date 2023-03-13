import doctorService from '../services/doctorService';

let getOutStandingDoctor = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 10;

    try {
        let doctors = await doctorService.getOutStandingDoctor(+limit);
        return res.status(200).json(doctors);

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        if(doctors && doctors.errCode === 0) {
            return res.status(200).json(doctors)
        }
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let createInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.createInfoDoctor(req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getDetailDoctor = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctor(req.query.doctorId);
        return res.status(200).json(info);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...' 
        })
    }
}

let bulkCreateSchedule = async (req, res) => {
    try {
        let data = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...' 
        })
    }
}

let getScheduleDoctorByDate = async (req, res) => {
    try {
        let data = await doctorService.getScheduleDoctorByDate(req.query.doctorId, req.query.date);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...' 
        })
    }
}

let getMedicalAddressDoctorById = async (req, res) => {
    try {
        let data = await doctorService.getMedicalAddressDoctorById(req.query.doctorId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...' 
        })
    }
} 

let getProfileDoctorById = async (req, res) => {
    try {
        let data = await doctorService.getProfileDoctorById(req.query.doctorId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...' 
        })
    }
}

let getListPatient = async (req, res) => {
    try {
        let data = await doctorService.getListPatient(req.query.doctorId, req.query.date);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...' 
        })
    }
}

let sendRemedy = async (req, res) => {
    try {
        let data = await doctorService.sendRemedy(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...' 
        })
    }
}

export default {
    getOutStandingDoctor,
    getAllDoctors,
    createInfoDoctor,
    getDetailDoctor,
    bulkCreateSchedule,
    getScheduleDoctorByDate,
    getMedicalAddressDoctorById,
    getProfileDoctorById,
    getListPatient,
    sendRemedy
}