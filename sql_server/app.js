const express = require('express')
const app = express()

// view 파일들의 기본 경로 설정
app.set('views', __dirname+'/views')
// view 파일들의 엔진 설정
app.set('view engine', 'ejs')

// post 방식으로 데이터가 들어올때 데이터를 json형태로 불러오기 위한 설정
app.use(express.urlencoded({extended:false}))

// dotenv을 사용
require('dotenv').config()

// mysql 서버 정보를 입력
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host : process.env.host, 
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.password, 
    database : process.env.database
})

// api 생성 
// localhost:3000/ 주소로 요청 시
app.get("/", function(req, res){
    res.render('index')
})

// 회원가입 api 생성
app.get('/signup', function(req, res){
    res.render('signup')
})

// 아이디를 중복체크 하는 비동기 통신 주소 생성
app.get('/check_id', function(req, res){
    // 유저가 보낸 데이터를 변수에 대입
    const _id = req.query._id
    console.log(_id)

    // 유저가 입력한 아이디값이 데이터베이스에 존재하는가?
    // 해당하는 값을 기준으로 user_info 테이블에서 데이터를 조회하면
    // 데이터가 존재 -> 사용할 수 없는 아이디
    // 데이터가 존재하지 않는다 -> 사용할 수 있는 아이디
    connection.query(
        `select 
        * 
        from 
        user_info 
        where 
        id = ?`, 
        [_id], 
        function(err, result){
            if(err){
                console.log('check_id select', err)
            }else{
                if(result.length != 0){     //데이터가 존재한다.
                    // 데이터가 존재한다는 의미는
                    // 사용 할 수 없는 아이디
                    res.send(false)
                }else{
                    res.send(true)
                }
            }
        }
    )

})



// 로그인 api 생성
app.post('/login', function(req, res){
    // 유저가 보낸 데이터를 변수에 대입
    const _id = req.body._id
    const _pass = req.body._pass
    // 이러한 데이터는 정확하게 들어왔는지 확인 하기 위해서 
    // console.log 사용
    console.log(_id, _pass)

    // 로그인이 된다?
    // 회원 정보가 들어있는 데이터베이스에서 유저가 입력한 id 값이 
    // 데이터베이스에 존재하는가?
    // 존재한다면 유저가 입력한 비밀번호의 값도 일치하는가?
    // sql 쿼리문을 이용하여 데이터를 확인
    connection.query(
        // DB에 있는 유저 정보를 로드하여 유저가 입력한 데이터와 비교
        `select 
        * 
        from 
        user_info 
        where 
        id = ?
        and 
        password = ?`
        ,[_id, _pass]
        ,function(err, result){
            if(err){
                console.log('login select error', err)
                res.send('login select error')
            }else{
                // result는 sql쿼리문이 실행되고 나서 결과값

                // result의 (길이가 0이 아닌 경우) 로그인이 성공
                if (result.length != 0 ){
                    res.send('로그인 성공')
                }else{
                    res.send('로그인 실패')
                }
                // 아니면 로그인 실패
            }
        }

    )
})


app.listen(3000, function(req, res){
    console.log('server start')
})


/*
    js가 mysql 에서 데이터를 로드하면
    데이터의 형태가 
        [
            {
                'name' : 'test', 
                'password' : '1234', 
                'name' : 'test', 
                'phone' : '01011112222'
            }, 
            {
                'name' : 'test2', 
                'password' : '1234', 
                'name' : 'test2', 
                'phone' : '01012345678'
            }
        ]
    이다. 
    select문을 이용하여 데이터를 로드할때 
    데이터가 존재하지 않는다면 [] 형태로 값을 받는다. 

*/