// =================== Freelancer Project =================== // 
//        @authors: Akshay Iyer '24, Columbia University          //
// ========================================================= //                  

// sets up web3.js
const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");



// =============================================================================
//         ABIs and Contract Addresses: Paste Your ABIs/Addresses Here
// =============================================================================

// TODO: Paste your freelance address and ABI here
const freelance_abi =  [
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
		"name": "cancelJob",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"stateMutability": "payable",
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
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
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
	}
];
const freelance_address = '0x64160A86ACA91036C61E18812c1b72cA95a29b04';                
const freelance_contract = new web3.eth.Contract(freelance_abi, freelance_address);





// =============================================================================
//                              Provided Functions
// =============================================================================
// Reading and understanding these should help you implement the below functions

/*** INIT ***/
async function init(accounts) {
    console.log(accounts[accounts.length - 1])
    await freelance_contract.methods.setThirdParty(accounts[accounts.length - 1]).send({
        from: web3.eth.defaultAccount,
        gas: 999999,});
    console.log("initialisation successful");
}

// This is a log function, provided if you want to display things to the page instead of the
// JavaScript console. It may be useful for debugging but usage is not required.
// Pass in a discription of what you're printing, and then the object to print
function log(description, obj) {
    $("#log").html($("#log").html() + description + ": " + JSON.stringify(obj, null, 2) + "\n\n");
}


async function post_job(verification_code, amountEth) {

    var uintValue = parseInt(amountEth, 10);

	// Log the info for debugging
    // console.log(uintValue, verification_code, web3.eth.defaultAccount);

    // Proceed with posting the job using the smart contract
    
	await freelance_contract.methods.postJob(verification_code, uintValue).send({
		from: web3.eth.defaultAccount,
		value: uintValue,
		gas: 999999,
		type: "0x1",
	});
	console.log("Job posting successful");

}

/*** REMOVE LIQUIDITY ***/
async function solve_job() {
    /** TODO: ADD YOUR CODE HERE **/
    await freelance_contract.methods.submitWork("Placeholder for work link").send({
        from: web3.eth.defaultAccount,
        gas: 999999,
		type: "0x1",
	});
    console.log("Job submission successful");
}


async function verify_job() {
	//get all the python submissions, and run them
	//get a json file with the verification code
	//read the json file

    //const verification_code = {verification_code: "123da"};
    // Call the removeAllLiquidity function in the smart contract
    //console.log("not Removed All Liquidity");
	console.log("Verify Job called");
    try {
        const response = await fetch('http://localhost:3000/verify-job', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

		console.log("Response data:", data["verification_code"]);

        
		console.log("Preparing to call verifyWork on smart contract");
		await freelance_contract.methods.verifyWork(data["verification_code"]).send({
			from: web3.eth.defaultAccount,
			gas: 999999,
		});
		console.log("Job verification successful");
        
    } catch (error) {
        console.error("Error in job verification:", error);
    }
}

// =============================================================================
//                           	UI (DO NOT MOFIDY)
// =============================================================================


// This sets the default account on load and displays the total owed to that
// account.


web3.eth.getAccounts().then((response)=> {
    web3.eth.defaultAccount = response[0];
    const accounts = response;
    var opts = response.map(function (a) { return '<option value="'+
            a.toLowerCase()+'">'+a.toLowerCase()+'</option>' });
    $(".account").html(opts);
    // Initialize the exchange
    init(accounts);
});


$("#post-job").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  post_job($("#verification-code").val(), $("#job-amt").val()).then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});


$("#solve-job").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
  solve_job().then((response)=>{
        window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
});


$("#verify-job").click(function() {
    web3.eth.defaultAccount = $("#myaccount").val(); //sets the default account
    console.log($("#myaccount").val());
    verify_job().then((response)=>{
        // window.location.reload(true); // refreshes the page after add_IOU returns and the promise is unwrapped
    })
    
});

async function fetchAccountBalances() {
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
        balancesContainer.append(`<p>Verifier: ${accounts[accounts.length-1]}</p>`);
    } 
    catch (error) {
    console.error('Error fetching account balances:', error);
    }
}
fetchAccountBalances();
$("#post-job").html("Post your job");
$("#solve-job").html("Solve your job");
$("#verify-job").html("Verify submitted job");
$("#title").html("Web3 Freelancer");
