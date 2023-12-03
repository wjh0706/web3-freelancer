// File: FreelanceContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceContract {
    address public jobPoster;
    address public jobSolver;
    address public thirdParty;

    string public jobVerificationCode;
    string public jobSolverWork;

    uint public specifiedPaymentAmount;
    bool public paymentReleased;

    enum ContractState { Created, JobPosted, Verified, PaymentDone }
    ContractState public contractState;

    event JobPosted(address indexed jobPoster, uint256 amount);
    event WorkSubmitted(address indexed jobSolver);
    event VerificationCompleted(address indexed thirdParty);
    event PaymentReleased(address indexed jobSolver, uint256 amount);
    event ContractCompleted(address indexed jobPoster, address indexed jobSolver, address indexed thirdParty);

    modifier onlyJobPoster() {
        require(msg.sender == jobPoster, "Only job poster can call this function");
        _;
    }

    modifier onlyJobSolver() {
        require(msg.sender == jobSolver, "Only job solver can call this function");
        _;
    }

    modifier onlyThirdParty() {
        require(msg.sender == thirdParty, "Only third party can call this function");
        _;
    }

    modifier inState(ContractState _state) {
        require(contractState == _state, "Invalid contract state");
        _;
    }

    constructor() {
        contractState = ContractState.Created;
        paymentReleased = false;
    }

    function setThirdParty(address _thirdParty) external {
        thirdParty = _thirdParty;
    }

    function postJob(string memory _verificationCode, uint _amount) public payable inState(ContractState.Created) {
        jobPoster = msg.sender;
        jobVerificationCode = _verificationCode;
        specifiedPaymentAmount = _amount;
        contractState = ContractState.JobPosted;
        emit JobPosted(jobPoster, specifiedPaymentAmount);
    }

    function submitWork(string memory _work) external inState(ContractState.JobPosted) {
        jobSolverWork = _work;
        jobSolver = msg.sender;
        emit WorkSubmitted(jobSolver);
    }

    function verifyWork(string memory _verificationCode) external onlyThirdParty inState(ContractState.JobPosted) {
        require(keccak256(abi.encodePacked(_verificationCode)) == keccak256(abi.encodePacked(jobVerificationCode)), "Your submission does not meet the requirements...");
        contractState = ContractState.Verified;
        require(!paymentReleased, "Payment already released");
        paymentReleased = true;
        payable(jobSolver).transfer(specifiedPaymentAmount);
        contractState = ContractState.PaymentDone;
        emit PaymentReleased(jobSolver, specifiedPaymentAmount);
    }

    function cancelJob() public onlyJobPoster inState(ContractState.JobPosted) {
        require(!paymentReleased, "Payment already released");
        contractState = ContractState.Verified;
        paymentReleased = true;
        payable(jobPoster).transfer(specifiedPaymentAmount);
        contractState = ContractState.PaymentDone ;
        emit PaymentReleased(jobSolver, specifiedPaymentAmount);
    }
}

