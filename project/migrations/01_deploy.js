const userinfo = artifacts.require('userinfo')

module.exports = function(deplaoyer){
    deplaoyer.deploy(userinfo)
    .then(function(){
        console.log('Contract Deploy')
    })
}