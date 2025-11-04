const express = require("express")
const router = express.Router();
const nodemailer = require('nodemailer');

const userModel = require("../models/userModel")

NAVER_SENDER = "yhn6543@naver.com"
NAVER_PASS = "YX85LY6TUHTM"

const transporter = nodemailer.createTransport({
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    secure: false,  // 587 포트는 false (465는 true)
    requireTLS: true,
    auth: {
        user: NAVER_SENDER,  // 네이버 이메일 주소
        pass: NAVER_PASS   // 생성한 애플리케이션 비밀번호
    }
});



// 이메일 인증 페이지 렌더
router.get('/', (req, res) => {
    if(req.session.user) res.render('verify-email');
    else res.render("login")
})





// 6자리 랜덤 인증 코드 생성
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}


// 인증 코드를 임시 저장할 객체 (실제로는 DB나 Redis 사용 권장)
const verificationCodes = {};

// 인증 코드 전송
router.post('/send-verification', async (req, res) => {
    console.log("이메일 인증 요청받음\n", req.body);
    const { email } = req.body;
    
    try {
        // 6자리 인증 코드 생성
        const verificationCode = generateVerificationCode();
        console.log("인증 코드 - ", verificationCode);
        // 인증 코드 저장 (5분 유효)
        verificationCodes[email] = {
            code: verificationCode,
            expiresAt: Date.now() + 5 * 60 * 1000  // 5분 후 만료
        };
        
        // 이메일 전송 옵션
        const mailOptions = {
            from: NAVER_SENDER,
            to: email,
            subject: '이메일 인증 코드',
            html: `
                <h2>이메일 인증</h2>
                <p>아래 인증 코드를 입력해주세요:</p>
                <h1 style="color: #4CAF50;">${verificationCode}</h1>
                <p>이 코드는 5분간 유효합니다.</p>
            `
        };
        
        // 이메일 전송
        await transporter.sendMail(mailOptions);
        

        res.render("verify-code", { email })


        // res.json({ 
        //     success: true, 
        //     message: '인증 코드가 전송되었습니다.' 
        // });
        
    } catch (error) {
        console.error('이메일 전송 실패:', error);
        res.status(500).json({ 
            success: false, 
            message: '이메일 전송에 실패했습니다.' 
        });
    }
});







// 인증 코드 확인
router.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    console.log("인증 코드 확인 요청\n", req.body);
    const stored = verificationCodes[email];
    
    // 인증 코드가 없는 경우
    if (!stored) {
        return res.status(400).json({ 
            success: false, 
            message: '인증 코드를 먼저 요청해주세요.' 
        });
    }
    
    // 만료 확인
    if (Date.now() > stored.expiresAt) {
        delete verificationCodes[email];
        return res.status(400).json({ 
            success: false, 
            message: '인증 코드가 만료되었습니다.' 
        });
    }
    
    // 코드 일치 확인
    if (stored.code !== code) {
        return res.status(400).json({ 
            success: false, 
            message: '인증 코드가 일치하지 않습니다.' 
        });
    }
    
    // 인증 성공
    userModel.dbUserVerifyEmail(req, res);  //db에 유저 인증 상태 변경
    delete verificationCodes[email];
    res.json({ 
        success: true, 
        message: '이메일 인증이 완료되었습니다.' 
    });
});





module.exports = router;