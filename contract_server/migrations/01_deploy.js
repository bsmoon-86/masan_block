const user = artifacs.require('user_info')

module.exports = function(deployer){
    deployer.deploy(user)
    .then(function(){
        console.log(user)
    })
}