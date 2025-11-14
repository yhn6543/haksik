const express = require("express");
const router = express.Router();

const { app } = require("./server")
app.use("/menu", router)

const menuModel = require("../models/menuModel"); // menu테이블과 상호작용할 model 연결
const cronJobRequire = require("../jobs/cronDB"); // 자동으로 DB에 메뉴 등록

router.get("/", async(req, res) => {
    const meal = await menuModel.dbGetMeal(req.query.restSeq)
    return res.send(meal)
})



module.exports = router;