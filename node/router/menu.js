const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

const { app } = require("./server")
app.use("/menu", router)

const menuModel = require("../models/menuModel");

router.get("/", async(req, res) => {
    console.log(req.query);
    let restSeq = req.query.restSeq;
    let mi;

    if(restSeq == "4" || restSeq == "5" || restSeq == "63") mi = "1341";
    else if(restSeq == "6" || restSeq == "8") mi = "1342";
    else if(restSeq == "7" || restSeq == "9") mi = "1343";

    const meal = await menuModel.dbGetMeal(mi, restSeq)
    return res.send(meal)
})



module.exports = router;