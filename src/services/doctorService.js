import db from "../models";
require('dotenv').config();
import _, { reject } from 'lodash';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;


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

function checkData(data) {
    let isValid = true;
    let element = '';
    let arrLength = Object.keys(data).length;
    if(arrLength === 0) {
        return {
            isValid: false,
            element: ''
        };
    }
    else {
        for (let i = 0; i < arrLength; i++) {
            let x = Object.keys(data)[i];
            let y = Object.values(data)[i];
            if(x === 'note' || x === 'clinicId') continue;
            else {
                if(!y) {
                    isValid = false;
                    element = x;
                    break;
                }
            }
        }
    }
    return {
        isValid,
        element
    }
}

let createInfoDoctor = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            if(checkData(data).isValid === false) {
                resolve({
                     errCode: 1,
                     errMessage: `Missing parameter ${checkData(data).element}...`
                })
            }
            else {
                let doctor = await db.Markdown.findOne({
                    where: {doctorId: data.doctorId}
                })
                if(data.action === 'CREATE') {
                    if(!doctor) {
                        await db.Markdown.create({
                            contentHTML: data.contentHTML,
                            contentMarkdown: data.contentMarkdown,
                            description: data.description,
                            doctorId: data.doctorId
                        })
                        
                    }
                }
                else if(data.action === 'EDIT') {
                    if(doctor) {
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
                    }
                }

                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {doctorId: data.doctorId}
                })
                if(doctorInfo) {
                    await db.Doctor_Info.update(
                        {
                            doctorId: data.doctorId,
                            specialtyId: data.specialtyId,
                            clinicId: data.clinicId,
                            priceId: data.selectedPrice,
                            paymentId: data.selectedPayment,
                            provinceId: data.selectedProvince,
                            nameClinic: data.nameClinic,
                            addressClinic: data.addressClinic,
                            note: data.note
                        }, 
                        {
                            where: {doctorId: data.doctorId}
                        })
                }
                else {
                    await db.Doctor_Info.create({
                        specialtyId: data.specialtyId,
                        clinicId: data.clinicId,
                        priceId: data.selectedPrice,
                        paymentId: data.selectedPayment,
                        provinceId: data.selectedProvince,
                        doctorId: data.doctorId,
                        nameClinic: data.nameClinic,
                        addressClinic: data.addressClinic,
                        note: data.note
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save Info Success!'
                })
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
                        {
                            model: db.Doctor_Info,
                            include: [
                                {model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']}
                            ]
                        },
                    ],
                    raw: false,
                    nest: true,
                })
                if(data) {
                    if(data.image) {
                        data.image = Buffer.from(data.image, 'base64').toString('binary');
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

let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.arrSchedule || !data.date || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter...'
                })
            }
            else {
                let schedule = data.arrSchedule;
                if(schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let doctor = await db.Schedule.findAll({
                    where: {
                        doctorId: data.doctorId,
                        date: data.date
                    },
                    attributes: [
                        'timeType', 'date', 'doctorId', 'maxNumber'
                    ]
                })

                let toCreate = _.differenceWith(schedule, doctor, (a,b) => {
                    return a.timeType === b.timeType && a.date === b.date;
                });

                // so sánh mảng khác nhau mới cho tạo schedule
                if(toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getScheduleDoctorByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        if(!doctorId || !date) {
            resolve({
                errCode: 1,
                errMessage: 'Missing parameter...'
            })
        }
        else {
            let data = await db.Schedule.findAll({
                where: {
                    doctorId: doctorId,
                    date: date
                },
                include: [
                    {model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi']},
                    {model: db.User, as: 'doctorData',
                        attributes: ['firstName', 'lastName'],
                        include: [
                            {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                        ],
                    },
                ],
                raw: true,
                nest: true,
            })

            if(!data) data = [];

            resolve({
                errCode: 0,
                data
            })
        }
    })
}

let getMedicalAddressDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: 0,
                    errMessage: 'Missing parameter...'
                })
            }
            else {
                let data = await db.Doctor_Info.findOne({
                    where: {doctorId: doctorId},
                    include: [
                        {model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']}
                    ],
                    raw: false,
                    nest: true,
                })

                if(!data) data = {};

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

let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId) {
                resolve({
                    errCode: 0,
                    errMessage: 'Missing parameter...'
                })
            }
            else {
                let data = await db.User.findOne({
                    where: {id: doctorId},
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi']},
                        {model: db.Markdown, attributes: ['description', 'contentHTML', 'contentMarkdown']},
                        {
                            model: db.Doctor_Info,
                            include: [
                                {model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi']},
                                {model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi']}
                            ]
                        }
                    ],
                    raw: false,
                    nest: true,
                })

                if(data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
                }

                if(!data) data = {};

                resolve({
                    errCode: 0,
                    data: data
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getListPatient = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter...'
                })
            } 
            else {
                let listPatient = await db.Booking.findAll({
                    where: {statusId: 'S2', doctorId: doctorId, date: date},
                    include: [
                        {model: db.User, as: 'patientData', attributes: ['address', 'gender'],
                            include: [
                                {model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi']}
                            ]
                        }
                    ],
                    raw: false,
                    nest: true,
                })

                resolve({
                    errCode: 0,
                    errMessage: 'GET LIST PATIENT OK',
                    data: listPatient
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
    getDetailDoctor,
    bulkCreateSchedule,
    getScheduleDoctorByDate,
    getMedicalAddressDoctorById,
    getProfileDoctorById,
    getListPatient
};