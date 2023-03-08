import db from "../models";
import emailService from "./emailService";
const { Op } = require("sequelize");

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
                    redirectLink: 'https://www.google.com/',
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
                            timeType: data.timeType
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
                            timeType: data.timeType
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

export default {
    postBookAppointment,
}