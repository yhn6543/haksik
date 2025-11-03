// 실행시킬 메인 파일
const express = require('express');
const router = express.Router();

// 메인 라우터가 실질적으로 라우터 역할
const mainRouter = require('./router');
router.use('/', mainRouter);

// console.log("/routes/index.js 실행 ")
