const { dbConnect } = require("../router/server")

console.log("===== surveyModel =====");


const { app } = require("../router/server")
const db = dbConnect();

async function dbSurveyPost(req) {
    
}



module.exports = {
    dbSurveyPost
}