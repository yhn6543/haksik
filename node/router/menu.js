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




// GSearchMenu()














// async function GSearchMenu(){
//     const initialResponse = await client.get(INITIAL_FORM_URL, {
//         headers: {
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
//             'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
//             'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
//         }
//     });


//     const targetRestaurant = "5"
//     const targetDate = "2025-10-08"
//     const targetSysId = "main"
//     const targetMi = "1341"

//     const postData = {
//             "mi": targetMi,
//             "sysId": "main",
//             "restSeq": targetRestaurant.toString(), // 식당 번호 (예: "5")
//             "schDt": targetDate,                   // 조회 날짜 (예: "2025-10-08")
//             "schSysId": targetSysId
//     };
    

//     const formBody = querystring.stringify(postData);



//     const submitResponse = await client.post(SUBMIT_ACTION_URL, formBody, {
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//             // 이전 페이지 URL을 Referer로 설정하여 유효성 검사 통과
//             'Referer': INITIAL_FORM_URL, 
//             'Origin': BASE_URL,
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
//         }
//     });


//     const $ = cheerio.load(submitResponse.data);
//     const menuTableRows = $('.tbl_list tbody tr'); 


//     const tr = $("#detailForm tbody tr")
//     console.log(tr.length)
//     console.log(tr.text().trim().replace(/\s+/g, ' '));
//     console.log("\n" + "--------------------------------------------------------" + "\n")
    
//     const cat = new Array()

//     tr.each((index, element) => {
//         const $tds = $(element).find("td");
//         // console.log($tds.length)
//         // console.log($tds.text().replace(/\s+/g, ' ') + "\n")

//         // const $th = $("tbody th");
//         // console.log($th.text().replace(/\s+/g, ' ') + "\n")

//         const $ths = $(element).find("th");
//         cat.push(($ths.html())
//                         .replace(/<br\s*\/?>/gi, '\n')
//                         .replace(/<[^>]*>?/gm, '') 
//                         .trim() + "\n")

        
                        
//         console.log(($ths.html())
//                         .replace(/<br\s*\/?>/gi, '\n')
//                         .replace(/<[^>]*>?/gm, '') 
//                         .trim() + "\n")

//         $tds.each((index, element) => {
//             const $td = $(element)
//             const div = $td.text().trim().replace(/\s+/g, ' ')
//             // console.log($td.length)
//             if(div == 0)
//                 console.log("###")
//             else
//                 console.log($td.text().replace(/\s+/g, ' '))
//         })
//         console.log("============================")
//     })
// }



// cron.schedule("* * * * * 1", () => {	// 매주 월요일 00시 00분 00초에 실행
//     console.log("매크로 실행---------------------")
//     const formData = formDataSet();
//     GSSearchMenu(formData);
//     // GCSearchMenu();
//     console.log("--------------------------------")
// }, {
//     schedule: true,
//     timezone: "Asia/Seoul"
// })


// function formDataSet(){
//     return axios({
//         method: "POST",
//         url: "https://www.gnu.ac.kr/" + url,
//         data: {
//             frm: "detailForm",
//             // schDt: "2025-10-04",
//             restSeq: "5",
//             schSysId: "main"
//         }
//     }).then((res) => {
//         const $ = cheerio.load(res.data);
//         const detailForm = $("#detailForm").html()
//         const mi = "1341";
//         const sysId = "main";
//         const restSeq = "5"
//         const today = new Date();
//         const schDt = today.getFullYear() + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2);
//         const schSysId = "main";

//         // console.log(detailForm.html().slice(0,500))
        
        
//         return {detailForm, mi, sysId, restSeq, schDt, schSysId}
//     })
// }


module.exports = router;