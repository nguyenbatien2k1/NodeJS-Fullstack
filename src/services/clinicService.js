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

export default {
    createNewClinic,
}