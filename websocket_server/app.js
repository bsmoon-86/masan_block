// express server open

const express = require('express')
const app = express()

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

app.get("/", function(req, res){
    res.render('index')
})

const http_server = app.listen(80, function(){
    console.log('Server Start')
})


// ws 라이브러리 로드
const webModule = require('ws')

// webSocket server 실행
const webSocketServer = new webModule.Server(
    {
        server : http_server
    }
)

// webSocket server의 이벤트 처리 

webSocketServer.on('connection', function(ws, request){

    // 연결이 되는 유저의 ip을 변수에 대입
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress

    console.log('새로운 클라이언트의 ip :', ip)

    // 연결 여부 체크 
    if(ws.readyState === ws.OPEN){
        ws.send('웹소켓 서버와 연결이 되었습니다.')
    }

    // 유저가 서버에게 메시지를 보내는 경우
    ws.on('message', function(msg){
        // msg은 buffer 형태로 표현
        // buffer를 문자열로 변경
        console.log(ip, ':', msg.toString('utf-8'))
        let data = msg.toString('utf-8')
        let message
        if(data == '안녕하세요'){
            message = "안녕하세요"
        }else if(data == "오늘 수업은 언제 끝나나요?"){
            message = "수업은 오후 10시쯤 종료 예정입니다."
        }else{
            message = '등록되지 않은 질문이 들어왔습니다.'
        }
        
        ws.send(message)
    })

    // 유저와의 연결에서 에러가 발생하는 경우
    ws.on('error', function(err){
        console.log(err)
        ws.send('웹 소켓과의 연결에서 에러가 발생하였습니다.')
    })

    // 유저와 연결이 종료되는 경우
    ws.on('close', function(){
        console.log(ip, "연결이 종료되었습니다.")
        ws.send('웹소켓 서버와의 연결이 종료되었습니다. ')
    })

})
