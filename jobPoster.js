// public/jobPoster.js
const web3 = new Web3(Web3.givenProvider);

async function postJob() {
  const amount = document.getElementById('amount').value;
  const jobDescription = document.getElementById('jobDescription').value;
  const verification_test_code = document.getElementById('verificationTestCode').value;


  const verification_code = "14234"
  // Get the contract instance
  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  // Call the postJob function on the contract
  const accounts = await web3.eth.getAccounts();
  await contract.methods.postJob(verification_code, amount).send({ from: accounts[0] });

  // Redirect or perform additional actions after posting the job
  // For example, redirect to the viewContracts page
  window.location.href = '/viewContracts.html';
}


