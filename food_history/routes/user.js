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
    // 이 파일의 기본 경로는 localhost:300/user

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





    // return이 되는 변수는 router
    return router
}