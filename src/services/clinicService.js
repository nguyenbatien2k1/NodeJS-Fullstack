import db from "../models"

let createNewClinic = (data) => {
    return new Promise (async (resolve, reject) => {
        try {
            if(!data.nameClinic || !data.imageClinic || !data.addressClinic || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter...'
                })
            }
            else {
                await db.Clinic.create({
                    name: data.nameClinic,
                    address: data.addressClinic,
                    image: data.imageClinic,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Create a new clinic success!'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if(data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item
                })
                resolve({
                    errCode: 0,
                    errMessage: 'GET ALL SPECIALTY OK',
                    data: data,
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDetailClinicById = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter...'
                })
            }
            else {
                    let data = await db.Clinic.findOne({
                        where: {id: clinicId},
                        // attributes: [
                        //     'descriptionHTML', 'descriptionMarkdown'
                        // ]
                    })
                    if(data) {
                        let doctorClinic = [];
                        doctorClinic = await db.Doctor_Info.findAll({
                            where: {clinicId: clinicId},
                            attributes: ['doctorId']
                        })  

                        data.doctorClinic = doctorClinic;
                    }
                    else data = {}
    
                    resolve({
                        errCode: 0,
                        errMessage: 'GET DETAIL CLINIC OK',
                        data: data
                    })
                
            }
        } catch (error) {
            reject(error);
        }
    })
}

export default {
    createNewClinic,
    getAllClinic,
    getDetailClinicById

}