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
            if(!data.doctorId || !data.contentHTML || !data.contentMarkdown || !data.action) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter..."
                })
            }
            else {
                if(data.action === 'CREATE') {
                    let user = await db.Markdown.findOne({
                        where: {doctorId: data.doctorId}
                    })
                    if(!user) {
                        await db.Markdown.create({
                            contentHTML: data.contentHTML,
                            contentMarkdown: data.contentMarkdown,
                            description: data.description,
                            doctorId: data.doctorId
                        })
        
                        resolve({
                            errCode: 0,
                            errMessage: 'Create doctor info success!'
                        })
                    }
                    else {
                        resolve({
                            errCode: -1,
                            errMessage: 'Create doctor info failed!'
                        })
                    }
                }
                else {
                    let user = await db.Markdown.findOne({
                        where: {doctorId: data.doctorId}
                    })
                    if(user) {
                        await db.Markdown.update(
                        {
                            contentHTML: data.contentHTML,
                            contentMarkdown: data.contentMarkdown,
                            description: data.description,
                            doctorId: data.doctorId
                        }, 
                        {
                            where: {doctorId: data.doctorId}
                        })

                        resolve({
                            errCode: 0,
                            errMessage: 'Update doctor info success!'
                        })
                    }
                    else resolve({
                        errCode: 1,
                        errMessage: `User isn't exist in the system...`
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDetailDoctor = (doctorId) => {
    return new Promise (async (resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter...'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown']},
                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                    ],
                    raw: false,
                    nest: true,
                })
                if(data) {
                    if(data.image) {
                        data.image = new Buffer(data.image, 'base64').toString('binary');
                    }
                }
                else {
                    data = {}
                }

                resolve({
                    errCode: 0,
                    data: data
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
    createInfoDoctor,
    getDetailDoctor
};