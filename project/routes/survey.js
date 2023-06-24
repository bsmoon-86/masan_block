const express = require('express')
const router = express.Router()

// 배포한 컨트렉트의 정보를 로드 
const contract_info = require('../build/contracts/survey.json')

// caver-js 로드 
const Caver = require('caver-js')
// 컨트렉트가 배포된 네트워크 입력
const caver = new Caver('https://api.baobab.klaytn.net:8651')
// 배포한 컨트렉트를 연결
const smartcontract = new caver.klay.Contract(
    contract_info.abi, 
    contract_info.networks['1001'].address
)

// 수수료를 지불할 지갑의 정보를 등록
const account = caver.klay.accounts.createWithAccountKey(
    process.env.public_key, 
    process.env.private_key
)
// 지갑에 등록
caver.klay.accounts.wallet.add(account)

// token.js 로드 
const token = require('../token/token')

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

    // localhost:3000/survey/add 주소로 요청시
    router.get('/add', async function(req, res){
        if(!req.session.logined){
            res.redirect("/")
        }else{
            // 설문의 참여여부를 체크하여 참여 기록이 존재하지않으면 
            // 설문 페이지 이동 
            // 참여 기록이 존재한다면 
            // 메인 페이지 이동
            const result = await smartcontract
                        .methods
                        .check_survey(req.session.logined.id)
                        .call()
            console.log(result)
            // check_survey() 함수의 결과가 bool형태 
            // true인 경우 설문 내역이 존재하지 않는다. 
            // false인 경우 설문 내역이 존재한다. 
            if(result){
                res.render('survey')
            }else{
                res.redirect('/survey')
            }
        }
    })

    router.get("/add2", async function(req, res){
        // 유저가 보낸 데이터를 변수에 대입 확인
        const input_mywallet = req.query._mywallet
        const input_myphone = req.query._myphone
        const input_addr = req.query._addr
        console.log(input_mywallet, input_myphone, input_addr)
        const input_id = req.session.logined.id
        const input_name = req.session.logined.name
        const input_pass = req.session.logined.pass
        // contract에 있는 add_survey()함수를 호출
        //  매개변수가 id, name, gender, age, coffee
        // id, name은 session에서 가지고 온다.
        const receipt = await smartcontract
                        .methods
                        .add_survey(
                            input_id, 
                            input_name, 
                            input_pass,
                            input_mywallet, 
                            input_myphone, 
                            input_addr
                        )
                        .send(
                            {
                                gas : 200000, 
                                from : account.address
                            }
                        )
        console.log(receipt)
        // 설문이 완료가 된 경우 보상으로 토큰을 지급 
        // token.js 안에 있는 trade_token(지갑주소, 토큰양)
        // 토큰의 양은 10개로 고정 
        // 지갑의 주소는 ??? -> req.session.logined.wallet
        const wallet = req.session.logined.wallet
        const receipt2 = await token.trade_token(wallet, 10)
        console.log(receipt2)
        res.redirect('/survey')
    })

    // 설문의 전체내역을 확인하는 api 생성
    router.get("/list", async function(req, res){
        if(!req.session.logined){
            res.redirect("/")
        }else{
            // contract에 있는 view_list() 함수를 호출하여 등록된 설문의 개수
            // 설문에 참여한 아이디 리스트 변수에 대입
            const result = await smartcontract
                            .methods
                            .view_list()
                            .call()
            // result는 데이터의 형태가 {'0':[id_list], '1':count}
            console.log(result)
            const id_list = result['0']
            const count = result['1']
            // 반복문 실행 (0부터 count보다 작을때)
            // 새로운 배열에 설문 내역을 추가
            let survey_list = new Array()
            for (var i =0; i < count;i++){
                const input_id = id_list[i]
                const data = await smartcontract
                            .methods
                            .view_survey(input_id)
                            .call()
                // data 값은 -> {'0':name, '1':mywallet, '2':myphone, '3':addr}
                survey_list.push(data)
            }
            console.log(survey_list)
            res.render('list', {
                'list' : survey_list
            })

        }

    })


    return router
}