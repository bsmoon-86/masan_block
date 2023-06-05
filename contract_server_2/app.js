// 해당하는 폴더에서 설치된 express 라이브러리 로드 
const express = require('express')
// express 안에 있는 express() 호출해서 app이라는 변수에 대입
const app = express()
// port 번호 지정
const port = 3000

// view 파일들을 저장해두는 기본 경로 지정
// __dirname : app.js 현재 경로
app.set('views', __dirname+'/views')
// 보여주는 html언어로 구성된 파일을 ejs 라는 엔진을 사용하겠다. 
app.set("view engine", 'ejs')

// post 방식으로 유저가 데이터를 보낼때 json의 형태로 데이터를 받기위한 설정
app.use(express.urlencoded({extended:false}))


// route 지정 
const login = require("./routes/login.js")()
// localhost:3000/ 요청시 login.js를 사용하겠다.
app.use("/", login)


app.listen(port, function(){
    console.log(port, "server start")
})