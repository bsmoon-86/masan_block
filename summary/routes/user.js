// express 로드 
const express = require('express')
// express안에 있는 Router라는 클래스 생성
const router = express.Router()

// 현재의 시간을 알려주는 모듈 로드 
const moment = require('moment')

// mysql 과의 연동을 위해 mysql2 로드 
const mysql = require('mysql2')

// mysql server와 연동 (기본 정보 지정)
const connection = mysql.createConnection(
    {
        // 해당하는 변수들은 환경변수로 설정되어있기 때문에 js 파일은 어디서든 환경변수를 사용이 가능
        host: process.env.host, 
        port: process.env.port, 
        user: process.env.user, 
        password: process.env.password, 
        database: process.env.database 
    }
)

module.exports = ()=>{

    // 해당하는 파일에서 기본 url : localhost:3000/


    // router에 api 생성
    // localhost:3000/ 요청시
    router.get('/', (req, res)=>{
        // req 변수 : 유저가 서버에게 보내는 메시지
        // res 변수 : 서버가 유저에게 보내는 메시지
        // 로그인 페이지를 보여준다.
        // render안에 파일명에 .ejs를 생략 가능

        // session안에 logined 라는 데이터가 존재하면 /index로 이동
        // 데이터가 존재하지 않으면 login을 보여준다.
        if(!req.session.logined){
            res.render('login.ejs')
        }else{
            res.redirect('/index')
        }
    })

    // localhost:3000/signin [post] api 생성
    router.post('/signin', (req, res)=>{
        // post 형태로 데이터가 보내졌다.
        // post 형태는 body 부분에 데이터가 존재
        const input_phone = req.body._phone
        const input_pass = req.body._pass
        // console.log를 사용하는 이유 : 유저가 보낸 데이터를 서버가 변수에 정확히 담았는가 체크
        // console.log(input_id, input_pass)

        // // if문을 이용하여 로그인 기능 구현
        // if((input_id == 'test') & (input_pass == '1234')){
        //     res.send('로그인 성공')
        // }else{
        //     res.send('로그인 실패')
        // }

        // 로그인을 mysql를 이용하여 구현
        const sql = `
            select 
            * 
            from 
            user2 
            where
            phone = ? 
            and 
            password = ?
        `
        const values = [input_phone, input_pass]
        connection.query(
            sql, 
            values, 
            (err, result)=>{
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log(result)
                    // 로그인이 성공한다는 조건 : 해당하는 조건으로 데이터를 검색했을때 데이터가 존재
                    if(result.length != 0){
                        // 로그인 성공시 session에 유저의 정보를 담아준다. 
                        req.session.logined = result[0]
                    }
                    // 로그인 페이지로 이동
                    res.redirect('/')
                }
            }
        )

    })

    // localhost:3000/signup [get] api 생성
    router.get('/signup', (req, res)=>{
        res.render('signup.ejs')
    })

    // localhost:3000/signup [post] api 생성
    router.post('/signup2', (req, res)=>{
        // 유저가 보낸 데이터를 변수에 대입 & 확인
        const input_phone = req.body._phone
        const input_pass = req.body._pass
        const input_name = req.body._name
        const date = moment()
        const input_dt = date.format("YYYY-MM-DD")
        console.log(input_phone, input_pass, input_name, input_dt)

        const sql = `
            insert 
            into 
            user2 
            values 
            (?, ?, ?, ?)
        `
        const values = [input_phone, input_pass, input_name, input_dt]

        connection.query(
            sql, 
            values, 
            (err, result)=>{
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log(result)
                    // 회원 가입이 성공하면 로그인 페이지로 돌아간다. 
                    res.redirect("/")
                }
            }
        )
        
    })

    // localhost:3000/index [get] api 생성
    router.get("/index", (req, res)=>{
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // index.ejs를 보여주면서 서버에서 데이터로 같이 보내준다. 
            res.render('index.ejs', {
                login_data : req.session.logined
            })
        }
    })

    // localhost:3000/del [get] api 생성
    router.get('/del', (req, res)=>{
        if(!req.session.logined){
            res.redirect("/")
        }else{
            res.render('del.ejs', {
                login_data : req.session.logined
            })
        }
    })

    // localhost:3000/del2 [post] api 생성
    router.post('/del2', (req, res)=>{
        // 유저가 보낸 데이터를 변수에 대입 & 확인
        const input_phone = req.body._phone
        const input_pass = req.body._pass
        console.log(input_phone, input_pass)

        // 데이터를 삭제
        const sql = `
            delete 
            from 
            user2 
            where 
            phone = ? 
            and 
            password = ?
        `
        const values = [input_phone, input_pass]
        connection.query(
            sql, 
            values, 
            (err, result)=>{
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log(result)
                    req.session.destroy((err2)=>{
                        if(err2){
                            console.log(err2)
                        }else{
                            // 로그인 화면으로 돌아간다
                            res.redirect("/")
                        }
                    })
                }
            }
        )
    })

    router.get('/logout', (req, res)=>{
        req.session.destroy((err2)=>{
            if(err2){
                console.log(err2)
            }else{
                // 로그인 화면으로 돌아간다
                res.redirect("/")
            }
        })
    })

    router.get('/check_pass', (req, res)=>{
        const input_pass = req.query._pass
        console.log(input_pass)
        res.send(input_pass == req.session.logined.password)
    })


    // localhost:3000/info [get] api 생성
    router.get('/info', (req, res)=>{
        if(!req.session.logined){
            res.redirect("/")
        }else{
            res.render('info.ejs', {
                login_data : req.session.logined
            })
        }
    })

    // api가 생성된 router를 리턴
    return router
}