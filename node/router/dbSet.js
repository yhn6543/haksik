const express = require("express");
const router = express.Router();
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const querystring = require('querystring');

const jar = new CookieJar();
const client = wrapper(axios.create({ 
    jar,
    withCredentials: true 
}));

const menuModel = require("../models/menuModel");


const formData = [
    {mi: "1341", restSeq: "4", schSysId: "main"},   // 가좌 - 교직원식당
    {mi: "1341", restSeq: "5", schSysId: "main"},   // 가좌 - 중앙식당
    {mi: "1341", restSeq: "63", schSysId: "main"},  // 가좌 - 교육문화1층식당
    {mi: "1342", restSeq: "6", schSysId: "cdorm"},  // 칠암 - 교직원식당
    {mi: "1342", restSeq: "8", schSysId: "cdorm"},  // 칠암 - 학생식당
    {mi: "1343", restSeq: "7", schSysId: "tdorm"},  // 통영 - 교직원식당
    {mi: "1343", restSeq: "9", schSysId: "tdorm"}   // 통영 - 학생식당
]


const BASE_URL = 'https://www.gnu.ac.kr';
const INITIAL_FORM_URL = "https://www.gnu.ac.kr/main/ad/fm/foodmenu/selectFoodMenuView.do?mi=1341"
const SUBMIT_ACTION_URL = BASE_URL + '/main/ad/fm/foodmenu/selectFoodMenuView.do'; 


async function searchMenu(data){
    const initialResponse = await client.get(INITIAL_FORM_URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        },
        timeout: 10000
    });


    const today = new Date();
    const targetDate = today.getFullYear() + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2);

    const postData = {
            "mi": data.mi,
            "sysId": "main",
            "restSeq": data.restSeq.toString(),
            "schDt": targetDate,
            "schSysId": data.schSysId
    };

    const formBody = querystring.stringify(postData);


    const submitResponse = await client.post(SUBMIT_ACTION_URL, formBody, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': INITIAL_FORM_URL, 
            'Origin': BASE_URL,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
        }
    });

    console.log(data.mi, data.restSeq)

    
    const $ = cheerio.load(submitResponse.data);
    const tr = $("#detailForm tbody tr")

    // console.log("\n" + "--------------------------------------------------------" + "\n")
    
    const cat = {}
    
    const date = $(".date .txt_p").text().slice(0, 10);
    const [YEAR, MONTH, DATE] = date.split("-")
    // console.log(YEAR, MONTH, DATE)
    

    tr.each((index, element) => {
        const $tds = $(element).find("td");
        let DB = 1;
        
        //////////////////////////////////////////// 구분 ////////////////////////////////////////////
        const $ths = $(element).find("th");
        const text = ($ths.html()).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, '').trim()
        cat[text] = []
        
        if(text.includes("고정메뉴") || text.includes("더진국"))
            DB = 0;
        /////////////////////////////////////////////////////////////////////////////////////////////

        if(text != "알레르기정보"){
            $tds.each((index, element) => {
                const $divs = $(element).find("div");
    
                $divs.each((_, element) => {
                    const $ps = $(element).find("p")
                    const date = new Date(YEAR, MONTH-1, DATE, 12, 0, 0);
                    date.setDate(date.getDate()+index)
                    
                    const menu = { "date": date.toISOString().slice(0, 10) }
    
    
                    $ps.each((_, element) => {
                        const $p = $(element)
                        // console.log($p.text().trim().replace(/\s+/g, ' '))
                        // console.log("\n")
                        const html = $p.html().trim()
                                        .replace(/\s+/g, ' ')
                                        .replace(/\)/g, ')\n')
                                        .trim()
                        // console.log(html+"\n");
                        // console.log("\n");
                        p = html.replace(/<br>/g, "\n");
                        // console.log($p.attr("class"))
                        // console.log($p.html().trim());
                        
                        if($p.attr("class")){
                            // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
                            // console.log("option - ", p)
                            menu["opt"] = p
                        }
                        else{
                            // console.log($p.toString())
                            // console.log($p.html().trim().replace(/<br>/g, "\n"))
                            const t = $p.html().trim().replace(/<br>/g, "\n")
                            // console.log(t)
                            let te = $("<div>").html(t).text().trim();
                            // console.log(te);
                            // console.log("menu - ", p)
                
                            // const div = $p.text()
                            //                 .trim()
                            //                 .replace(/\s+/g, ' ')
                            //                 .replace(/\)/g, ')\n')
                            //                 .slice(box.text().length)
                            //                 .trim()
                            // console.log($td.length)
                            
                            
                            if(p.slice(-1) == "\n"){
                                p = p.slice(0, p.length-1);
                            }
            
                            if(p == 0){
                                // console.log("menu - " + "###")
                                menu["menu"] = ""
                            }
                            else{
                                // console.log("menu - " + te)
                                // console.log("text - ", text, "menu - ", menu, "DB - ", DB);
                                if(te.includes("(천원의 아침밥)")){
                                    te = te.replace("(천원의 아침밥)\n", "");
                                    menu["opt"] = "천원의 아침밥";
                                }
                                  
                                menu["menu"] = te
                                // console.log(te);
                                // console.log("\n")
                                if(DB)
                                    menuModel.dbMenuSet(te, data.restSeq, data.mi);
                            }
                            
                            // console.log(text);
                            cat[text].push(menu)
                            menuModel.dbMealSet(menu, data.restSeq, data.mi, text);
                            // console.log(menu)
                        }
                    })
                })
    
                // console.log(cat[text])
            })
        }
    })

    // console.log(cat)
    
    // console.log("시작 날짜", date)
}

// searchMenuWithDelay();


cron.schedule("0 0 20 * * 5", () => {	// 매주 금요일 20시 00분 00초에 실행
    console.log("매크로 실행---------------------")
    
    // formData.forEach((data) => { searchMenu(data) })
    // console.log(formData[0])
    // searchMenu(formData[1])
    searchMenuWithDelay();
    
    console.log("--------------------------------\n\n\n\n")
}, {
    schedule: true,
    timezone: "Asia/Seoul"
})


// 9
// searchMenu(formData[6])

// 8
// searchMenu(formData[4])

// 63
// searchMenu(formData[2])

const delay = (ms) => new Promise(res => setTimeout(res, ms));
// 딜레이를 줘서 과부하 방지
async function searchMenuWithDelay() {
    try{
        for(data of formData){
            await searchMenu(data)
            await delay(500)
        }
    }
    catch(err){
        console.log("searchMenuWithDelay Error - ", err);
    }
}




// console.log("db_set.js");

module.exports = router;