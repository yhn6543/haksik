const bcrypt = require('bcrypt');

const { dbConnect } = require("../router/server")

console.log("===== userModel =====");


const { app } = require("../router/server")
const db = dbConnect();
console.log("db연결 성공");


const PWKEY = 10;


async function dbUserJoin(req, res) {
    console.log("joinQueryData----------")
    console.log(req.body);
    console.log("-----------------------")


    const unique = await (async function () {
        // console.log(joinQueryData)
        try{
            const [cnt, _] = await db.execute("SELECT count(id) FROM menu.user WHERE id=?;", [req.body.id])
            // console.log("cnt = ", cnt[0]["count(id)"]);
            return cnt[0]["count(id)"];
        } catch(err){
            console.log("에러발생 - ", err)
            return 1;
        }
    })();

    // console.log("unique = ", unique)
    if(unique > 0){
        console.log("아이디 중복으로 return")
        return;
    }
    console.log("중복되지 않음")
    console.log("비밀번호 - ", bcrypt.hashSync(req.body.pw, PWKEY));

    try{
        const [rows, fields] = await db.execute("INSERT INTO `menu`.`user` (`id`, `pw`, `verify`, `date`) VALUES (?, ?, ?, NOW());", 
            [req.body.id, bcrypt.hashSync(req.body.pw, PWKEY), 0])
        console.log("유저 등록 성공")
        // console.log(rows)
    }
    catch(err){
        console.log("userModel - dbUserJoin Error");
        console.log(err)
    }
}



async function dbUserLogin(req, res) {
    console.log("로그인 시도 - ", req.body.id)
    try{
        const [pw, _] = await db.execute("SELECT pw FROM menu.user WHERE id=?;", [req.body.id])
        
        if(pw[0]["pw"] && bcrypt.compareSync(req.body.pw, pw[0]["pw"])){
            console.log("로그인 성공")
            req.session.user = req.body.id;
            return res.send("로그인 성공<br>"+req.body.id+"<br>접속 중..");
        } else{
            console.log("로그인 실패");
            return res.send("로그인 실패");
        }
    } catch(err){
        console.log("err: dbUserLogin - ", err);
        return res.send("로그인 실패 에러 발생");
    }
}



async function dbUserVerifyEmail(req, res) {
    console.log(req.session.user, "인증 성공 - userModel");
    
    try{
        const [rows, _] = await db.execute("UPDATE menu.user SET verify=1 WHERE id=?;", [req.session.user]);
    }
    catch(err){
        console.log("err: dbUserVerifyEmail - ", err);
        return res.send("로그인 실패 에러 발생");
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
    dbUserJoin,
    dbUserLogin,
    dbUserVerifyEmail,
    test
}