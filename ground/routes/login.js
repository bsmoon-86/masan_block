// express를 사용하기 위하여 express 모듈을 로드 
const express = require('express')
// route부분이기 때문에 express.Router()
const router = express.Router()

// 데이터베이스와 연동하기위한 라이브러리 로드 
// 해당하는 라이브러리 이름은 mysql2
const mysql = require('mysql2')

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
        if(!req.session.logined){
            res.render('index.ejs')
        }else{
            res.redirect('/contract')
        }
    })

    // localhost:3000/signin [post] api 생성
    router.post('/signin', function(req, res){
        const input_phone = req.body._phone
        const input_password = req.body._password
        console.log(input_phone, input_password)

        const sql = `
                    select 
                    * 
                    from 
                    user 
                    where 
                    phone = ? 
                    and 
                    password = ?
                    `
        const sql_data = [input_phone, input_password]
        console.log(sql)
        connection.query(
            sql,
            sql_data, 
            function(e, r){
                if(e){
                    console.log(e)
                }else{
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
                    res.redirect("/")
                }
            }
        )
    })

    // 회원 가입 api 생성
    router.get("/signup", function(req, res){
        // 회원 가입 화면을 응답
        res.render('signup.ejs')
    })

    router.post('/signup', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 
        const input_phone = req.body._phone
        const input_password = req.body._password
        const input_name = req.body._name
        const input_loc = req.body._loc
        console.log(input_phone, input_password, input_name, input_loc)
        const input_wallet = await token.create_wallet()
        console.log(input_wallet)
        // 해당하는 데이터들을 DB에 저장
        sql = `
                insert
                into 
                user(
                    phone, 
                    password, 
                    name,  
                    loc,
                    wallet
                )
                values 
                (?, ?, ?, ?, ?)
        `
        data = [input_phone, input_password, input_name, input_loc, input_wallet]
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