const bcrypt = require('bcrypt');

// const { dbConnect } = require("../router/server")
// const db = dbConnect();
const { db } = require("../router/server")

console.log("===== userModel =====");


const { app } = require("../router/server")


const PW_KEY = 10;


async function dbUserSignUp(req) {
    console.log("joinQueryData----------")
    console.log(req.body);
    console.log("-----------------------")


    const unique = await (async function () {
        try{
            const result = await db.query("SELECT count(id) FROM haksik_db.user WHERE id=$1;", [req.body.id])
            const cnt = result.rows[0]["count"]
            // console.log("cnt = ", cnt);
            return cnt;
        } catch(err){
            console.log("dbUserSignUp > unique Error - ", err)
            return "dbUserSignUp > unique Error - " + err
        }
    })();

    if(unique > 0){
        return "아이디 중복"
    }


    console.log("중복되지 않음")
    console.log("비밀번호 - ", bcrypt.hashSync(req.body.pw, PW_KEY));

    try{
        const result = await db.query("INSERT INTO haksik_db.user (id, pw, verify, date) VALUES ($1, $2, $3, NOW());", 
            [req.body.id, bcrypt.hashSync(req.body.pw, PW_KEY), 0])
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



async function dbUserSignIn(req) {
    console.log("로그인 시도 - ", req.body.id)

    try{
        const result = await db.query("SELECT pw, email FROM haksik_db.user WHERE id=$1;", [req.body.id])
        if(!result.rows[0]){
            return "없는 아이디"
        }

        const pw = result.rows[0]["pw"]
        const email = result.rows[0]["email"]
        // console.log(pw, email)
        

        if(pw && bcrypt.compareSync(req.body.pw, pw)){
            console.log("로그인 성공")
            req.session.user = req.body.id;
            req.session.email = email;
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
        const result = await db.query("UPDATE haksik_db.user SET email=$1, verify=1 WHERE id=$2;", [req.body.email, req.session.user]);
    }
    catch(err){
        console.log("dbUserVerifyEmail Error - ", err);
        return "dbUserVerifyEmail Error - ", err;
    }
}



async function dbUserEmailCheck(email) {
    try{
        const result = await db.query("SELECT COUNT(*) FROM haksik_db.user WHERE email=$1;", [email])
        const cnt = result.rows[0]['count'];
        return cnt
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