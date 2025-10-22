const axios = require('axios');
const cheerio = require('cheerio');
const { CookieJar } = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
// Node.js 기본 모듈인 querystring을 사용하여 폼 데이터를 인코딩합니다.
const querystring = require('querystring'); 

// 1. 세션 관리를 위한 클라이언트 설정
const jar = new CookieJar();
const client = wrapper(axios.create({ 
    jar,
    withCredentials: true 
}));

// 경상대학교 식단 페이지 URL 및 관련 값
const BASE_URL = 'https://www.gnu.ac.kr';
// 폼이 포함된 초기 페이지 (GET 요청 대상)
const INITIAL_FORM_URL = BASE_URL + '/main/ad/fm/foodmenu/selectFoodMenuView.do?mi=1341'; 
// 폼 데이터가 전송될 URL (POST 요청 대상, 쿼리 스트링 제외)
const SUBMIT_ACTION_URL = BASE_URL + '/main/ad/fm/foodmenu/selectFoodMenuView.do'; 


async function getMenuAfterSubmit(targetDate, targetRestaurant) {
    
    try {
        // ----------------------------------------------------------------
        // 1단계: 초기 폼 HTML을 가져와서 세션 쿠키 획득 (GET)
        // ----------------------------------------------------------------
        console.log(`[1/3] 초기 폼 페이지 로드 중... (세션 쿠키 획득)`);
        const initialResponse = await client.get(INITIAL_FORM_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            }
        });
        
        // ----------------------------------------------------------------
        // 2단계: POST 요청에 사용할 데이터 구성 및 인코딩
        // ----------------------------------------------------------------
        
        // 실제 웹사이트 요청 헤더를 분석하여 구성된 최종 데이터
        const postData = {
            "mi": "1341",
            "sysId": "main", 
            "restSeq": targetRestaurant.toString(), // 식당 번호 (예: "5")
            "schDt": targetDate,                   // 조회 날짜 (예: "2025-10-08")
            "schSysId": "main"
        };
        
        // 'application/x-www-form-urlencoded' 형식에 맞게 문자열로 인코딩
        const formBody = querystring.stringify(postData);
        
        console.log(`[2/3] POST 데이터 준비 완료: ${formBody.slice(0, 50)}...`);


        // ----------------------------------------------------------------
        // 3단계: 폼 데이터 전송 및 응답 받기 (POST)
        // ----------------------------------------------------------------
        console.log(`[3/3] 폼 데이터 전송 중... (Submit 동작 모방)`);
        const submitResponse = await client.post(SUBMIT_ACTION_URL, formBody, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // 이전 페이지 URL을 Referer로 설정하여 유효성 검사 통과
                'Referer': INITIAL_FORM_URL, 
                'Origin': BASE_URL,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
            }
        });
        
        // ----------------------------------------------------------------
        // 4단계: 응답 처리 및 데이터 추출
        // ----------------------------------------------------------------
        
        const $result = cheerio.load(submitResponse.data);
        
        // 응답 HTML 내에서 식단 정보가 담긴 테이블 본문 추출 (tbody)
        const menuTableRows = $result('.tbl_list tbody tr'); 
        
        console.log("------------------------------------------");
        console.log(`[성공] 조회된 식단 행 수: ${menuTableRows.length}개`);
        
        // 이 부분에 menuTableRows를 순회하며 최종 데이터를 추출하는 로직을 추가하세요.
        
        // 임시로 응답 HTML의 일부를 출력하여 성공 여부 확인
        console.log("--- 응답 HTML 미리보기 (첫 500자) ---");
        const d = $result("#detailForm")
        console.log(d.text().trim());
        
        // console.log($result.html().slice(0, 500) + '...'); 
        
        return $result.html(); // 최종 HTML 반환
        
    } catch (error) {
        console.error("------------------------------------------");
        console.error("⚠️ 요청 처리 중 치명적인 오류 발생:");
        console.error("상태 코드:", error.response ? error.response.status : 'N/A');
        console.error("오류 메시지:", error.message);
        return null;
    }
}

// ----------------------------------------------------------------
// 함수 실행부
// ----------------------------------------------------------------

// 조회 원하는 날짜와 식당 번호를 설정하여 함수를 실행합니다.
(async () => {
    // 🎯 2025년 10월 8일, 5번 식당을 조회합니다.
    const resultHtml = await getMenuAfterSubmit("2025-10-08", "5");
    
    if (resultHtml) {
        console.log("------------------------------------------");
        console.log("✅ 식단 정보 페이지를 성공적으로 가져왔습니다.");
    } else {
        console.log("------------------------------------------");
        console.log("❌ 식단 정보 가져오기에 실패했습니다. 오류 메시지를 확인하세요.");
    }
})();