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
        const input_gender = req.query._gender
        const input_age = req.query._age
        const input_coffee = req.query._coffee
        console.log(input_gender, input_age, input_coffee)
        const input_id = req.session.logined.id
        const input_name = req.session.logined.name
        // contract에 있는 add_survey()함수를 호출
        //  매개변수가 id, name, gender, age, coffee
        // id, name은 session에서 가지고 온다.
        const receipt = await smartcontract
                        .methods
                        .add_survey(
                            input_id, 
                            input_name, 
                            input_gender, 
                            input_age, 
                            input_coffee
                        )
                        .send(
                            {
                                gas : 200000, 
                                from : account.address
                            }
                        )
        console.log(receipt)
        res.redirect('/survey')
    })


    return router
}