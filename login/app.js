const express = require('express')

const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

require('dotenv').config()

const mysql = require('mysql2')

const connection = mysql.createConnection({
    host : process.env.host, 
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.password, 
    database : process.env.database
})


app.get('/', function(req, res){
    if(req.query){
        const login = req.query.data
        console.log(login)
    }
    res.render('index')
})

app.post('/login', function(req,res){
    const id = req.body._id
    const pass = req.body._pass

    console.log(id, pass)
    connection.query(
        `select * from user_info where id = ? and password = ?`
    , [id, pass], 
    function(err, result){
        if(err){
            console.log(err)
        }else{
            if(result.length != 0){
                res.render('main')
            }else{
                res.redirect('/?data=fail')
            }
        }
    })

})


app.listen(3000, function(){
    console.log('server start')
})