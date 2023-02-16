import db from "../models";
import bcrypt from "bcryptjs";

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if(isExist) {
                // User already exist
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'],
                    where: {email: email},
                    raw: true,
                });
                if(user) {
                    let check = bcrypt.compareSync(password, user.password);
                    if(check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';
                        delete user.password;
                        userData.user = user; 
                    }
                    else {
                        userData.errCode = 3;
                        userData.errMessage = `Wrong Password!`
                    }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = `User's not found!`;
                }
            }
            else {
                userData.errCode = 1;
                userData.errMessage = `Your's email isn't exist in system!`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {email: email}
            });
            if(user) {
                resolve(true);
            }
            else resolve(false);
        } catch (error) {
            reject(error);
        }
    })
}

export default {
    handleUserLogin,
}