const express = require('express');
const router = express.Router();
const session = require("express-session")

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




router.get('/signIn', (req,res)=>{
    if (req.session.user) return res.redirect('/');

    return res.render('signIn');
})

router.post('/signIn', async (req,res)=>{
    const result = await userModel.dbUserSignIn(req);

    return res.send(result + `<br>
        <form action="/" method="get">
        <button type="submit">메인화면으로</button>
        </form>
        `);
})








router.get('/signUp', (req, res)=>{
    if (req.session.user) return res.redirect('/');

    return res.render('signUp');
})

router.post('/signUp', async (req, res) => {
    const result = await userModel.dbUserSignUp(req);

    return res.send(result);
})







router.get('/signOut', (req, res) => {
    delete req.session.user;

    res.redirect('/');
})




module.exports = router;