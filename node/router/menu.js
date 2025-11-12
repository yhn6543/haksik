const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

const { app } = require("./server")
app.use("/menu", router)

const menuModel = require("../models/menuModel");

app.get("/", (req, res)=>{
    res.render("index")
})



router.get("/main/4", async(req, res)=>{
    console.log("가좌 교직원")
    const mi = "1341"
    const schSysId = "main"
    const date = new Date().toISOString().slice(0, 10);

    const meal = await menuModel.dbGetMeal(mi, 4)
    // console.log(meal)
    return res.send(meal)
})
router.get("/main/5", async(req, res)=>{
    console.log("가좌 중앙")
    const mi = "1341"
    const schSysId = "main"
    const date = new Date().toISOString().slice(0, 10);

    const meal = await menuModel.dbGetMeal(mi, 5)
    // console.log(meal)
    return res.send(meal)
})
router.get("/main/63", async(req, res)=>{
    console.log("가좌 교육문화센터")
    const mi = "1341"
    const schSysId = "main"
    const date = new Date().toISOString().slice(0, 10);

    const meal = await menuModel.dbGetMeal(mi, 63)
    // console.log(meal)
    return res.send(meal)
})

router.get("/cdorm/6", async(req, res)=>{
    const mi = "1342"
    const schSysId = "cdorm"
    const date = new Date().toISOString().slice(0, 10);

    const meal = await menuModel.dbGetMeal(mi, 6)
    // console.log(meal)
    return res.send(meal)
})
router.get("/cdorm/8", async(req, res)=>{
    const mi = "1342"
    const schSysId = "cdorm"
    const date = new Date().toISOString().slice(0, 10);

    const meal = await menuModel.dbGetMeal(mi, 8)
    // console.log(meal)
    return res.send(meal)
})

router.get("/tdorm/7", async(req, res)=>{
    const mi = "1343"
    const schSysId = "tdorm"
    const date = new Date().toISOString().slice(0, 10);

    const meal = await menuModel.dbGetMeal(mi,7)
    // console.log(meal)
    return res.send(meal)
})
router.get("/tdorm/9", async(req, res)=>{
    const mi = "1343"
    const schSysId = "tdorm"
    const date = new Date().toISOString().slice(0, 10);

    const meal = await menuModel.dbGetMeal(mi,9)
    // console.log(meal)
    return res.send(meal)
})



module.exports = router;