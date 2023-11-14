const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Web3 = require('web3');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Use Multer to handle file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Connect to your Ethereum node
const web3 = new Web3('http://localhost:8545');

// Load the compiled contract ABI and address
const contractJSON = JSON.parse(fs.readFileSync('FreelanceContract.json', 'utf8'));
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your deployed contract address
const contractABI = contractJSON.abi;

const contractInstance = new web3.eth.Contract(contractABI, contractAddress);

// Handle POST request from the HTML form
app.post('/submitJob', upload.single('jobVerificationFile'), async (req, res) => {
    const { jobPosterAddress, jobVerificationCode } = req.body;
    const jobVerificationFileContent = fs.readFileSync(req.file.path, 'utf8');

    // Use web3.js to interact with the smart contract
    // Call the relevant smart contract methods with the entered data

    // Example: You can call your contract methods here

    console.log('Job Poster Address:', jobPosterAddress);
    console.log('Job Verification Code:', jobVerificationCode);
    console.log('Job Verification File Content:', jobVerificationFileContent);

    // Reset the form after successful submission
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
