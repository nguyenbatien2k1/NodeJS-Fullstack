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

export default {
    getOutStandingDoctor,
    getAllDoctors,
    createInfoDoctor,
    getDetailDoctor
}