import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
    try {
        let data = await patientService.postBookAppointment(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error From Server...'
        })
    }
}

let postVerifyBookAppointment = async (req, res) => {
    try {
        let data = await patientService.postVerifyBookAppointment(req.query.doctorId, req.query.token);
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
    postBookAppointment,
    postVerifyBookAppointment
}