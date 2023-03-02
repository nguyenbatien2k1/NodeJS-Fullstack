import doctorService from '../services/doctorService';

let getOutStandingDoctor = async (req, res) => {
    let limit = req.query.limit;
    if(!limit) limit = 10;

    try {
        let doctors = await doctorService.getOutStandingDoctor(+limit);
        console.log(doctors);
        return res.status(200).json(doctors);

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

export default {
    getOutStandingDoctor,
}