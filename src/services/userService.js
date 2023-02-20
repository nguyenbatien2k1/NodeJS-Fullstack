import db from "../models";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise( async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (error) {
            reject(error);
        }
    })
}

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

let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = '';
            if(userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if(userId && userId !== 'ALL') {
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            else {
                //
            }
            resolve(users);
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser = (data) => {
    return new Promise( async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);

            if(check) {
                resolve({
                    errCode: 1,
                    errMessage: `Your's email is already in used!`
                })
            }
            else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phonenumber: data.phonenumber,
                    gender: data.gender === '1' ? true : false,
                    image: '',
                    roleId: data.roleId,
                    positionId: '',
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let editUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist!`
                })
            }
            let user = await db.User.findOne({
                where: {id: data.id}
            });
            if(user) {
                let hashPassword = await hashUserPassword(user.password);
                user.email = data.email;
                user.password = hashPassword;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phonenumber = data.phonenumber;
                user.gender = data.gender;
                user.roleId = data.roleId;

                await db.User.update(user, {where: {id: data.id}});

                resolve({
                    errCode: 0,
                    errMessage: `UPDATE OK!`
                })
            }
            else {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist!`
                })
            }

        } catch (error) {
            reject(error);
        }
    })
}

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: id}
            })
            if(!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist!`
                })
            }
            await db.User.destroy({
                where: {id: id}
            });
            resolve({
                errCode: 0,
                errMessage: `The user is deleted!`
            });
        } catch (error) {
            reject(error);
        }
    })
}

export default {
    handleUserLogin,
    getAllUsers,
    createNewUser,
    editUser,
    deleteUser,
}