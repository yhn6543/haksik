const { dbConnect } = require("../router/server")

console.log("===== menuModel =====");


const { app } = require("../router/server")
const db = dbConnect();
console.log("db연결 성공");




async function dbMealSet(data) {


    const [cnt, _] = await db.execute("SELECT count(id) FROM menu.user WHERE id=?;", [])
}



async function dbMenuSet(data) {


    const [cnt, _] = await db.execute("SELECT count(id) FROM menu.user WHERE id=?;", [])
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
    test
}