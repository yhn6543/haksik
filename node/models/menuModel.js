// const { dbConnect } = require("../router/server")
// const db = dbConnect();
const { db } = require("../router/server")

console.log("===== menuModel =====");


const { app } = require("../router/server")

const BREAKFAST = ["천원의 아침밥", "조식", "아침"];
const LUNCH = ["점심", "중식", "주식", "국류", "국", "찬류", "후식", "더진국", "고정메뉴"];
const DINNER = ["저녁", "석식"];

async function dbMealSet(meal, restSeq, mi, text) {
    const newDate = new Date(meal.date)
    // console.log(meal, text)
    if(BREAKFAST.some(w => text.includes(w))){
        newDate.setHours(9)
        // console.log("=======아침")
    }
    else if(LUNCH.some(w => text.includes(w))){
        newDate.setHours(12)
        // console.log("=======점심")
    }
    else if(DINNER.some(w => text.includes(w))){
        newDate.setHours(17)
        // console.log("=======저녁")
    }
    
    // console.log(newDate)
    // console.log(meal, text, newDate);
    // console.log("\n");
    // console.log()
    const cnt = await db.query("SELECT COUNT(*) FROM haksik_db.meal WHERE date=$1 and menu=$2 and restSeq=$3", [newDate, meal.menu, restSeq]);
    // console.log(cnt.rows[0]["count"])
    if(cnt.rows[0]["count"] == 0){
        // console.log("중복없음")
        // console.log(meal, text, newDate);
        // console.log("\n\n");
        const res = await db.query("INSERT INTO haksik_db.meal (date, opt, menu, restSeq, mi, type) VALUES ($1, $2, $3, $4, $5, $6);", [newDate, meal.opt ?? "", meal.menu, restSeq, mi, text]);
    }
    else{
        // console.log("중복")
    }
    
    // console.log("등록 완료")
}



async function dbMenuSet(menu, restSeq, mi) {
    if(menu == "라면/김밥" || menu.includes("천원의 아침밥 사업 시행에 따라")) return;
    // "라면/김밥", "천원의 아침밥 시행 안함"이면 DB에 등록안함

    menu = menu.replace(/\(세트메뉴\)/g, "")
                .replace(/\(천원의 아침밥\)/g, "")
                .replace("(4,500원)", "").replace("(5,000원)", "")
                .replace("포기김치/", "").replace("깍두기/", "").replace("배추김치/", "")
                .replace(/\+/g, "\n")
                .trim()
                .split(/\s+/);
    // 쓸모없는 내용 필터링

    for(m of menu){
        try{
            const _ = await db.query("INSERT INTO haksik_db.menu (name, restSeq, mi) VALUES ($1, $2, $3);", [m, restSeq, mi]);
            // console.log(m, "삽입");
        }
        catch(err){
            // console.log("Error - ", err);
        }
    }
}


async function dbGetMeal(restSeq) {
    const mi = getMi(restSeq);
    const [ breakfast, lunch, dinner ] = [ [], [], [] ]
    
   try{
        let result = await db.query("SELECT type, opt, menu, date FROM haksik_db.meal WHERE mi=$1 AND restSeq=$2 ORDER BY type ASC, opt DESC, date ASC;", [mi, restSeq]);
        
        if(!result.rows[0]){ return "데이터 없음" }

        let meal = result.rows;
        meal = meal.map(m => {
            const newDate = new Date(m['date']);
            
            m['date'].setHours(m['date'].getHours()+9)
            m['date'] = m['date'].toISOString().replace("T", " ").slice(0, 19)

            if(newDate.getHours() == 9){ breakfast.push(m) }
            else if(newDate.getHours() == 12){ lunch.push(m) }
            else if(newDate.getHours() == 17){ dinner.push(m) }
        })

        return { breakfast, lunch, dinner };
    }
    catch(err){
        console.log("dbGetMeal Error - ", err)
        return "dbGetMeal Error - ", err;
    }
}



function getMi(restSeq){
    if(restSeq == "4" || restSeq == "5" || restSeq == "63") return "1341";
    else if(restSeq == "6" || restSeq == "8") return "1342";
    else if(restSeq == "7" || restSeq == "9") return "1343";
}




async function test(params) {
    // const [cnt, ] = await db.execute("SELECT count(id) FROM menu.user WHERE id=?;", ["321"])
    // console.log(cnt)
    // const [cnt, ] = await db.execute("SELECT * FROM menu.user;")
    // console.log(cnt)
    // console.log(new Date()).getTime();
}


module.exports = {
    dbMealSet,
    dbMenuSet,
    dbGetMeal,
    test
}