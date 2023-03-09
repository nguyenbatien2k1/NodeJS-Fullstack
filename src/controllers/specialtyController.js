import specialtyService from "../services/specialtyService";

let createNewSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.createNewSpecialty(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server...'
        })
    }
}

let getAllSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialty();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server...'
        })
    }
} 

let getDetailSpecialtyById = async (req, res) => {
    try {
        let data = await specialtyService.getDetailSpecialtyById(req.query.specialtyId, req.query.location);
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
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}