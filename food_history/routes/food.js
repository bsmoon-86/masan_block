const express = require('express')
const router = express.Router()

// baobab testnet에 배포한 컨트렉트를 연동
const contract_info = require("../build/contracts/food_history.json")

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

module.exports = function(){

    //이 파일은 기본 경로가 localhost:3000/food

    // localhost:3000/food/regist [get]
    router.get('/regist', function(req, res){
        // 유저가 입력한 데이터를 변수에 대입 
        const _code = req.query.input_code
        const _type = req.query.input_type
        console.log(_code, _type)

        // name 값은 로그인 데이터에서 name 값을 가지고 온다
        // 로그인 정보는 session 저장
        // name 값을 가지고 오려면 session 안에 있는 name을 추출
        const _name = req.session.login['name']
        console.log(_name)
        

        // smartcontract에 있는 method를 사용
        smartcontract
        .methods
        .regist_food(_code, _name, _type)
        .send(
            {
                from : account.address, 
                gas :  2000000
            }
        )
        .then(function(receipt){
            console.log(receipt)
            res.redirect('/main')
        })
    })

    // localhost:3000/food/add_hist [get]
    router.get('/add_hist', function(req, res){
        // 유저가 입력한 데이터를 변수에 대입 
        const _code = req.query.input_code
        const _hist = req.query.input_hist
        console.log(_code, _hist)

        // smartcontract 안에 있는 method를 이용하여 내역을 추가 
        smartcontract
        .methods
        .add_hist(_code, _hist)
        .send(
            {
                from : account.address, 
                gas : 2000000
            }
        )
        .then(function(receipt){
            console.log(receipt)
            res.redirect("/main")
        })
    })

    // localhost:3000/food/view_hist [get]
    router.get('/view_hist', function(req, res){
        // 유저가 입력한 데이터를 변수 대입
        const _code = req.query.input_code
        console.log(_code)

        // smartcontract에 있는 method 중에 view 함수 호출
        smartcontract
        .methods
        .view_food(_code)
        .call()
        .then(function(result){
            console.log(result)
            // res.send(result)
            res.render('food_hist', {
                'name' : result['0'], 
                'type' : result['1'], 
                'hist' : result['2']
            })
        })
    })

    return router
}