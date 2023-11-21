# web3-freelancer
e6998-fa23

auth part: https://github.com/wjh0706/web3-auth


Make sure to update the Ethereum node URL, contract JSON file path, and adjust the deployment and interaction process based on your application's requirements. 
Also, consider implementing proper error handling and security measures based on your use case.

To create a complete web application, you'll need additional files such as a backend server to handle the interaction with the Ethereum blockchain, 
a package.json file for managing dependencies, and potentially some CSS for styling. Below, I'll provide a basic example with a Node.js backend using Express.

Node.js Backend (server.js):

Package.json:
Create a file named package.json in your project root with the following content:
json
Run npm install in your terminal to install the required dependencies.

CSS (style.css):
Create a CSS file (e.g., style.css) for styling:

Ensure you replace 'YOUR_CONTRACT_ADDRESS' with the actual address where your Solidity smart contract is deployed. After setting up these files, you can run your Node.js server using npm start and access the application at http://localhost:3000 in your browser. This is a basic example, and you may need to adapt it based on your specific requirements and security considerations.


STEPS : 

Steps :
1. Server deploys the web3 contract. 
2. In an html file, on a single row, server displays the deployed web3 contract's address, a box to accept amount number input, a box to accept job description input, a box to accept job verification code url and a submit button.
3. When the submit button is clicked, the postJob function is called BY THE CLIENT with all the relevant arguments and a verification code that the client only decides.
4. The amount and job description input is sent to the server. The verification code is NOT sent to server (it is needed to ensure secure verification of job).
5. All the contracts for which job is posted, are displayed on a different html file on a different url, which the job solver sees. In this html file, on every row, there is the contract address, a text box to take solution file url (text field), and a submit button.
6. When the job solver clicks submit, the submitWork contract function is called by the job solver client only.
7. The server receives the solution url input from job solver. 
8. The server then calls the verifyWork function.
9. On seeing the contract state change to Verified, the job poster client calls the paymentReleaser function.