// express 로드 
const express = require('express')
// express()가 뜻하는 바? -> 
// express 라이브러리 module.exports = function(){}이기 때문에
// 해당하는 라이브러리 로드할때 함수로 형태로 사용해야 한다. 
const app = express()

// 뷰 파일들의 기본 경로 (app.js이 위치하는 곳에서 하위 폴더인 views를 기본경로로 설정)
app.set('views', __dirname+'/views')
// 뷰 엔진 지정
app.set('view engine', 'ejs')


// post 형태의 데이터를 json 형태로 변환 
app.use(express.urlencoded({extended:true}))

// 환경 변수를 사용하기 위해 설정 
require('dotenv').config()

// 로그인을 할때 해당하는 정보들을 임시파일에 저장
const session = require('express-session')
// app에 session 설정 
app.use(
    session(
        {
            secret : process.env.secret, 
            resave : false, 
            saveUninitialized : false, 
            cookie : {
                maxAge : 30000 //임시 파일의 수명 (1000당 1초)
            }
        }
    )
)

const moment = require('moment')
let date = moment()

// 주소 routing 처리 하여 api들을 나눠서 관리(유저 로그인, 설문에 대한 내용)
const user = require('./routes/user')()
app.use("/", user)

const survey = require('./routes/survey')()
app.use("/survey", survey)

// 서버 시작 
app.listen(3000, function(){
    console.log('Server Start')
    
    console.log(date.format("YYYY-MM-DD HH:mm:ss"))
})