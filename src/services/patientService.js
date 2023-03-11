import db from "../models";
import emailService from "./emailService";
const { Op } = require("sequelize");
import { v4 as uuidv4 } from 'uuid';


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
            if(x === 'note') continue;
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


let buildUrlEmail = (doctorId, token) => {
  let result = `${process.env.URL_REACT}/verify-book-appointment?token=${token}&doctorId=${doctorId}`
  return result;
}


let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!checkData(data)) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing ${checkData(data).element}...`
                })
            }
            else {

                let token = uuidv4();

                await emailService.sendSimpleEmail({
                    fullname: data.fullname,
                    receiverEmail: data.email,
                    phonenumber: data.phonenumber,
                    address: data.address,
                    time: data.time,
                    reason: data.reason,
                    price: data.price,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId, token)
                });


                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3',
                        gender: data.selectedGender,
                        address: data.address,
                    }
                })

                if(user && user[0]) {
                    let checkUser = await db.Booking.findOne({
                        where: {
                            doctorId: data.doctorId, 
                            timeType: data.timeType, 
                            date: data.date, 
                            patientId: user[0].id,
                            statusId: 'S1',
                        }

                    })
                    if(checkUser) {
                        await db.Booking.update({
                            doctorId: data.doctorId,
                            statusId: 'S1',
                            patientId: user[0].id,
                            fullname: data.fullname,
                            phonenumber: data.phonenumber,
                            date: data.date,
                            timeType: data.timeType,
                            reason: data.reason,
                            token: token
                        }, {where: {doctorId: data.doctorId, timeType: data.timeType, date: data.date, patientId: user[0].id}, statusId: 'S1'});

                        resolve({
                            errCode: 0,
                            errMessage: 'Update booking appointment success...'
                        })
                    }
                    else {
                        await db.Booking.create({
                            doctorId: data.doctorId,
                            statusId: 'S1',
                            patientId: user[0].id,
                            fullname: data.fullname,
                            phonenumber: data.phonenumber,
                            date: data.date,
                            timeType: data.timeType,
                            reason: data.reason,
                            token: token
                        })

                        resolve({
                            errCode: 0,
                            errMessage: 'Booking appointment success...'
                        })
                    }
                }
                
            }
        } catch (error) {
            reject(error);
        }
    })
}

let postVerifyBookAppointment = (token, doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!doctorId || !token) {
                resolve({
                    errCode: 1,
                    errMessage: 'Mising parameter...'
                })
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        token: token,
                        doctorId: doctorId,
                        statusId: 'S1'
                    },
                    raw: false
                })
                if(appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();

                    resolve({
                        errCode: 0,
                        errMessage: 'Update Appointment Success...'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment does not exist or has been activated...'
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}

export default {
    postBookAppointment,
    postVerifyBookAppointment
}