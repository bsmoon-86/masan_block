const express = require('express')
const app = express()
const port = 3000
app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

require('dotenv').config()

// express-session 모듈을 로드 
const session = require('express-session')
// session 설정
app.use(
    session(
        {
            secret : process.env.secret, 
            resave : false, 
            saveUninitialized : false, 
            cookie : {
                maxAge : 60000  // 1000당 1초
            }
        }
    )
)


const login = require('./routes/login')()
app.use("/", login)

const contract = require('./routes/contract')()
app.use('/contract', contract)



app.listen(port, ()=>{
    console.log('server start')
})