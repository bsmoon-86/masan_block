const express = require('express')
const router = express.Router()

// 이더리움 환경에 contract를 로드하기 위해 web3 불러온다. 
const Web3 = require('web3')

// contract가 배포되어 있는 네트워크 주소를 등록
const web3 = new Web3(
    new Web3.providers.HttpProvider('http://127.0.0.1:7545'))

// 배포한 contract의 abi와 address 값을 불러온다.
// 정보가 담겨있는 json 파일을 로드 
const contract_info = require('../build/contracts/subcontract.json')

// contract와 연결
const smartcontract = new web3.eth.Contract(
    contract_info.abi, 
    contract_info.networks['5777'].address
)

// 가나슈 주소값 로드
let address
web3.eth.getAccounts(function(err, ass){
    if(err){
        console.log(err)
    }else{
        address =  ass
        console.log(address)
    }
})


module.exports = function(){
    // localhost:3000/contract 기본 주소

    router.post("/add", function(req, res){
        // 유저가 보낸 데이터를 변수에 대입
        const _no = Number(req.body._no)
        const _title = req.body._title
        const _content = req.body._content
        // 이러한 값을 콘솔로 확인
        console.log(_no, _title, _content)

        // smartcontract를 이용하여 transaction을 발생
        smartcontract
        .methods    // smartcontract 안에 함수들 중
        .add_contract(_no, _title, _content) // add_contract 함수를 호출 매개변수가 3개임으로 인자도 3개 등록
        // 해당하는 함수가 view 함수인지 아닌지를 판단하여 send(), call()을 지정
        .send({
            from : address[0], 
            gas : 2000000
        })
        .then(function(receipt){
            console.log(receipt)
            res.redirect('/')
        })
    })

    return router
}