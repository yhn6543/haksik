const { dbConnect } = require("../router/server")

console.log("===== menuModel =====");


const { app } = require("../router/server")
const db = dbConnect();
// console.log("db연결 성공");




async function dbMealSet(meal, restSeq, mi, text) {
    // console.log(meal);
    // console.log("\n\n");
    
    const [cnt, _] = await db.execute("SELECT COUNT(*) FROM menu.meal WHERE date=? and menu=? and restSeq=?", [meal.date, meal.menu, restSeq]);
    // console.log(cnt[0]['COUNT(*)'])
    if(cnt[0]['COUNT(*)'] == 0){
        // console.log("중복없음")
        const [] = await db.execute("INSERT INTO menu.meal (date, opt, menu, restSeq, mi, type) VALUES (?, ?, ?, ?, ?, ?);", [meal.date, meal.opt ?? "", meal.menu, restSeq, mi, text]);
    }
    else{
        // console.log("중복")
    }
    
    // console.log("등록 완료")
}



async function dbMenuSet(menu, restSeq, mi) {
    const TEXT = "천원의 아침밥 사업 시행에"
    if(menu == "라면/김밥" || menu.includes(TEXT)) return;

    menu = menu.replace(/\(세트메뉴\)/g, "")
                .replace(/\(천원의 아침밥\)/g, "")
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
            console.log(m, "삽입");
        }
        catch(err){
            // console.log("Error - ", err);
        }
    }
}






async function dbGetMeal(mi) {
    try{
        let  [meal, _] = await db.execute("SELECT type, opt, menu, mi, restSeq, date FROM menu.meal WHERE mi=?;", [mi]);
        meal = meal.map(m => ({
            ...m,
            date: m['date'].toISOString().slice(0, 10)
        }))
        return meal;
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