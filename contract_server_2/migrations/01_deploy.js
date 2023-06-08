const board = artifacts.require('board2')

module.exports = function(deployer){
    deployer.deploy(board)
    .then(function(){
        console.log('Contract deploy')
    })
}