import clinicService from "../services/clinicService";

let createNewClinic = async (req, res) => {
    try {
        let data = await clinicService.createNewClinic(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server...'
        })
    }
}

let getAllClinic = async (req, res) => {
    try {
        let data = await clinicService.getAllClinic();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server...'
        })
    }
} 

let getDetailClinicById = async (req, res) => {
    try {
        let data = await clinicService.getDetailClinicById(req.query.clinicId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server...'
        })
    }
}

export default {
    createNewClinic,
    getAllClinic,
    getDetailClinicById
}