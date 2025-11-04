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




router.get('/login', (req,res)=>{
    console.log("/login")
    if (req.session?.username) res.redirect('/');
    else res.render('login');
})
router.post('/login', (req,res)=>{
    userModel.dbUserLogin(req, res);
})








router.get('/join', (req, res)=>{
    return res.render('join');
})

router.post('/join', (req, res) => {
    userModel.dbUserJoin(req, res);

    res.render('join');
})







router.get('/logout', (req, res) => {
    delete req.session.user
    res.redirect('/')
})




module.exports = router;