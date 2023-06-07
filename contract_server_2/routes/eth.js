const express = require('express')
const router = express.Router()

// 이더리움 환경에서 contract를 로드하기위한 web3호출
const Web3 = require('web3')

// contract가 배포되어 있는 네트워크의 주소값을 등록
const web3 = new Web3(
    new Web3.providers.HttpProvider('http://127.0.0.1:7545'))

// contract의 정보가 담겨져 있는 board.json을 로드 
const contract_info = require("../build/contracts/board.json")

// contract와의 연결
const smartcontract = new web3.eth.Contract(
    contract_info.abi, 
    contract_info.networks['5777'].address
)

// 가나슈에 있는 지갑의 주소들을 로드 
let address
web3.eth.getAccounts(function(err, ass){
    if(err){
        console.log(err)
    }else{
        address = ass
        console.log(address)
    }
})

// api 생성
module.exports = ()=>{
    // 해당하는 파일의 기본 경로가 localhost:3000/eth

    router.get("/board", (req, res)=>{
        res.render("board.ejs")
    })

    router.get('/add_content', (req, res)=>{
        res.render('add_content.ejs')
    })

    router.post('/add_content', (req, res)=>{
        // 유저가 보낸 데이터를 변수에 대입
        const _no = req.body.input_no
        const _title = req.body.input_title
        const _content = req.body.input_content
        const _name = req.body.input_name
        const _image = req.body.input_image
        console.log(_no, _title, _content, _name, _image)

        // smartcontract를 이용하여 데이터를 저장 
        smartcontract
        .methods
        .add_content(
            _no, 
            _title, 
            _content, 
            _name, 
            _image
        )
        // 해당 method는 데이터를 삽입하는 함수임으로 수수료가 발생
        .send(
            {
                from : address[0], 
                gas : 2000000
            }
        )
        .then(function(receipt){
            console.log(receipt)
            res.redirect("/eth/board")
        })
    })


    return router
}