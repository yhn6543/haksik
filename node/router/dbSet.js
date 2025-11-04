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


const formData = [
    {mi: "1341", restSeq: "4", schSysId: "main"},   // 가좌 - 교직원식당
    {mi: "1341", restSeq: "5", schSysId: "main"},   // 가좌 - 중앙식당
    {mi: "1341", restSeq: "63", schSysId: "main"},  // 가좌 - 교육문화1층식당
    {mi: "1342", restSeq: "6", schSysId: "cdorm"},  // 통영 - 교직원식당
    {mi: "1342", restSeq: "8", schSysId: "cdorm"},  // 통영 - 학생식당
    {mi: "1343", restSeq: "7", schSysId: "tdorm"},  // 찰암 - 교직원식당
    {mi: "1343", restSeq: "9", schSysId: "tdorm"}   // 찰암 - 학생식당
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
    const menuTableRows = $('.tbl_list tbody tr'); 


    const tr = $("#detailForm tbody tr")

    // console.log("\n" + "--------------------------------------------------------" + "\n")
    
    const cat = {}
    
    const date = $(".date .txt_p").text().slice(0, 10);
    const [YEAR, MONTH, DATE] = date.split("-")
    // console.log(YEAR, MONTH, DATE)


    tr.each((index, element) => {
        const $tds = $(element).find("td");
        
        //////////////////////////////////////////// 구분 ////////////////////////////////////////////
        const $ths = $(element).find("th");
        const text = ($ths.html()).replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>?/gm, '').trim()
        /////////////////////////////////////////////////////////////////////////////////////////////


        cat[text] = []



        $tds.each((index, element) => {
            const $divs = $(element).find("div")
            const date = new Date(2025, 10, 11, 12, 0, 0);
            date.setDate(date.getDate()+index)
            // console.log(date.toString())

            $divs.each((_, element) => {
                const $div = $(element)
                const menu = { "date": date.toISOString().slice(0, 10) }
                // console.log($div.text().trim().replace(/\s+/g, ' '))
                // console.log("\n")
    
                const box = $div.find(".fm_tit_p.mgt15")
                
                if(box.length){
                    // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
                    // console.log("option - ", box.text())
                    menu["opt"] = box.text()
                }
                
                
                // console.log(box.text().length)
    
                const html = $div.html().trim()
                                .replace(/\s+/g, ' ')
                                .replace(/\)/g, ')\n')
                                .slice(box.text().length)
                                .trim()
                // console.log(html)
                // console.log("\n");


    
                const div = $div.text()
                                .trim()
                                .replace(/\s+/g, ' ')
                                .replace(/\)/g, ')\n')
                                .slice(box.text().length)
                                .trim()
                // console.log($td.length)
                



                if(div == 0){
                    // console.log("menu - " + "###")
                    menu["menu"] = ""
                }
                else{
                    console.log("menu - " + div)
                    menu["menu"] = div
                }
                
                // console.log("\n")
    
    
    
    
    
                cat[text].push(menu)
            })
        })


        // console.log("=======================================================")
    })

    // console.log(cat)
    // console.log("시작 날짜", date)
}



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




// searchMenu(formData[1])



const delay = (ms) => new Promise(res => setTimeout(res, ms));
// 딜레이 없이 하면 가끔 에러
async function searchMenuWithDelay() {
    try{
        for(data of formData){
            await searchMenu(data)
            await delay(500)
        }
    }
    catch(err){
        console.log("err: searchMenuWithDelay - ", err);
    }
}

searchMenuWithDelay()



console.log("db_set.js");

module.exports = router;