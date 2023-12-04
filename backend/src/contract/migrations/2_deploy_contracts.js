var FreelanceContract=artifacts.require ("./FreelanceContract.sol");
module.exports = function(deployer) {
      deployer.deploy(FreelanceContract);
}