const bcrypt = require('bcrypt');

const { dbConnect } = require("../router/server")

console.log("===== userModel =====");


const { app } = require("../router/server")
const db = dbConnect();


const PWKEY = 10;


async function dbUserSignUp(req, res) {
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
            console.log("dbUserSignUp Error - ", err)
            return "dbUserSignUp Error - " + err
        }
    })();

    if(unique > 0){
        return "아이디 중복"
    }


    console.log("중복되지 않음")
    console.log("비밀번호 - ", bcrypt.hashSync(req.body.pw, PWKEY));

    try{
        const [rows, fields] = await db.execute("INSERT INTO `menu`.`user` (`id`, `pw`, `verify`, `date`) VALUES (?, ?, ?, NOW());", 
            [req.body.id, bcrypt.hashSync(req.body.pw, PWKEY), 0])
        console.log("유저 등록 성공")
        console.log("로그인 페이지로")
        return "회원가입 성공 - " + req.body.id
        // console.log(rows)
    }
    catch(err){
        console.log("dbUserSignUp Error - ", err);
        console.log(err)
        return "dbUserSignUp Error - " + err;
    }
}



async function dbUserSignIn(req, res) {
    console.log("로그인 시도 - ", req.body.id)
    try{
        const [pw, _] = await db.execute("SELECT pw, email FROM menu.user WHERE id=?;", [req.body.id])
        
        if(pw[0]["pw"] && bcrypt.compareSync(req.body.pw, pw[0]["pw"])){
            console.log("로그인 성공")
            req.session.user = req.body.id;
            req.session.email = pw[0]["email"];
            return "로그인 성공<br>"+req.body.id+"<br>접속 중..";
        } else{
            console.log("로그인 실패");
            return "로그인 실패";
        }
    } catch(err){
        console.log("dbUserLogin Error - ", err);
        return "dbUserSignIn Error - " + err;
    }
}



async function dbUserVerifyEmail(req, res) {
    console.log(req.session.user, "인증 성공 - userModel");
    
    try{
        const [rows, _] = await db.execute("UPDATE menu.user SET email=?, verify=1 WHERE id=?;", [req.body.email, req.session.user]);
    }
    catch(err){
        console.log("dbUserVerifyEmail Error - ", err);
        return "dbUserVerifyEmail Error - ", err;
    }
}



async function dbUserEmailCheck(email) {
    try{
        const [cnt, _] = await db.execute("SELECT COUNT(*) FROM user WHERE email=?;", [email])
        const res = cnt[0]['COUNT(*)'];
        return res
    }
    catch(err){
        console.log("dbUserEmailCheck Error - ", err);
        return;
    }
}












async function test(req, res) {

    // return res.send("DASDAS")

    // const [cnt, ] = await db.execute("SELECT count(id) FROM menu.user WHERE id=?;", ["321"])
    // console.log(cnt)
    // const [cnt, ] = await db.execute("SELECT * FROM menu.user;")
    // console.log(cnt)
    // console.log(new Date()).getTime();
}


module.exports = {
    dbUserSignUp,
    dbUserSignIn,
    dbUserVerifyEmail,
    dbUserEmailCheck,
    test
}