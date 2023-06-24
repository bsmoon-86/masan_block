// express를 사용하기 위하여 express 모듈을 로드 
const express = require('express')
// route부분이기 때문에 express.Router()
const router = express.Router()

// baobab testnet에 배포한 contract와의 연동

// contract의 정보를 가지고 있는 json파일을 로드 
const contract_info = require('../build/contracts/userinfo.json')

// caver-js 로드 
const Caver = require('caver-js')
// 컨트렉트가 배포된 주소를 입력
const caver = new Caver('https://api.baobab.klaytn.net:8651')
// 컨트렉트와 연동
const smartcontract = new caver.klay.Contract(
    contract_info.abi, 
    contract_info.networks['1001'].address
)

// 수수료를 지불할 지갑의 정보를 등록
const account = caver.klay.accounts.createWithAccountKey(
    process.env.public_key, 
    process.env.private_key
)
// 지갑을 등록
caver.klay.accounts.wallet.add(account)

// token.js를 로드 
const token = require("../token/token.js")

// app.js에서 localhost:3000/ 일때 해당 파일을 사용
// login.js는 기본 주소값이 localhost:3000/

module.exports = function(){
    // api 생성
    // api를 생성한다. 
    // api : 유저가 서버에게 요청할 수 있는 목록

    // localhost:3000/ [get] api 생성
    router.get('/', function(req, res){
        // req라는 매개변수는 request약자로 유저가 서버에게 요청하는 부분
        // res라는 매개변수는 response의 약자로 서버가 유저에게 응답하는 부분
        if(!req.session.logined){
            res.render('main.ejs')
        }else{
            res.redirect('/trade/list')
        }
    })


    // localhost:3000/signin [post] api 생성
    router.post('/login', async function(req, res){
        // post의 형태는 데이터를 주소에 실어서 보내는것이 아니라
        // 데이터를 숨겨서 보내줌으로 보안성이 뛰어나다. 
        // request 안에 body라는 키 안에 데이터를 실어서 보내준다. 
        const input_id = req.body.input_id
        const input_pass = req.body.input_pass
        console.log(input_id, input_pass)

        // smartcontract를 이용하여 로그인 기능 구현
        // 컨트렉트에서 정보가 올때까지 대기
        const result = await smartcontract
                        .methods
                        .view_info(input_id)
                        // view함수이기 때문에 수수료 발생하지 않는다. 
                        .call()
        console.log(result)
        // 로그인이 성공하는 조건? -> result의 데이터가 존재, 
        // 존재한다면 result['1'] == input_pass와 같은 경우에 로그인 성공
        if ((result['1'] != "") & (result['1'] == input_pass)){
            req.session.logined = result
        }
        res.redirect("/")

        

        // 서버가 유저에게 ejs 파일 외의 데이터를 같이 실어서 보내준다. 
        // let data
        // if (input_id == 'test' && input_pass == '1234'){
        //     data = '로그인이 성공하였습니다.'
        // }else{
        //     data = '로그인이 실패하였습니다 다시 로그인을 해주세요'
        // }
        // res.render('main.ejs', {
        //     res_data : data
        // })
    })

    // 회원 가입 api 생성
    router.get("/add_user", function(req, res){
        // 회원 가입 화면을 응답
        res.render('signup.ejs')
    })

    router.post('/signup', async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 
        const _id = req.body.input_id
        const _pass = req.body.input_pass
        const _name = req.body.input_name
        const _myphone = req.body.input_myphone
        const _addr = req.body.input_addr
        console.log(_id, _pass, _name, _myphone, _addr)
        const _wallet = await token.create_wallet()
        console.log(_wallet)

        // smartcontract를 이용하여 회원 가입 
        const receipt = await smartcontract
                        .methods
                        .add_user(
                            _id, 
                            _pass, 
                            _name, 
                            _myphone, 
                            _addr, 
                            _wallet
                        )
                        // 데이터가 변화가 존재 -> transaction 발생
                        .send(
                            {
                                from : account.address, 
                                gas : 2000000
                            }
                        )
        console.log(receipt)
        res.redirect('/')
    })


    return router
}