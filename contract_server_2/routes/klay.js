const express = require('express')
const router = express.Router()

// token.js 로드 
const token = require("../token/token.js")

// baobab network에 배포한 컨트렉트 정보를 로드 
const contract_info = require("../build/contracts/board2.json")

// caver-js 로드 
const Caver = require('caver-js')
// 컨트렉트가 배포된 네트워크 주소를 입력
const caver = new Caver('https://api.baobab.klaytn.net:8651')
// 해당하는 네트워크에 배포한 컨트렉트와의 연결
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


// api 생성
module.exports = ()=>{
    // 해당하는 파일의 기본 경로가 localhost:3000/eth

    router.get("/board", async (req, res)=>{
        // block 저장된 데이터를 로드 
        // 글목록의 배열과 배열의 크기를 리턴해주는 함수를 호출
        const result = await smartcontract
                        .methods
                        .view_count()
                        // view 함수이기 때문에 수수료가 발생하지 않는다.
                        .call()
        console.log(result)
        console.log(req.session)
        // 빈 배열을 변수에 지정
        const con_list = new Array()
        const len_contents = result['0']
        // 배열의 길이만큼 view_content함수를 호출
        // 반복문을 이용해서 리스트의 항목들을 배열에 삽입
        for (var i = 1; i < len_contents; i++){
            const content_info = await smartcontract
            .methods
            .view_content(i)
            .call()

            con_list.push(content_info)
        }

        console.log(con_list)

        res.render("board2.ejs", {
            'data_list' : con_list
        })
    })

    router.get('/add_content', (req, res)=>{
        res.render('add_content2.ejs')
    })

    router.post('/add_content', (req, res)=>{
        // 유저가 보낸 데이터를 변수에 대입
        const _title = req.body.input_title
        const _content = req.body.input_content
        // const _name = req.body.input_name
        const _image = req.body.input_image
        // 작성자의 이름은 로그인을 한 정보의 name을 대입
        const _name = req.session.logined.name
        console.log(_title, _content, _name, _image)

        // smartcontract를 이용하여 데이터를 저장 
        smartcontract
        .methods
        .add_content(
            _title, 
            _content, 
            _name, 
            _image
        )
        // 해당 method는 데이터를 삽입하는 함수임으로 수수료가 발생
        .send(
            {
                from : account.address, 
                gas : 2000000
            }
        )
        .then(async function(receipt){
            console.log(receipt)
            const wallet = req.session.logined.wallet
            console.log(wallet)
            // 보상 token 지급 
            await token.trade_token(wallet, 20)
            res.redirect("/klay/board")
        })
    })

    router.get('/view_content/:no', async (req, res)=>{
        const _no = req.params.no
        console.log(_no)

        // 해당하는 글의 정보를 리턴
        const result = await smartcontract
        .methods
        .view_content(_no)
        .call()
        
        res.render('view_content.ejs', {
            'data' : result
        })
    })

    // 유저의 지갑에 있는 토큰의 수량을 확인하는 api
    router.get("/balance", async (req, res)=>{
        // 로그인을 한 유저의 wallet을 변수에 대입
        const wallet = req.session.logined.wallet
        console.log(wallet)
        const balance = await token.balance_of(wallet)
        console.log(balance)
        // 유저의 정보를 ejs와 함께 보낸다. 
        res.render('user_info.ejs', {
            'id' : req.session.logined.id, 
            'name' : req.session.logined.name, 
            'phone' : req.session.logined.phone, 
            'wallet' : req.session.logined.wallet, 
            'amount' : balance
        })
    })


    return router
}