// express 로드 
const express = require('express')
const router = express.Router()

module.exports = function(){

    router.get("/", function(req, res){
        res.render('index.ejs')
    })

    return router
}