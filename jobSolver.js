// public/jobSolver.js
const web3 = new Web3(Web3.givenProvider);

async function submitWork(contractAddress, solutionUrl) {
  // Get the contract instance
  const contract = new web3.eth.Contract(contractAbi, contractAddress);

  // Call the submitWork function on the contract
  const accounts = await web3.eth.getAccounts();
  await contract.methods.submitWork(solutionUrl).send({ from: accounts[0] });

  // Redirect or perform additional actions after submitting the work
  // For example, redirect to a success page
  window.location.href = '/workSubmitted.html';
}
