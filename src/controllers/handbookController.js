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

let getAllHandbook = async (req, res) => {
    try {
        let data = await handbookService.getAllHandbook();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...' 
        })
    }
} 

let getDetailHandbookById = async (req, res) => {
    try {
        let data = await handbookService.getDetailHandbookById(req.query.handbookId);
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
    createHandbook,
    getAllHandbook,
    getDetailHandbookById
}