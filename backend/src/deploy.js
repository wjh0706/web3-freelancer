const util = require("util");
//const fs = require("fs");
const { spawn } = require("child_process");

//const sleep = util.promisify(setTimeout);

const deploy = async (fromAddress) => {
  console.log("Starting deployment from", fromAddress);

  // Wait for 5 seconds
  //await sleep(5000);

  return new Promise((resolve, reject) => {
    process.env.FROM_ADDRESS = fromAddress
    const command = "truffle";
    const args = ["migrate", "--network", "development"];

    const childProcess = spawn(command, args, {
      cwd: "./src/contract",
      shell: true,
      env: process.env,
    });

    let output = "";
    let contractAddress = null;
    let accountAddress = null;

    childProcess.stdout.on("data", (data) => {
      output += data.toString();

      // Extract contract address
      const regexContract = /contract address:\s+(\w+)/;
      const matchContract = output.match(regexContract);
      contractAddress = matchContract ? matchContract[1] : null;

      // Extract account address
      const regexAccount = /account:\s+(\w+)/;
      const matchAccount = output.match(regexAccount);
      accountAddress = matchAccount ? matchAccount[1] : null;
    });

    childProcess.stderr.on("data", (data) => {
      output += data.toString();
    });

    childProcess.on("close", (code) => {
      if (code === 0) {
        console.log("Command executed successfully.");
        console.log("Output:", output);

        // Log both addresses
        console.log("Contract Address:", contractAddress);
        console.log("Account Address:", accountAddress);

        // Resolve with an object containing both addresses
        resolve({ contractAddress, accountAddress });
      } else {
        console.error(`Command failed with code ${code}`);
        console.error("Output:", output);
        reject(new Error(`Command failed with code ${code}`));
      }
    });
  });
};
module.exports=({deploy})
// // Usage example
// deploy()
//   .then(({ contractAddress, accountAddress }) => {
//     console.log("Contract Address returned:", contractAddress);
//     console.log("Account Address returned:", accountAddress);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
