// express 모듈 로드 
const express = require('express')
// express()을 app 변수에 대입
const app = express()

// 뷰 파일(html, ejs, ...)들의 기본 경로 설정
// __dirname : 현재 파일의 위치
app.set('views', __dirname+'/views')
// view engine 설정
app.set('view engine', 'ejs')

// 통신 방식 get / post 
// post 방식으로 데이터가 오는 경우 데이터를 출력하기 위한 설정
// extended가 false : querystring 모듈을 사용 (express를 설치하면 자동 설치)
// true : qs모듈을 사용 (구버전 express에서는 qs을 별도로 설치)
// 최근의 express 설치시 qs도 같이 설치
app.use(express.urlencoded({extended:false}))

// api 생성
app.get("/", function(req, res){
    res.render('index')
})

// 비동기 통신을 하는 api 생성
app.get('/ajax', function(req, res){
    // get 형식으로 data 받아서 변수에 대입 
    const input_id = req.query._id
    console.log(input_id)


    // 유저가 보내온 id 값이 test 라는 문자열이면 '존재하는 아이디'
    // test가 아니라면 '존재하지 않는 아이디'
    if (input_id == 'test'){
        res.send(false)
    }else{
        res.send(true)
    }
})


app.listen(3000, function(){
    console.log('Server Start')
})