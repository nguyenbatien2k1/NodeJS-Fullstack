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

export default {
    createHandbook
}