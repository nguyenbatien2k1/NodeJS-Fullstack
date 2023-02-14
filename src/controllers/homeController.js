import db from "../models";
import CRUDservice from "../services/CRUDservice";

let homePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error);
    }
}

let getCRUD = async (req, res) => {
    return res.render('crud.ejs')
}

let postCRUD = async (req, res) => {
    let message = await CRUDservice.createNewUser(req.body)
    console.log(message);
    return res.redirect('/get-crud');
}

let displayCRUD = async (req, res) => {
    let data = await CRUDservice.getAllUsers();
    return res.render('display-crud.ejs', {
        data,
    });
}

let editCRUD = async (req, res) => {
    let userId = req.query.id;
    if(userId) {
        let userData = await CRUDservice.getUserById(userId);
        return res.render('edit-crud.ejs', {
            userData
        });
    }
    else {
        return res.send('User not found!')
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    await CRUDservice.updateUser(data);
    return res.redirect('/get-crud')
}

let deleteCRUD = async (req, res) => {
    let userId = req.query.id;
    if(userId) {
        await CRUDservice.deleteUser(userId);
        return res.redirect('/get-crud')
    }
    else {
        return res.send('User not found!')
    }
}

export default {
    homePage,
    getCRUD,
    postCRUD,
    displayCRUD,
    editCRUD,
    putCRUD,
    deleteCRUD,
};