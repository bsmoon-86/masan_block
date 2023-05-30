// express 로드 
const express = require('express')
const app = express()

// dotenv 설정
require('dotenv').config()

// 뷰 파일의 기본 위치와 엔진을 설정
app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

// post 형식으로 데이터가 들어올때 json의 형태로 변환
app.use(express.urlencoded({extended:false}))

// mysql의 정보를 등록
const mysql = require('mysql2')
const connection = mysql.createConnection({
    host : process.env.host, 
    port : process.env.port, 
    user : process.env.user, 
    password : process.env.password,
    database : process.env.db 
})

// express-session 설정
const session = require('express-session')
app.use(
    session(
        {
            secret : process.env.secret_key , 
            resave : false , 
            saveUnintialized : false , 
            cookie: {
                maxAge : 300000
            }
        }
    )
)

// baobab testnet에 배포한 컨트렉트를 연동
const contract_info = require("./build/contracts/food_history.json")

// caver-js 로드 
const Caver = require('caver-js')
// 컨트렉트가 배포된 주소를 입력
const caver = new Caver('https://api.baobab.klaytn.net:8651')
// 네트워크에 있는 컨트렉트와 연동
const smartcontract = new caver.klay.Contract(
    contract_info.abi, 
    contract_info.networks['1001'].address
)

// 수수료를 지불할 지갑의 정보를 입력
const account = caver.klay.accounts.createWithAccountKey(
    process.env.public_key, 
    process.env.private_key
)
// 해당하는 네트워크에서 사용할수 있게 지갑을 등록
caver.klay.accounts.wallet.add(account)

// api들을 생성
// localhost:3000/ 요청시 
app.get('/', function(req, res){
    // 해당하는 주소로 요청이 들어온 경우 
    // req.session 안에 로그인의 정보가 존재하지 않는다면 
    // 로그인 화면을 보여주고 
    // 존재한다면 main으로 이동

    // 세션에 로그인 정보가 존재하지 않는다면
    if(!req.session.login){
        res.render('login')
    }else {
        res.redirect("/main")
    }
})


app.listen(3000, function(){
    console.log('server start')
})
