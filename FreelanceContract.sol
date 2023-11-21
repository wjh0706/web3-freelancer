// File: FreelanceContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceContract {
    address public jobPoster;
    address public jobSolver;
    address public thirdParty;

    string public jobVerificationCode;
    string public jobSolverWork;

    uint256 public specifiedPaymentAmount;
    bool public paymentReleased;

    enum ContractState { Created, JobPosted, WorkSubmitted, Verified, PaymentDone }
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

    constructor(address _thirdParty) {
        jobPoster = msg.sender;
        thirdParty = _thirdParty;
        contractState = ContractState.Created;
        paymentReleased = false;
    }

    function postJob(string memory _verificationCode, uint256 _amount) external onlyJobPoster inState(ContractState.Created) {
        jobVerificationCode = _verificationCode;
        specifiedPaymentAmount = _amount;
        contractState = ContractState.JobPosted;
        emit JobPosted(jobPoster, specifiedPaymentAmount);
    }

    function submitWork(string memory _work) external onlyJobSolver inState(ContractState.JobPosted) {
        jobSolverWork = _work;
        jobSolver = msg.sender;
        contractState = ContractState.WorkSubmitted;
        emit WorkSubmitted(jobSolver);
    }

    function verifyWork(string memory _verificationCode) external onlyThirdParty inState(ContractState.WorkSubmitted) {
        require(keccak256(abi.encodePacked(_verificationCode)) == keccak256(abi.encodePacked(jobVerificationCode)), stateReverter());
        contractState = ContractState.Verified;
        emit VerificationCompleted(thirdParty);
    }

    function stateReverter() internal returns (string memory){
        contractState = ContractState.JobPosted;
        return("Your submission does not meet the requirements...");
    }

    function paymentReleaser() external onlyJobPoster inState(ContractState.Verified) {
        require(!paymentReleased, "Payment already released");
        paymentReleased = true;
        payable(jobSolver).transfer(specifiedPaymentAmount);
        contractState = ContractState.PaymentDone;
        emit PaymentReleased(jobSolver, specifiedPaymentAmount);
    }
}
