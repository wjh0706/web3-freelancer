//web3-lib.js
const { Web3 } = require("web3");
const fs = require("fs");
// const solc = require("solc");
// const { spawn } = require("child_process");

// const deploy = async () => {
//   setTimeout(() => {
//     console.log('After 5 seconds');
//   }, 5000);
//   const command = "truffle";
//   const args = ["migrate", "--network", "development"];

//   const childProcess = spawn(command, args, {
//     cwd: "./src/contract",
//     shell: true,
//   });

//   let output = "";

//   childProcess.stdout.on("data", (data) => {
//     output += data.toString();
//   });

//   childProcess.stderr.on("data", (data) => {
//     output += data.toString();
//   });

//   childProcess.on("close", (code) => {
//     if (code === 0) {
//       console.log("Command executed successfully.");
//       console.log("Output:", output);
//     } else {
//       console.error(`Command failed with code ${code}`);
//       console.error("Output:", output);
//     }
//     const regex = /contract address:\s+(\w+)/;
//     const match = output.match(regex);

//     const add = match ? match[1] : null;
//     fs.writeFileSync('contract-address.txt', add);
//     console.log("Contract Address:", add);
//   });
// };

const bytecode = fs.readFileSync("./src/contract/bytecode.bin").toString();
const abi = JSON.parse(fs.readFileSync("./src/contract/abi.abi"));
const contractAddress = fs.readFileSync('contract-address.txt').toString();

console.log("Read Contract Address:", contractAddress);

const web3 = new Web3(Web3.givenProvider || "http://ganache-cli:8545");
const contract = new web3.eth.Contract(abi, contractAddress);

module.exports = {
  web3:web3,
  bytecode,
  abi,
  contract,
  contractAddress:contractAddress,
  //deploy,
};
