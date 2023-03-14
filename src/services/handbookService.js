import db from "../models";

let createHandbook = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!data.nameHandbook || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameters...'
                })
            }
            else {
                await db.Handbook.create({
                    name: data.nameHandbook,
                    image: data.imgHandbook,
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'CREATE HANDBOOK OK'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getAllHandbook = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Handbook.findAll();
            if(data && data.length > 0) {
                data.map(item => {
                    item.image = Buffer.from(item.image, 'base64').toString('binary');
                    return item
                })
                resolve({
                    errCode: 0,
                    errMessage: 'GET ALL HANDBOOK OK',
                    data: data,
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}

let getDetailHandbookById = (handbookId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(!handbookId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter...'
                })
            }
            else {
                    let data = await db.Handbook.findOne({
                        where: {id: handbookId},
                        attributes: [
                            'contentHTML', 'contentMarkdown'
                        ]
                    })
    
                    resolve({
                        errCode: 0,
                        errMessage: 'GET DETAIL HANDBOOK OK',
                        data: data
                    })
                
            }
        } catch (error) {
            reject(error);
        }
    })
}

export default {
    createHandbook,
    getAllHandbook,
    getDetailHandbookById
}