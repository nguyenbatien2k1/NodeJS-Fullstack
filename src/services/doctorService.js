import db from "../models";

let getOutStandingDoctor = (limit) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                where: {roleId: 'R2'},
                limit: limit,
                order: [
                    [
                        "createdAt", "DESC"
                    ]
                ],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']},
                ],
                raw: true,
                nest: true,
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (error) {
            reject(error);
        }
    })
}

let getAllDoctors = () => {
    return new Promise( async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {roleId: 'R2'},
                order: [
                    [
                        "createdAt", "DESC"
                    ]
                ],
                attributes: {
                    exclude: ['password', 'image']
                },
            });
            if(doctors) {
                resolve({
                    errCode: 0,
                    data: doctors
                });
            }
            else {
                resolve({
                    errorCode: -1,
                    errMessage: 'Error from server...'
                });
            }
        } catch (error) {
            reject(error);
        }
    })
}

let createInfoDoctor = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(!data.doctorId || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter..."
                })
            }
            else {
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                    specialtyId: data.specialtyId,
                    clinicId: data.clinicId
                })

                resolve({
                    errCode: 0,
                    errMessage: 'Create doctor info success!'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

export default {
    getOutStandingDoctor,
    getAllDoctors,
    createInfoDoctor
};