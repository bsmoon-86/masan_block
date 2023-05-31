// express 로드 
const express = require('express')
// Router()를 변수로 지정
const router = express.Router()

// mysql의 정보를 등록
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host : process.env.host, 
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.password,
    database : process.env.db 
})

module.exports = function(){

    // user.js 파일은 localhost:3000/user 로 요청시에만 사용
    // 이 파일의 기본 경로는 localhost:3000/user

    // localhost:3000/user/login [post] 형식으로 요청 시
    router.post("/login", function(req, res){
        // 로그인 화면에서 유저가 입력 id, pass값을 변수에 대입
        const _id = req.body.input_id
        const _pass = req.body.input_pass
        console.log(_id, _pass)

        // DB에 있는 table에 id와 password가 유저가 입력한 데이터와
        // 같은 데이터가 존재하는가 확인
        // 쿼리문을 이용하여 데이터의 존재 유무를 확인
        connection.query(
            `
                select 
                * 
                from 
                user_info 
                where 
                id = ? 
                and 
                password = ?
            `, 
            [_id, _pass], 
            function(err, result){
                if(err){
                    console.log('login select error')
                    res.send(err)
                }else{
                    // 로그인이 성공하는 조건?
                    // 데이터가 존재하면 로그인 성공
                    // 데이터가 존재하지 않는다면 로그인이 실패
                    // sql 에서 데이터를 받을때 [{id : xxx, password:xxx}]
                    if(result.length != 0){
                        // 로그인이 성공하는 조건
                        req.session.login = result[0]
                    }
                    res.redirect("/")
                }
            }
        )
    })

    // 회원 가입 (localhost:3000/user/add_user 주소로 요청시)
    router.get('/add_user', function(req, res){
        res.render('signup')
    })

    router.post('/add_user2', function(req, res){
        // 유저가 보낸 데이터를 서버에서 대소로 대입
        const _id = req.body.input_id
        const _pass = req.body.input_pass
        const _name = req.body.input_name
        const _phone = req.body.input_phone
        console.log(_id, _pass, _name, _phone)

        // 유저가 보내온 데이터를 가지고 sql user_info table에 데이터를 삽입
        connection.query(
            `insert into 
            user_info 
            values (?, ?, ?, ?)`, 
            [_id, _pass, _name, _phone], 
            function(err, receipt){
                if(err){
                    console.log(err)
                    res.send('user add_user sql error')
                }else{
                    console.log(receipt)
                    // sql 쿼리문이 정상적으로 작동하면 로그인 화연으로 돌아간다. 
                    res.redirect("/")
                }
            }
        )
    })

    // 회원 탈퇴 하는 주소를 생성
    router.get("/drop", function(req, res){
        // 본인 확인 페이지를 로드 
        res.render('drop_user', {
            '_id' : req.session.login.id
        })
    }) 

    // 회원 탈퇴 sql api
    router.post('/drop2', function(req, res){
        // 유저가 입력한 데이터를 변수에 대입
        const _id = req.body.input_id
        const _pass = req.body.input_pass
        console.log(_id, _pass)

        // 해당하는 변수들을 이용하여 데이터베이스에서 확인
        connection.query(
            `select * from user_info where id = ? and password = ?`, 
            [_id, _pass], 
            function(err, result){
                if(err){
                    console.log(err)
                    res.send('drop select sql error ')
                }else{
                    if(result.length != 0){
                        connection.query(
                            `delete from user_info where id = ?`, 
                            [_id], 
                            function(err2, result2){
                                if(err2){
                                    console.log(err2)
                                    res.send('drop delete error')
                                }else{
                                    // session data를 삭제
                                    req.session.destroy(function(){
                                        req.session
                                    })
                                    res.redirect('/')
                                }
                            }
                        )
                    }
                }
            }
        )
    })



    // return이 되는 변수는 router
    return router
}