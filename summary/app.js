// express 로드 
const express = require('express')
// app 변수 생성
const app = express()
// port 변수 생성
const port = 3000

// view 파일들의 기본 경로 설정
// __dirname : 현재 파일의 경로
app.set('views', __dirname+"/views")
// view engine 설정 'ejs'
app.set('view engine', 'ejs')

// 외부의 js, css, img 등의 파일들의 기본 경로 설정
app.use(express.static('public'))

// 데이터를 post의 방식으로 받을때 json형태로 변환
app.use(express.urlencoded({extended:false}))

// 환경변수 설정 (dotenv)
// 환경변수 : 해당하는 프로젝트에서 어디서든 사용할 수 있는 변수를 뜻한다.
// 환경변수 파일은 프로젝트를 공유하는 경우에 공유에서 제외하게 되면 
// 민감한 정보들을 공유에서 제외시킬수 있다. 
require('dotenv').config()

// 로그인 같은 경우 로그인의 대한 정보를 저장하기 위해
// express-session 모듈 사용
// 임시파일을 생성하여 수명을 주어 일정 시간이 지나면 파일의 정보를 삭제
// 임시파일은 유저가 가지고 있다. 
const session = require('express-session')
app.use(
    session(
        {
            secret : process.env.secret, 
            resave : false, 
            saveUninitialized : false, 
            cookie : {
                maxAge : 300000 //임시 파일의 수명을 지정 (1000당 1초)
            }
        }
    )
)

// routing
// 특정한 주소로 요청이 들어왔을때 routes 폴더 안에 js 파일로 이동한다.
// api들을 나눠서 관리 
// 기능별로 js 파일을 나눠서 관리

// 파일 로드 
// () : module.exports가 function의 형태
const user = require('./routes/user.js')()
// 특정한 주소로 요청시 해당 파일을 로드
app.use('/', user)


app.listen(port, function(){
    console.log('Server Start')
})