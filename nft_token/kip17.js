// caver-js-ext-kas 로드 
const CaverExtKAS = require('caver-js-ext-kas')
const caver = new CaverExtKAS()
const fs = require('fs')

// KAS에 접속하기 위한 KAS ID, PASSWORD 입력
const kas_info = require('./kas.json')
const accesskeyId = kas_info.accessKeyId
const secretAccessKey = kas_info.secretAccessKey
console.log(accesskeyId, secretAccessKey)

// testnet chainID 지정
const chainid = 1001

caver.initKASAPI(chainid, accesskeyId, secretAccessKey)

// 외부의 지갑을 KAS에서 사용하려면 KAS wallet 지갑을 등록 
const keyringContainer = new caver.keyringContainer()
const keyring = keyringContainer.keyring.createFromPrivateKey(
    '0xef0a0198393a7012063e4892fdeb4ead00a841beaa7c7188893833987d36d7c6'
)
const keyring2 = keyringContainer.keyring.createFromPrivateKey(
    '0x1b02d2bb3012f7218e90d336a935bd919d0741a5814252d51cf5c337984f2192'
)

// 지갑을 등록 
keyringContainer.add(keyring)
keyringContainer.add(keyring2)

// KAS 안에 배포되어 있는 NFT 목록을 확인
async function nft_list(){
    const result = await caver.kas.kip17.getContractList();
    // return result
    console.log(result)
}
// nft_list()

// kip17 컨트렉트를 배포
async function deploy_nft(){
    //kip17.deploy(name, symbol, alias)
    // alias 허용되는 문자가 영소문자, 숫자, 하이픈이 가능 첫글자는 언제나 영소문자
    const result = await caver.kas.kip17.deploy(
        'Masan Token', 
        'MT', 
        'masan-token'
    )
    console.log(result)
}
// deploy_nft()

// nft mint 
async function mint_nft(){
    // mint(nft addrress or alias, to, tokenId, tokenURL)
    // tokenId는 토큰의 고유번호, 16진수로 표현 이미 발행되어 있는 tokenId는 사용이 불가능
    // 예외의 경우는 해당하는 토큰이 소각되었으면 사용이 가능하다. 
    const result = await caver.kas.kip17.mint(
        'masan-token', 
        "0xd52863320168D36402EFb31b36515D723656258D", 
        "0x2", 
        "http://link.to.your/token/metadata-0x1.json"
    )
    console.log(result)
}
// mint_nft()

// 발행된 nft의 목록 조회 
async function token_list(){
    const result = await caver.kas.kip17.getTokenList('masan-token')
    console.log(result)
}
// token_list()

// 토큰을 전송
async function transfer_nft(){
    // transfer(token addess or alias, sender, owner, to, tokenId)
    // sender : transaction을 발생시킬 지갑의 주소
    // owner : 해당 nft 소유자
    // to : nft를 받을 지갑 주소
    // tokenId : token id
    // sender와 owner의 지갑 주소가 다르다면? owner가 sender에게 토큰을 이동 시킬수 있는 권한 부여
    try{
        console.log(keyring.address)
        console.log(keyring2.address)
        // const result = await caver.kas.kip17.transfer(
        //     'masan-token', 
        //     keyring.address, 
        //     keyring.address, 
        //     keyring2.address, 
        //     '0x1'
        // )
        // console.log(result)
    }catch(e){
        console.log('error', e)
    }
}
transfer_nft()