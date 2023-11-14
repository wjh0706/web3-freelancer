// File: FreelanceContract.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FreelanceContract {
    address public jobPoster;
    address public jobSolver;
    address public thirdParty;

    string public jobVerificationCode;
    string public jobSolverWork;

    enum ContractState { Created, JobPosted, WorkSubmitted, Verified, Completed }
    ContractState public contractState;

    event JobPosted(address indexed jobPoster);
    event WorkSubmitted(address indexed jobSolver);
    event VerificationCompleted(address indexed thirdParty);
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

    constructor(address _jobSolver, address _thirdParty) {
        jobPoster = msg.sender;
        jobSolver = _jobSolver;
        thirdParty = _thirdParty;
        contractState = ContractState.Created;
    }

    function postJob(string memory _verificationCode) external onlyJobPoster inState(ContractState.Created) {
        jobVerificationCode = _verificationCode;
        contractState = ContractState.JobPosted;
        emit JobPosted(jobPoster);
    }

    function submitWork(string memory _work) external onlyJobSolver inState(ContractState.JobPosted) {
        jobSolverWork = _work;
        contractState = ContractState.WorkSubmitted;
        emit WorkSubmitted(jobSolver);
    }

    function verifyWork(string memory _verificationCode) external onlyThirdParty inState(ContractState.WorkSubmitted) {
        require(keccak256(abi.encodePacked(_verificationCode)) == keccak256(abi.encodePacked(jobVerificationCode)), "Verification code mismatch");
        contractState = ContractState.Verified;
        emit VerificationCompleted(thirdParty);
    }

    function completeContract() external onlyJobPoster inState(ContractState.Verified) {
        contractState = ContractState.Completed;
        emit ContractCompleted(jobPoster, jobSolver, thirdParty);
    }
}
