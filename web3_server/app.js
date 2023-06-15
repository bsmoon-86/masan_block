const express = require('express')
const app = express()

app.set('views', __dirname+"/views")
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended : false}))

// web3 버전 1 일 때는
const Web3 = require('web3')
// web3 버전 4.0 이상
// const { Web3 } = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider(
    'http://127.0.0.1:7545'
))

const contract_info = require("./build/contracts/test.json")

const smartcontract = new web3.eth.Contract(
    contract_info.abi, 
    contract_info.networks['5777'].address
)

// localhost:3000/
app.get('/', function(req, res){
    res.render('index')
})

app.get("/add", function(req, res){
    const input_wallet = req.query._wallet
    const input_name = req.query._name
    const input_age = req.query._age
    const input_birth = req.query._birth
    console.log(
        input_wallet, 
        input_name, 
        input_age, 
        input_birth
    )
    let receipt;
        // 유저가 보낸 데이터를 컨트렉트를 이용하여 데이터를 저장
        receipt = smartcontract
        .methods
        .add_user(
            input_wallet, 
            input_name, 
            input_age, 
            input_birth
        )
        .send(
            {
                from : '0x57063DFDBd644f9d1531bB4225Cf13F5675832D5', 
                gas : 200000
            }
        )
    
    console.log(receipt)
    res.redirect('/login')


})

app.get('/login', function(req, res){
    res.render('login')
})

app.post('/login2', async function(req, res){
    const input_wallet = req.body._wallet
    console.log(input_wallet)

    // 로그인이 성공하는 조건?
    // 지갑의 주소를 기준으로 mapping 데이터에 데이터가 존재한다면 
    // 로그인 성공
    // 그외에는 로그인 실패

    const result = await smartcontract
                    .methods
                    .view_user(input_wallet)
                    .call()
    // result = {'0' : name(string), '1' : age(uint), '2' : birth(string)}
    console.log(result)
    if ((result['0'] != "") & (result['2'] != "") & (result['1'] != 0)){
        res.send('로그인이 성공')
    }else{
        res.send('로그인 실패')
    }
})

app.listen(3000, function(){
    console.log('server start')
})