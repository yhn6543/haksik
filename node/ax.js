const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const querystring = require('querystring'); 

const app = express();

app.set("view engine", "ejs");
app.set("views", "./views");


const port = "80"


const jar = new CookieJar();
const client = wrapper(axios.create({ 
	jar,
	withCredentials: true 
}));



app.listen(port, ()=>{
    console.log("서버 시작");
})


const url = '/' + "sysId" + '/ad/fm/foodmenu/selectFoodMenuView.do?mi=' + "mi";

app.get("/", (req, res)=>{
    res.render("index")
})

class Meal{
	constructor(dayOfWeek){
		this.dayOfWeek = dayOfWeek;
	}
}

const day = ["월", "화", "수", "목", "금", "토", "일"]
const BASE_URL = 'https://www.gnu.ac.kr';
const INITIAL_FORM_URL = "https://www.gnu.ac.kr/main/ad/fm/foodmenu/selectFoodMenuView.do?mi=1341"
const SUBMIT_ACTION_URL = BASE_URL + '/main/ad/fm/foodmenu/selectFoodMenuView.do'; 


app.get("/menu/main", (req, res)=>{
    const mi = "1341"
	const schSysId = "main"

    res.send("가좌")
})

app.get("/menu/cdorm", (req, res)=>{
	const mi = "1342"
	const schSysId = "cdorm"

    res.send("칠암")
})

app.get("/menu/tdorm", (req, res)=>{
    const mi = "1343"
	const schSysId = "tdorm"

    res.send("통영")
})






GSearchMenu()

async function GSearchMenu(){
	const initialResponse = await client.get(INITIAL_FORM_URL, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
			'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
			'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
		}
	});


	const targetRestaurant = "5"
	const targetDate = "2025-10-08"
	const targetSysId = "main"
	const targetMi = "1341"

	const postData = {
            "mi": targetMi,
            "sysId": "main", 
            "restSeq": targetRestaurant.toString(), // 식당 번호 (예: "5")
            "schDt": targetDate,                   // 조회 날짜 (예: "2025-10-08")
            "schSysId": targetSysId
	};
	

	const formBody = querystring.stringify(postData);



	const submitResponse = await client.post(SUBMIT_ACTION_URL, formBody, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			// 이전 페이지 URL을 Referer로 설정하여 유효성 검사 통과
			'Referer': INITIAL_FORM_URL, 
			'Origin': BASE_URL,
			'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
		}
	});


	const $ = cheerio.load(submitResponse.data);
	const menuTableRows = $('.tbl_list tbody tr'); 


	const tr = $("#detailForm tbody tr")
	console.log(tr.length)
	console.log(tr.text().trim().replace(/\s+/g, ' '));
	console.log("\n" + "--------------------------------------------------------" + "\n")
	
	const cat = new Array()

	tr.each((index, element) => {
		const $tds = $(element).find("td");
		// console.log($tds.length)
		// console.log($tds.text().replace(/\s+/g, ' ') + "\n")

		// const $th = $("tbody th");
		// console.log($th.text().replace(/\s+/g, ' ') + "\n")

		const $ths = $(element).find("th");
		cat.push(($ths.html())
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<[^>]*>?/gm, '') 
                        .trim() + "\n")

		
						
		console.log(($ths.html())
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<[^>]*>?/gm, '') 
                        .trim() + "\n")

		$tds.each((index, element) => {
			const $td = $(element)
			const div = $td.text().trim().replace(/\s+/g, ' ')
			// console.log($td.length)
			if(div == 0)
				console.log("###")
			else
				console.log($td.text().replace(/\s+/g, ' '))
		})
		console.log("============================")
	})
}



/*
tbody.each((index, element) => {
			const $tbodyTrs = $(element)
			const $tbodyTds = $tbodyTrs.find("td");

			
			$tbodyTds.each((index, element) => {
				const $tbodyTd = $(element)

				if($tbodyTd.text().replace(/\s+/g, '') == ''){
					// console.log("###")
					// menuOfWeek[index][type] = "없음"
				}
				else{
					console.log($tbodyTd.text().trim())

					const cleanMenuArray = ($tbodyTd.html())
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<[^>]*>?/gm, '') 
                        .trim()
                        .split('\n')
                        .map(item => item.trim())
                        .filter(item => item.length > 0);

					// console.log(cleanMenuArray)

					// menuOfWeek[index][type] = cleanMenuArray
				}
					
				
				
				
			})
			// console.log("")
		})






function GSSearchMenu(){	// G-가좌, S-교직원
	axios({
    	method: "POST",
        url: "https://www.gnu.ac.kr/" + url,
		data: {
			frm: "detailForm",
			// schDt: "2025-10-04",
			restSeq: "5",
			schSysId: "main"
		}
    }).then((data)=>{
        const $ = cheerio.load(data.data);
		const tbody = $("tbody tr");
		
		const menuOfWeek = Array.from({ length: 7 }, (_, index) => {
			console.log(index)
			return new Meal(index);
		})

		tbody.each((index, element) => {
			const $tbodyTrs = $(element)
			const $tbodyTds = $tbodyTrs.find("td");
			

			if(index == 0) type = "주식"
			else if (index == 1) type = "국류"
			else if (index == 2) type = "찬류"
			else if (index == 3) type = "후식"

			
			$tbodyTds.each((index, element) => {
				const $tbodyTd = $(element)

				if($tbodyTd.text().replace(/\s+/g, '') == ''){
					// console.log("###")
					menuOfWeek[index][type] = "없음"
				}
				else{
					console.log($tbodyTd.text().trim())

					const cleanMenuArray = ($tbodyTd.html())
                        .replace(/<br\s*\/?>/gi, '\n')
                        .replace(/<[^>]*>?/gm, '') 
                        .trim()
                        .split('\n')
                        .map(item => item.trim())
                        .filter(item => item.length > 0);

					// console.log(cleanMenuArray)

					menuOfWeek[index][type] = cleanMenuArray
				}
					
				
				
				
			})
			// console.log("")
		})
		console.log(menuOfWeek)
    })
}





*/




cron.schedule("* * * * * 1", () => {	// 매주 월요일 00시 00분 00초에 실행
	console.log("매크로 실행---------------------")
	const formData = formDataSet();
	GSSearchMenu(formData);
	// GCSearchMenu();
	console.log("--------------------------------")
}, {
	schedule: true,
	timezone: "Asia/Seoul"
})


function formDataSet(){
	return axios({
    	method: "POST",
        url: "https://www.gnu.ac.kr/" + url,
		data: {
			frm: "detailForm",
			// schDt: "2025-10-04",
			restSeq: "5",
			schSysId: "main"
		}
    }).then((res) => {
		const $ = cheerio.load(res.data);
		const detailForm = $("#detailForm").html()
		const mi = "1341";
		const sysId = "main";
		const restSeq = "5"
		const today = new Date();
		const schDt = today.getFullYear() + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2);
		const schSysId = "main";

		// console.log(detailForm.html().slice(0,500))
		
		
		return {detailForm, mi, sysId, restSeq, schDt, schSysId}
	})
}


/*
const frm = "detailForm"
const schDt = ""
const restSeq = "5"

fn_selectView(frm, schDt, restSeq)


function fn_selectView(frm, schDt, restSeq){
	var mi = document.getElementById('mi').value;
	var sysId = document.getElementById('sysId').value;
	var url = '/' + sysId + '/ad/fm/foodmenu/selectFoodMenuView.do?mi=' + mi;
	if(schDt != null && schDt != ''){
		frm.schDt.value = schDt;
	}
	if(restSeq != null && restSeq != ''){
		frm.restSeq.value = restSeq;
	}
	frm.action = url;
	frm.submit();
}

*/

/*

4	교직원
5	중앙
63	교육문화


function fn_selectView(frm, schDt, restSeq){
	var mi = document.getElementById('mi').value;
	var sysId = document.getElementById('sysId').value;
	var url = '/' + sysId + '/ad/fm/foodmenu/selectFoodMenuView.do?mi=' + mi;
	if(schDt != null && schDt != ''){
		frm.schDt.value = schDt;
	}
	if(restSeq != null && restSeq != ''){
		frm.restSeq.value = restSeq;
	}
	frm.action = url;
	frm.submit();
}




*/


// axios({
//     method: "POST",
//     url: "https://www.gnu.ac.kr/" + url
// }).then((res)=>{
//     const $ = cheerio.load(res.data);
//     // console.log($)
//     const menuTable = $(".BD_table.scroll_gr.main");
//     // console.log(menuTable)
    
//     if(menuTable.length > 0){
//         console.log("성공")
//     }
    
//     // const data = menuTable.text().replace(/\s+/g, ' ');
//     // console.log(data);

//     // console.log(menuTable.text())

// })




// axios({
//     method: "GET",
//     url: "https://n.news.naver.com/article/658/0000121790?cds=news_media_pc&type=editn"
// }).then((res)=>{
//     const $ = cheerio.load(res.data);
//     // console.log(res.data)
    
//     const t = $(".media_end_summary")
//     console.log(t.text());
    
//     // console.log(menuTable);
// })



/*
	//안내정보 등록페이지
	function fn_insertInfoView(frm){
		var mi = document.getElementById('mi').value;
		var sysId = document.getElementById('sysId').value;
		var url = '/' + sysId + '/ad/fm/foodmenu/insertFoodMenuInfoView.do?mi=' + mi;
		if(validationFrm(frm)){
			frm.action = url;
			frm.submit();
		}
	}

	//식단 등록페이지
	function fn_insertPlanView(frm){
		var mi = document.getElementById('mi').value;
		var sysId = document.getElementById('sysId').value;
		var url = '/' + sysId + '/ad/fm/foodmenu/insertFoodMenuPlanView.do?mi=' + mi;
		if(validationFrm(frm)){
			frm.action = url;
			frm.submit();
		}
	}

	//식단구분 등록페이지
	function fn_insertTypeView(frm){
		var mi = document.getElementById('mi').value;
		var sysId = document.getElementById('sysId').value;
		var url = '/' + sysId + '/ad/fm/foodmenu/insertFoodMenuTypeView.do?mi=' + mi;
		if(validationFrm(frm)){
			frm.action = url;
			frm.submit();
		}
	}

	//폼 유효성 체크
	function validationFrm(frm){
		if(frm.restSeq.value == null || frm.restSeq.value == ''){
			alert('식당정보가 없습니다.\r\n식당정보 등록 후 이용해 주세요.');
			return false;
		}
		return true;
	}
	
	//주간식단 조회
	function fn_selectView(frm, schDt, restSeq){
		var mi = document.getElementById('mi').value;
		var sysId = document.getElementById('sysId').value;
		var url = '/' + sysId + '/ad/fm/foodmenu/selectFoodMenuView.do?mi=' + mi;
		if(schDt != null && schDt != ''){
			frm.schDt.value = schDt;
		}
		if(restSeq != null && restSeq != ''){
			frm.restSeq.value = restSeq;
		}
		frm.action = url;
		frm.submit();
	}

	//현재 시스템 화면에서 타 시슽메 화면 데이터를 조회
	function fn_selectSchSysView(frm, schSysId){
		var mi = document.getElementById('mi').value;
		var sysId = document.getElementById('sysId').value;
		var url = '/' + sysId + '/ad/fm/foodmenu/selectFoodMenuView.do?mi=' + mi;
		if(schSysId != null && schSysId != ''){
			frm.schSysId.value = schSysId;
		}
		frm.restSeq.value = '';
		frm.schDt.value = '';
		frm.action = url;
		frm.submit();
	}

	//원산지 레이어팝업 열기/닫기
	function fn_layer_pop_trigger(el){
		var elDisVal = el.style.display;
		if(elDisVal == 'block'){
			el.style.display = 'none';
		}else{
			el.style.display = 'block';
		}
	}

	jQuery('.dtpic1').datepicker({
		dateFormat				: 'yy-mm-dd'
		, closeText				: '닫기'
		, prevText				: '이전 달'
		, nextText				: '다음 달'
		, currentText			: '오늘'
		, yearRange				: 'c-100:c+10'
		, monthNames			: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
		, monthNamesShort		: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
		, dayNames				: ['일','월','화','수','목','금','토']
		, dayNamesShort			: ['일','월','화','수','목','금','토']
		, dayNamesMin			: ['일','월','화','수','목','금','토']
		, weekHeader			: 'Wk'
		, firstDay				: 0
		, isRTL					: false
		, buttonImageOnly		: true
		, buttonImage			: '/images/btn_calendar.png'
		, showOn				: 'both'
		, showMonthAfterYear	: true
		, showButtonPanel		: true
		, changeMonth			: true
		, changeYear			: true
		, onSelect : function(dateText, dateObj ){
			var currDate = $(this).datepicker('getDate');
			var nextDay = new Date();
			var schDate = this.value;
			if(currDate.getDay() == 0){
				nextDay.setDate(currDate.getDate() + 1);
				schDate = $.datepicker.formatDate('yy-mm-dd', nextDay) + '';
			}
			fn_selectView(document.getElementById('detailForm'), schDate, '');
		}
	});
	
	$(document).ready(function() {
		$(".ui-datepicker-trigger").attr({"alt":"", "title":"날짜선택"});
	});
*/