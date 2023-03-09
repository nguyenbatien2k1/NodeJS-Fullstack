import db from "../models";

let createNewSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.nameSpecialty || !data.imageSpecialty || !data.descriptionHTML || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter...'
                })
            }
            else {
                await db.Specialty.create({
                    nameVi: data.nameSpecialty,
                    nameEn: '',
                    image: data.imageSpecialty,
                    descriptionMarkdown: data.descriptionMarkdown,
                    descriptionHTML: data.descriptionHTML,
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Create a new specialty success!'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
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

let getDetailSpecialtyById = (specialtyId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!specialtyId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter...'
                })
            }
            else {
                    let data = await db.Specialty.findOne({
                        where: {id: specialtyId},
                        attributes: [
                            'descriptionHTML', 'descriptionMarkdown'
                        ]
                    })
                    if(data) {
                        let doctorSpecialty = [];

                        if(location === 'ALL') {
                            doctorSpecialty = await db.Doctor_Info.findAll({
                                where: {specialtyId: specialtyId},
                                attributes: ['doctorId', 'provinceId']
                            })  

                        }
                        else {
                            doctorSpecialty = await db.Doctor_Info.findAll({
                                where: {specialtyId: specialtyId, provinceId: location},
                                attributes: ['doctorId', 'provinceId']
                            })
                        }
                        data.doctorSpecialty = doctorSpecialty;
                    }
                    else data = {}
    
                    resolve({
                        errCode: 0,
                        errMessage: 'GET SPECIALTY OK',
                        data: data
                    })
                
            }
        } catch (error) {
            reject(error);
        }
    })
}

export default {
    createNewSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById
}