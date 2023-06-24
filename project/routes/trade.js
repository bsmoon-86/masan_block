const express = require('express')
const router = express.Router()

// 파일 업로드를 사용하기위한 모듈
const multer = require('multer')
// 유저가 보낸 파일을 저장할 위치를 설정
const upload = multer(
    {
        dest : 'uploads/'
    }
)


// mysql server와의 연동
const mysql = require('mysql2')

const connection = mysql.createConnection(
    {
        host: process.env.host, 
        port : process.env.port, 
        user : process.env.user, 
        password : process.env.password, 
        database : process.env.database
    }
)


// api 생성
module.exports = ()=>{
    // 해당하는 파일의 기본 경로가 localhost:3000/trade

    // localhost:3000/trade/list [get] api 생성
    router.get('/list', function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            // DB 안에 있는 goods table의 정보를 불러온다. 
            const sql = `
                select 
                * 
                from 
                goods
            `
            connection.query(
                sql, 
                function(err, result){
                    if(err){
                        console.log(err)
                        res.send(err)
                    }else{
                        res.render('list.ejs', {
                            list : result
                        })
                    }
                }
            )
        }
    })

    // localhost:3000/trade/regist [get] api 생성
    router.get('/regist', function(req, res){
        if(!req.session.logined){
            res.redirect('/')
        }else{
            res.render('regist.ejs')
        }
    })

    // localhost:3000/trade/regist [post] api 생성
    router.post('/regist', upload.single('_image'), function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 확인
        const input_name = req.body._name
        const input_price = req.body._price
        const input_explain = req.body._explain
        const input_duedate = req.body._duedate
        const input_image = req.file.filename
        console.log(input_name, input_price, input_explain, input_duedate, input_image)

        res.redirect('/')

    })


    return router
}