// express를 사용하기 위하여 express 모듈을 로드 
const express = require('express')
// route부분이기 때문에 express.Router()
const router = express.Router()

// 데이터베이스와 연동하기위한 라이브러리 로드 
// 해당하는 라이브러리 이름은 mysql2
const mysql = require('mysql2')
// 어느 곳에 있는 mysql을 연동할것인가 지정

// 아이피의 주소와 포트번호 그리고 유저명 비밀번호등 외부에 노출이되면 보안상의
// 문제가 발생하는 값들은 외부의 파일에 따로 지정하여 저장
// 이러한 문제는 해결하기위한 라이브러리 이용(dotenv)

// 일반 js파일의 정보를 가지고오는 경우
// js파일마다 info.js를 로드를 해야한다. 
const info = require("./info.js")

// dotenv를 사용하면 환경변수로 지정
// 환경 변수 : 지정을 하게 되면 해당하는 환경에서는 어떤 경로에서라도
//              사용이 가능하게 만드는 변수

const connection = mysql.createConnection(
    {
        host : process.env.host, 
        port : process.env.port, 
        user : process.env.user, 
        password : process.env.password, 
        database : process.env.database
    }
)

// token.js를 로드 
const token = require("../token/token.js")

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

        // DB에 user_info 테이블에서 id와 password가 모두 같은 경우
        // 로그인이 성공 하였습니다. 
        // 둘중에 하나라도 일치하지 않는다면 로그인이 실패하였습니다. 
        // DB에서 데이터 비교 : select문을 사용
        // connection.query('sql 쿼리문', [쿼리문안에 변수를 대입할 값], 콜백 함수())
        // 콜백함수는 위에서 해당하는 값들을 실행하고 나서 결과를 받는 함수
        const sql = "select * from user_info where id ='" + input_id 
        + "' and password ='"+input_pass+"'"
        const sql2 = `
                    select 
                    * 
                    from 
                    user_info 
                    where 
                    id = ? 
                    and 
                    password = ?
                    `
        const sql_data = [input_id, input_pass]
        console.log(sql)
        connection.query(
            sql2,
            sql_data, 
            function(e, r){
                if(e){
                    console.log(e)
                }else{
                    // 로그인의 성공 유무 []의 데이터가 존재하는가?
                    // 데이터가 존재하면 로그인이 성공
                    // 데이터가 존재하지 않으면 로그인이 실패
                    // [] 데이터에서 길이를 출력하면 원소의 개수 출력
                    let data
                    if (r.length != 0){
                        // 로그인이 성공하는 경우
                        data = '로그인이 성공하였습니다. '
                        // session에 로그인을 한 유저의 정보를 저장
                        req.session.logined = r[0]
                    }else{
                        // 로그인이 실패하는 경우
                        data = '로그인이 실패하였습니다.'
                    }
                    console.log(r)
                    res.render('main.ejs', {
                        res_data : data
                    })
                }
            }
        )

        // 서버가 유저에게 ejs 파일 외의 데이터를 같이 실어서 보내준다. 
        // let data
        // if (input_id == 'test' && input_pass == '1234'){
        //     data = '로그인이 성공하였습니다.'
        // }else{
        //     data = '로그인이 실패하였습니다 다시 로그인을 해주세요'
        // }
        // res.render('main.ejs', {
        //     res_data : data
        // })
    })

    // 회원 가입 api 생성
    router.get("/signup", function(req, res){
        // 회원 가입 화면을 응답
        res.render('signup.ejs')
    })

    router.post('/signup', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 
        const _id = req.body.input_id
        const _pass = req.body.input_pass
        const _name = req.body.input_name
        const _phone = req.body.input_phone
        console.log(_id, _pass, _name, _phone)
        const _wallet = await token.create_wallet()
        console.log(_wallet)
        // 해당하는 데이터들을 DB에 저장
        sql = `
                insert
                into 
                user_info(
                    id, 
                    password, 
                    name, 
                    phone, 
                    wallet
                )
                values 
                (?, ?, ?, ?, ?)
        `
        data = [_id, _pass, _name, _phone, _wallet]
        connection.query(
            sql, 
            data, 
            function(err, receipt){
                if(err){
                    console.log(err)
                    res.send('sql error')
                }else{
                    res.redirect('/')
                }
            }
        )
    })


    return router
}