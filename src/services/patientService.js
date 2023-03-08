import db from "../models";
import emailService from "./emailService";
const { Op } = require("sequelize");
import { v4 as uuidv4 } from 'uuid';


function checkData(data) {
    if(!Object.keys(data).length) return false;
    else {
        for (let i = 0; i < Object.keys(data).length; i++) {
            if(Object.keys(data)[i] === 'note') continue;
            if(!Object.values(data)[i]) return false;
        }
    }
    return true;
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
                    errMessage: 'Missing parameter...'
                })
            }
            else {

                let token = uuidv4();

                await emailService.sendSimpleEmail({
                    fullname: data.fullname,
                    receiverEmail: data.email,
                    phonenumber: data.phonenumber,
                    address: data.address,
                    timeVi: data.timeVi,
                    timeEn: data.timeEn,
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
                        where: {doctorId: data.doctorId, timeType: data.timeType, 
                            [Op.or]: [
                                { timeVi: data.timeVi },
                                { timeEn: data.timeEn }
                          ]}
                    })
                    if(checkUser) {
                        await db.Booking.update({
                            doctorId: data.doctorId,
                            statusId: 'S1',
                            patientId: user[0].id,
                            fullname: data.fullname,
                            phonenumber: data.phonenumber,
                            timeVi: data.timeVi,
                            timeEn: data.timeEn,
                            timeType: data.timeType,
                            token: token
                        }, {where: {patientId: user[0].id}});

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
                            timeVi: data.timeVi,
                            timeEn: data.timeEn,
                            timeType: data.timeType,
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