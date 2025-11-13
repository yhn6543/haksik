const { dbConnect } = require("../router/server")

console.log("===== menuModel =====");


const { app } = require("../router/server")
const db = dbConnect();

const BREAKFAST = ["천원의 아침밥", "조식", "아침"];
const LUNCH = ["점심", "중식", "주식", "국류", "국", "찬류", "후식", "더진국", "고정메뉴"];
const DINNER = ["저녁", "석식"];

async function dbMealSet(meal, restSeq, mi, text) {
    const newDate = new Date(meal.date)
    console.log(meal, text)
    if(BREAKFAST.some(w => text.includes(w))){
        newDate.setHours(9)
        console.log("=======아침")
    }
    else if(LUNCH.some(w => text.includes(w))){
        newDate.setHours(12)
        console.log("=======점심")
    }
    else if(DINNER.some(w => text.includes(w))){
        newDate.setHours(17)
        console.log("=======저녁")
    }
    
    // console.log(newDate)
    // console.log(meal, text, newDate);
    console.log("\n");
    // console.log()
    const [cnt, _] = await db.execute("SELECT COUNT(*) FROM menu.meal WHERE date=? and menu=? and restSeq=?", [newDate, meal.menu, restSeq]);
    // console.log(cnt[0]['COUNT(*)'])
    if(cnt[0]['COUNT(*)'] == 0){
        // console.log("중복없음")
        console.log(meal, text, newDate);
        // console.log("\n\n");
        const [] = await db.execute("INSERT INTO menu.meal (date, opt, menu, restSeq, mi, type) VALUES (?, ?, ?, ?, ?, ?);", [newDate, meal.opt ?? "", meal.menu, restSeq, mi, text]);
    }
    else{
        // console.log("중복")
    }
    
    // console.log("등록 완료")
}



async function dbMenuSet(menu, restSeq, mi) {
    if(menu == "라면/김밥" || menu.includes("천원의 아침밥 사업 시행에 따라")) return;
    
    menu = menu.replace(/\(세트메뉴\)/g, "")
                .replace(/\(천원의 아침밥\)/g, "")
                .replace("(4,500원)", "").replace("(5,000원)", "")
                // .replace(/(\r\n|\n|\r)/gm, " ")
                .replace("포기김치/", "").replace("깍두기/", "").replace("배추김치/", "")
                .replace(/\+/g, "\n")
                .trim()
                .split(/\s+/);

    // console.log("------------------\n");
    // console.log(menu)
    // console.log("------------------\n")


    for(m of menu){
        try{
            const [] = await db.execute("INSERT INTO menu.menu (name, restSeq, mi) VALUES (?, ?, ?);", [m, restSeq, mi]);
            // console.log(m, "삽입");
        }
        catch(err){
            // console.log("Error - ", err);
        }
    }
}


async function dbGetMeal(mi, restSeq) {
    const breakfast = []
    const lunch = []
    const dinner = []
   try{
        let  [meal, _] = await db.execute("SELECT type, opt, menu, date FROM menu.meal WHERE mi=? and restSeq=? ORDER BY type ASC, opt DESC, date ASC;", [mi, restSeq]);
        // console.log(meal)
        meal = meal.map(m => {
            const newDate = new Date(m['date']);
            newDate.setHours(newDate.getHours()+9)
            
            if(m['date'].getHours() == 9){
                m['date'].setHours(m['date'].getHours()+9)
                m['date'] = m['date'].toISOString().replace("T", " ").slice(0, 19)
                breakfast.push(m)
                // console.log(m['date']);
            }
            else if(m['date'].getHours() == 12){
                m['date'].setHours(m['date'].getHours()+9)
                m['date'] = m['date'].toISOString().replace("T", " ").slice(0, 19)
                lunch.push(m)
            }
            else if(m['date'].getHours() == 17){
                m['date'].setHours(m['date'].getHours()+9)
                m['date'] = m['date'].toISOString().replace("T", " ").slice(0, 19)
                dinner.push(m)
            }
            else{
                console.log(m)
            }
            
        })
        // console.log(meal)
        // console.log("\n\n\n")
        // return meal;
        return { breakfast, lunch, dinner };
    }
    catch(err){
        console.log("dbGetMeal Error - ", err)
        return "dbGetMeal Error - ", err;
    }
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