import bcrypt from 'bcryptjs';
import db from "../models";


const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            resolve('create new user success!')

        } catch (error) {
            reject(error);
        }
    })
}

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

let getAllUsers = async () => {
    return new Promise( async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                raw: true,
            });
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}

let getUserById = async (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId},
                raw: true,
            });
            if(user) {
                resolve(user);
            }
            else {
                resolve('Not found user!');
            }
        } catch (error) {
            reject(error);
        }
    })
}

let updateUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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

                await db.User.update(user,  {where: {id: data.id}});
                // await user.save();

                resolve();
            }
            else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    })
}

let deleteUser = async (userId) => {
    return new Promise( async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId}
            })
            if(user) {
                await user.destroy();
            }
            resolve();
        } catch (error) {
            reject(error);
        }
    })
}

export default {
    createNewUser,
    hashUserPassword,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};