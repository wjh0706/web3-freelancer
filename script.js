const Web3 = require('web3');
const fs = require('fs');

const web3 = new Web3('http://localhost:8545'); // Connect to your Ethereum node

// Load the compiled contract ABI and bytecode
const contractJSON = JSON.parse(fs.readFileSync('FreelanceContract.json', 'utf8'));
const contractABI = contractJSON.abi;
const contractBytecode = contractJSON.bytecode;

// Deploy the contract
async function deployContract() {
    const accounts = await web3.eth.getAccounts();
    const jobSolver = accounts[1];
    const thirdParty = accounts[2];

    const contract = new web3.eth.Contract(contractABI);

    const deployTransaction = contract.deploy({
        data: contractBytecode,
        arguments: [jobSolver, thirdParty],
    });

    const deployReceipt = await deployTransaction.send({
        from: accounts[0],
        gas: 1500000,
        gasPrice: '30000000000',
    });

    const contractInstance = new web3.eth.Contract(contractABI, deployReceipt.options.address);
    console.log('Contract deployed at:', contractInstance.options.address);

    return contractInstance;
}

// Example usage
(async () => {
    const contractInstance = await deployContract();

    // Job poster posts a job
    await contractInstance.methods.postJob('JobVerificationCode123').send({ from: accounts[0] });

    // Job solver submits work
    await contractInstance.methods.submitWork('JobSolverWork123').send({ from: accounts[1] });

    // Third party verifies the work
    await contractInstance.methods.verifyWork('JobVerificationCode123').send({ from: accounts[2] });

    // Job poster completes the contract
    await contractInstance.methods.completeContract().send({ from: accounts[0] });
})();
