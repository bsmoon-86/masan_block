// express를 사용하기 위하여 express 모듈을 로드 
const express = require('express')
// route부분이기 때문에 express.Router()
const router = express.Router()

// app.js에서 localhost:3000/ 일때 해당 파일을 사용
// login.js는 기본 주소값이 localhost:3000/

module.exports = function(){
    // api 생성
    // api를 생성한다. 
    // api : 유저가 서버에게 요청할 수 있는 목록

    // localhost:3000/ [get] api 생성
    router.get('/', function(req, res){
        // req라는 매개변수는 request약자로 유저가 서버에게 요청하는 부분
        // res라는 매개변수는 response의 약자로 서버가 유저에게 응답하는 부분
        res.render('index.ejs')
    })

    // localhost:3000/signin [get] api 생성
    router.get('/signin', function(req, res){
        // 유저가 입력한 데이터를 js에서 변수에 대입해서 데이터를 가공하여 응답
        // get 방식으로 유저가 서버에게 데이터를 보내는 형태는 
        // 주소 뒤에 ?로 데이터의 시작을 알리고 key = value 형태로 데이터를 보낸다
        // ex) localhost:3000/signin?key=value&key2=value2
        // 주소에 있는 데이터를 서버에서 로드를 하려면?
        // request 안에 'query'라는 키 안에 데이터가 존재
        // request는 json의 형태로 구성 { 'query' : {'sample1' : 'test', 'sample2' : '1234'}  }
        console.log(req.query)
        const input_id = req.query.sample1
        const input_pass = req.query.sample2
        console.log(input_id, input_pass)
        res.send('signin')
    })

    // localhost:3000/signin [post] api 생성
    router.post('/signin', function(req, res){
        // post의 형태는 데이터를 주소에 실어서 보내는것이 아니라
        // 데이터를 숨겨서 보내줌으로 보안성이 뛰어나다. 
        // request 안에 body라는 키 안에 데이터를 실어서 보내준다. 
        const input_id = req.body.sample1
        const input_pass = req.body.sample2
        console.log(input_id, input_pass)
        // 서버가 유저에게 ejs 파일 외의 데이터를 같이 실어서 보내준다. 
        let data
        if (input_id == 'test' && input_pass == '1234'){
            data = '로그인이 성공하였습니다.'
        }else{
            data = '로그인이 실패하였습니다 다시 로그인을 해주세요'
        }
        res.render('main.ejs', {
            res_data : data
        })
    })


    return router
}