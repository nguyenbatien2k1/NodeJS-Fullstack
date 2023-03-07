import db from "../models";
import emailService from "./emailService";

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
                    receiverEmail: data.email
                });

                let user = await db.User.findOrCreate({
                    where: {email: data.email},
                    defaults: {
                        email: data.email,
                        roleId: 'R3'
                    }
                })
                if(user && user[0]) {
                    let checkUser = await db.Booking.findOne({
                        // where: {patientId: user[0].id}
                        where: {doctorId: data.doctorId, date: data.date, timeType: data.timeType}
                    })
                    if(checkUser) {
                        await db.Booking.update({
                            doctorId: data.doctorId,
                            statusId: 'S1',
                            patientId: user[0].id,
                            date: data.date,
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
                            date: data.date,
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