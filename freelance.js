// =================== CS251 DEX Project =================== // 
//        @authors: Simon Tao '22, Mathew Hogan '22          //
// ========================================================= //                  

// sets up web3.js
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
const balanceWei = await web3.eth.getBalance(accountAddress);



// =============================================================================
//         ABIs and Contract Addresses: Paste Your ABIs/Addresses Here
// =============================================================================

// TODO: Paste your freelance address and ABI here
const freelance_abi = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "jobPoster",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "jobSolver",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "thirdParty",
				"type": "address"
			}
		],
		"name": "ContractCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "jobPoster",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "JobPosted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "jobSolver",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "PaymentReleased",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "thirdParty",
				"type": "address"
			}
		],
		"name": "VerificationCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "jobSolver",
				"type": "address"
			}
		],
		"name": "WorkSubmitted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "contractState",
		"outputs": [
			{
				"internalType": "enum FreelanceContract.ContractState",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "jobPoster",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "jobSolver",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "jobSolverWork",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "jobVerificationCode",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "paymentReleased",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_verificationCode",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "postJob",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_thirdParty",
				"type": "address"
			}
		],
		"name": "setThirdParty",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "specifiedPaymentAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_work",
				"type": "string"
			}
		],
		"name": "submitWork",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "thirdParty",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_verificationCode",
				"type": "string"
			}
		],
		"name": "verifyWork",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];
const freelance_address = '0xf5b48Ca1e39Cb3DcABa6901C1A5A1ABAb196E91f';                
const freelance_contract = new web3.eth.Contract(freelance_abi, freelance_address);





// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the below functions

/*** INIT ***/
async function init() {
    await freelance_contract.methods.setThirdParty(accounts[accounts.length - 1]).send({
        from: web3.eth.defaultAccount,
        gas: 999999,});
}

// This is a log function, provided if you want to display things to the page instead of the
// JavaScript console. It may be useful for debugging but usage is not required.
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
    $("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}

// ============================================================
//                    FUNCTIONS TO IMPLEMENT
// ============================================================

// Note: maxSlippagePct will be passed in as an int out of 100. 
// Be sure to divide by 100 for your calculations.

/*** ADD LIQUIDITY ***/
async function post_job(verification_code, amountEth) {
    /** TODO: ADD YOUR CODE HERE **/
    await freelance_contract.methods.postJob(verification_code, amountEth).send({
        from: web3.eth.defaultAccount,
        value: amountEth,
        gas: 999999,});
    log("Received payment", { AmountETH: amountEth});
}

/*** REMOVE LIQUIDITY ***/
async function solve_job() {
    /** TODO: ADD YOUR CODE HERE **/
    await freelance_contract.methods.submitWork("Placeholder for work link").send({
        from: web3.eth.defaultAccount,
        gas: 999999,});
    log("Submitted work", { WorkLink: "Placeholder for work link"});

}

async function verify_job() {
    const fs = require('fs');
    // Read the content of "code.json" synchronously
    const fileContent = fs.readFileSync('verification_code.json', 'utf-8');
    const verification_code = JSON.parse(fileContent);
    // Call the removeAllLiquidity function in the smart contract
    //console.log("not Removed All Liquidity");
    console.log("hello I reached here successfully")
    await exchange_contract.methods.verifyWork(verification_code["verification_code"]).send({
        from: web3.eth.defaultAccount,
        gas: 999999,});
    console.log("Removed All Liquidity");
    log("Removed All Liquidity");
}

// =============================================================================
//                           	UI (DO NOT MOFIDY)
// =============================================================================


// This sets the default account on load and displays the total owed to that
// account.


web3.eth.getAccounts().then((response)=> {
    web3.eth.defaultAccount = response[0];
    // Initialize the exchange
    init();
});


// Allows switching between accounts in 'My Account'
web3.eth.getAccounts().then((response)=>{
    var opts = response.map(function (a) { return '<option value="'+
            a.toLowerCase()+'">'+a.toLowerCase()+'</option>' });
    $(".account").html(opts);
});

// This runs the 'swapETHForTokens' function when you click the button
$("#post-job").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  post_job($("#verification-code").val(), $("#job-amt").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'swapTokensForETH' function when you click the button
$("#solve-job").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  solve_job().then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// This runs the 'addLiquidity' function when you click the button
$("#verify-job").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  verify_job().then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});

// Fills in relevant parts of UI with your token and exchange name info:
try {
    const accounts = await web3.eth.getAccounts();
    const balancesContainer = $("#account-balances");

    // Clear previous content
    balancesContainer.html('');

    // Iterate through each account
    for (const account of accounts) {
      const balanceWei = await web3.eth.getBalance(account);

      // Convert Wei to Ether
      const balanceEth = web3.utils.fromWei(balanceWei, 'ether');

      // Create an HTML string for each account
      const accountHtml = `<p>Account: ${account}, Balance: ${balanceEth} ETH</p>`;
      
      // Append the HTML string to the container
      balancesContainer.append(accountHtml);
    }
  } 
catch (error) {
console.error('Error fetching account balances:', error);
}

$("#post-job").html("Post your job");
$("#solve-job").html("Solve your job");
$("#verify-job").html("Verify submitted job");

$("#title").html("Web3 Freelancer");
