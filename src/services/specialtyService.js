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
                    name: data.nameSpecialty,
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

export default {
    createNewSpecialty
}