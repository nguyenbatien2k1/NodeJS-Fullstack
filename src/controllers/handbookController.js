import handbookService from "../services/handbookService";

let createHandbook = async (req, res) => {
    try {
        let data = await handbookService.createHandbook(req.body);
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
    createHandbook
}