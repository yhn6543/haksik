const express = require('express');
const router = express.Router();


const { app } = require("./server")
app.use("/survey", router)

const surveyModel = require("../models/surveyModel")

router.get('/', async(req, res) => {
    // console.log(req.session)
    if(!req.session.user) return res.render('signIn')
    else if(!req.session.email) return res.render('verify-email')
    
    return res.render('survey');
})


module.exports = router;