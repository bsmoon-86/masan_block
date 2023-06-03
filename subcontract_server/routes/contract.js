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
    // localhost:3000/contract/list 주소로 요청 시
    router.get("/list", async function(req, res){
        // 블록체인에 저장된 계약서 리스트를 호출
        const result = await smartcontract
                        .methods
                        .view_contracts()
                        // view 함수임으로 call()을 사용
                        .call()
        console.log(result)
        const len_contract = result['0']
        const contracts = result['1']
        // view_contracts는 계약서의 목록 리턴
        // view contract는 계약서 하나의 정보를 리턴

        // 배열 변수를 생성
        const con_list = new Array()

        // 반복문을 사용하여 리스트의 계약서 정보들을 
        // con_list에 추가한다.
        for (var i = 0; i < len_contract; i++){
            const con_info = await smartcontract
            .methods
            .view_contract(contracts[i])
            .call()
            con_list.push(con_info)
        }

        // res.send(con_list)
        res.render('list', {
            'data_list' : con_list
        })

    })

    return router
}