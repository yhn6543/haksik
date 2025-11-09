const express = require('express');
const router = express.Router();
const session = require("express-session")


// const mysql = require("mysql2");
// const bcrypt = require('bcrypt');

const { app } = require("./server")
app.use(session({
    secret: "Key",
    resave: false,
    saveUninitialized: false,
    cookie: ({
        maxAge: 1000* 60 * 60,
        httpOnly: true
    })
}))
app.use("/user", router)

const verifyEmail = require("./verify-email")
router.use("/verify-email", verifyEmail)




const userModel = require("../models/userModel")
userModel.test()




router.get('/signIn', (req,res)=>{
    console.log("/signIn")
    if (req.session?.username) res.redirect('/');
    else res.render('signIn');
})

router.post('/signIn', async (req,res)=>{
    const result = await userModel.dbUserSignIn(req, res);
    // console.log(result)
    return res.send(result);
})








router.get('/signUp', (req, res)=>{
    return res.render('signUp');
})

router.post('/signUp', async (req, res) => {
    const result = await userModel.dbUserSignUp(req, res);
    console.log(result)
    return res.send(result)
})







router.get('/signOut', (req, res) => {
    delete req.session.user
    res.redirect('/')
})




module.exports = router;