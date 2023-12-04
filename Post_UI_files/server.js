// server.js
const express = require('express');
const path = require('path');
const Web3 = require('web3');
const { abi, evm } = require('./FreelanceContract.json'); // Replace with your actual contract ABI and bytecode

const app = express();
const port = 3000;

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); // Replace with your actual Ethereum node URL
const contractAddress = '0x123...'; // Replace with your deployed contract address
const freelanceContract = new web3.eth.Contract(abi, contractAddress);

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/postJob', async (req, res) => {
  const { amount, jobDescription, verificationCode } = req.body;

  // Call the postJob function on the contract
  const accounts = await web3.eth.getAccounts();
  await freelanceContract.methods.postJob(verificationCode, amount).send({ from: accounts[0] });

  // Server logic for handling amount, jobDescription, etc.
  console.log('Job Posted:', { amount, jobDescription, verificationCode });

  res.send('Job Posted Successfully');
});

app.get('/viewContracts', (req, res) => {
  // Fetch and display all contracts for job solvers
  // Server logic to retrieve contracts and display them in HTML
  res.sendFile(path.join(__dirname, 'public', 'viewContracts.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});