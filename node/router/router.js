const express = require("express");
const router = express.Router();

const userRouter = require('./user');
const menuRouter = require('./menu');
const dbSetRouter = require('./dbSet');
const surveyRouter = require('./survey');
const serverRouter = require("./server").router;

const { app } = require("./server")
app.get("/", (req, res) => {
    console.log(req.session)
    return res.render("index", { user: req.session.user, email: req.session.email })
})

// 서버 구동
router.use("/server", serverRouter);
// 유저 관리
router.use('/user', userRouter);
// 메뉴
router.use('/menu', menuRouter);
// 평점
router.use('/survey', surveyRouter);

module.exports = router;