const express = require('express')
const router = express.Router()

// 파일 업로드를 사용하기위한 모듈
const multer = require('multer')
const storage = multer.diskStorage(
    {
        destination : function(req, file, cb){
            cb(null, 'public/uploads/')
        }, 
        filename : function(req, file, cb){
            cb(null, file.originalname)
        }
    }
)
// 유저가 보낸 파일을 저장할 위치를 설정
const upload = multer({
    storage : storage
})

const moment = require('moment')
let date = moment()


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
        const input_create_dt = date.format('YYYY-MM-DD hh:mm:ss')
        const input_writer = req.session.logined['0']        
        console.log(
            input_name, 
            input_price, 
            input_explain, 
            input_duedate, 
            input_image, 
            input_create_dt, 
            input_writer
        )


        const sql = `
            insert 
            into 
            goods(
                name, 
                price, 
                content, 
                createdt, 
                duedate, 
                img, 
                writer
            )
            values (?, ?, ?, ?, ?, ?, ?)
        `
        const values = [
            input_name, 
            input_price, 
            input_explain, 
            input_create_dt, 
            input_duedate, 
            input_image, 
            input_writer
        ]
        connection.query(
            sql, 
            values, 
            function(err, result){
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log(result)
                    res.redirect('/trade/list')
                }
            }
        )


    })

    // localhost:3000/trade/info [get] api 생성
    router.get('/info/:_no', function(req, res){
        const input_no = req.params._no
        console.log(input_no)

        const sql = `
            select 
            * 
            from 
            goods 
            where 
            no = ?
        `
        const values = [input_no]

        connection.query(
            sql, 
            values, 
            function(err, result){
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log(result)
                    res.render('detail.ejs', {
                        data : result[0], 
                        login : req.session.logined
                    })
                }
            }
        )
    })

    // localhost:3000/reservation [get] api 생성
    router.get('/reservation/:_no', function(req, res){
        const input_no = req.params._no
        console.log(input_no)

        const sql = `
            update 
            goods 
            set 
            status = 1 
            where 
            no = ?
        `
        const values = [input_no]
        connection.query(
            sql, 
            values, 
            function(err, result){
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log(result)
                    res.redirect('/trade/info/'+input_no)
                }
            }
        )
    })

    // localhost:3000/confirm [get] api 생성
    router.get('/confirm/:_no', function(req, res){
        const input_no = req.params._no
        console.log(input_no)

        const sql = `
            update 
            goods 
            set 
            status = 2 
            where 
            no = ?
        `
        const values = [input_no]

        connection.query(
            sql, 
            values, 
            function(err, result){
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    console.log(result)
                    res.redirect('/trade/info/'+input_no)
                }
            }
        )
    })


    return router
}