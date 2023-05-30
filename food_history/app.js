// express 로드 
const express = require('express')
const app = express()

// dotenv 설정
require('dotenv').config()

// 뷰 파일의 기본 위치와 엔진을 설정
app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

// post 형식으로 데이터가 들어올때 json의 형태로 변환
app.use(express.urlencoded({extended:false}))

// express-session 설정
const session = require('express-session')
app.use(
    session(
        {
            secret : process.env.secret_key , 
            resave : false , 
            saveUnintialized : false , 
            cookie: {
                maxAge : 300000
            }
        }
    )
)

// api들을 생성
// localhost:3000/ 요청시 
app.get('/', function(req, res){
    // 해당하는 주소로 요청이 들어온 경우 
    // req.session 안에 로그인의 정보가 존재하지 않는다면 
    // 로그인 화면을 보여주고 
    // 존재한다면 main으로 이동

    // 세션에 로그인 정보가 존재하지 않는다면
    if(!req.session.login){
        res.render('login')
    }else {
        res.redirect("/main")
    }
})

app.get("/main", function(req, res){
    // session 존재 유무에 따른 조건식 생성
    if(!req.session.login){
        res.redirect('/')
    }else{
        res.render('main')
    }
})

// 로그인에 관련된 주소 값들은 다른 파일에서 로드해서 사용
// routes 폴더 안에 있는 js파일을 로드 
const user = require('./routes/user')()
// 특정 주소로 요청이 들어왔을때는 해당하는 js 파일을 사용
app.use("/user", user)

const food = require("./routes/food")()
app.use("/food", food)


app.listen(3000, function(){
    console.log('server start')
})
