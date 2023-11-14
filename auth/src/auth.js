// web3Auth.js
//import Web3 from 'web3';
//const fs = require('fs');
const abi = [
  {
    "constant": false,
    "inputs": [],
    "name": "signup",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "isUserSignedUp",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getUserAddress",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
]
var GENESIS =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
abiDecoder.addABI(abi);
//const web3 = new Web3('http://localhost:8545'); // replace with your Ethereum node endpoint
let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

const contractAddress = '0x08abb0e4bd60daca6c94c2e0d1d0d8684ca46372'; // replace with your deployed contract address
const simpleAuthContract = new web3.eth.Contract(abi, contractAddress);

async function signup() {
    try {
        const accounts = await web3.eth.getAccounts();
        const result = await simpleAuthContract.methods.signup().send({ from: accounts[0] });
        console.log(`User signed up. Transaction hash: ${result}`);
    } catch (error) {
        console.error(error.message);
    }
}

async function signIn() {
    try {
        const accounts = await web3.eth.getAccounts();
        const isUserSignedUp = await simpleAuthContract.methods.isUserSignedUp().call({ from: accounts[0] });
        
        if (isUserSignedUp) {
            console.log("User signed in successfully.");
        } else {
            console.log("User not signed up. Please sign up first.");
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function getUserAddress() {
  try {
      const accounts = await web3.eth.getAccounts();
      const userAddress = await simpleAuthContract.methods.getUserAddress().call({ from: accounts[0] });
      return userAddress;
  } catch (error) {
      console.error(error.message);
      throw error;
  }
}

// Example usage
//signup();
//signIn();
