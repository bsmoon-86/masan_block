const food_hist = artifacts.require('food_history')

module.exports = function(deployer){
    deployer.deploy(food_hist)
    .then(function(){
        console.log(food_hist)
    })
}