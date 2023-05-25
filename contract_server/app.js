const express = require('express')
const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

// web3 로드 
const Web3 = require('web3')
// 컨트렉트의 정보를 로드 
// json 파일의 위치가 현재 경로에서 build라는 하위 폴더로 이동
// contracts 하위폴더로 다시 한번 이동
// userinfo.json이 존재
const contract_info = require('./build/contracts/userinfo.json')
/*
    contract_info = {
        xxx : xxxx, 
        abi : xxxxxxxx, 
        networks : {
            '5777' : {
                xx : xxxx, 
                address : 0x0000aaa
            }
        }
    }
    abi 값만 출력하려면? -> contract_info.abi, contract_info['abi']
    address 값을 출력하려면? 
        contract_info.networks -> {
            '5777' : {
                xx :xxxx, 
                address : 0x0000aaa
            }
        }
        contract_info.networks['5777'] -> {
            xx: xxxx, 
            address : 0x000000aa
        }
        contract_info.networks['5777'].address -> 0x00000aaaa
*/

// 컨트렉트가 배포되어 있는 네크워크 주소 등록
const web3 = new Web3(new Web3.providers.HttpProvider(
    'http://127.0.0.1:7545'
))
// 배포한 컨트렉트의 주소와 abi를 등록
const smartcontract = new web3.eth.Contract(
    contract_info.abi, 
    contract_info.networks['5777'].address
)

// 가나슈에 있는 지갑 리스트 로드 
let address
web3.eth.getAccounts(function(err, ass){
    if(err){
        console.log(err)
    }else{
        console.log(ass)
        address = ass
    }
})

// api 생성
app.get("/", function(req, res){
    res.render('index')
})

// login [post] api 생성
app.post('/login', function(req, res){
    // 유저가 입력한 데이터를 변수에 대입
    const _id = req.body._id
    const _pass = req.body._pass
    console.log(_id, _pass)

    smartcontract
    .methods
    .view_info(_id)    // view_info 함수는 매개변수 _id 존재
    .call()            // view 함수는 call() 함수를 이용하여 데이터를 받아온다. 
    .then(function(result){
        // result 변수에 view_info()함수에서 리턴에 준 데이터가 대입
        // {'0' : id, '1' : password, '2' : name, '3' : phone}
        console.log(result)
        // 입력받은 password 값과 조회 된 password의 값이 같으면 
        // 로그인 성공
        // 만약에 값이 존재하지 않거나 다르면 
        // 로그인 실패
        if (_pass == result['1']){
            res.send('로그인 성공')
        }else{
            res.send('로그인 실패')
        }
    })

})

// 회원 가입 페이지 api 
app.get("/signup", function(req, res){
    res.render('signup')
})

app.post('/signup2', function(req, res){
    // 유저가 입력한 데이터를 변수에 대입
    const _id = req.body._id
    const _pass = req.body._pass
    const _name = req.body._name
    const _phone = req.body._phone
    console.log(_id, _pass, _name, _phone)

    // smartcontract를 이용하여 데이터를 추가
    // contract add_user() 함수를 호출
    smartcontract
    .methods
    .add_user(_id, _pass, _name, _phone)     //add_user() 함수는 매개변수 4개 id, pass, name, phone
    .send({
        gas : 200000, 
        from : address[0]
    })
    .then(function(result){
        console.log(result)
        res.redirect("/")
    })
})



app.listen(3000, function(){
    console.log('Server Start')
})