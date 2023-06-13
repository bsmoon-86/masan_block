const express = require('express')
const router = express.Router()

module.exports =function(){
    
    // 이 파일은 localhost:3000/survey 가 기본 경로

    // localhost:3000/survey 요청 시
    router.get("/", function(req, res){
        if(!req.session.logined){
            res.redirect("/")
        }else{
            res.render('main')
        }
    })


    return router
}