const FreelanceContract = artifacts.require("FreelanceContract");

contract("FreelanceContract", (accounts) => {
    let freelanceContract;
    const jobPoster = accounts[0];
    const jobSolver = accounts[1];
    const thirdParty = accounts[2];
    const verificationCode = "testcode123";
    const workDescription = "testwork";
    const specifiedPaymentAmount = web3.utils.toWei("1", "ether");

    before(async () => {
        freelanceContract = await FreelanceContract.new({ from: jobPoster });
    });

    it("should set a third party", async () => {
        await freelanceContract.setThirdParty(thirdParty, { from: jobPoster });
        const storedThirdParty = await freelanceContract.thirdParty.call();
        assert.equal(storedThirdParty, thirdParty, "Third party was not set correctly");
    });

    it("should allow job poster to post a job", async () => {
        await freelanceContract.postJob(verificationCode, specifiedPaymentAmount, { from: jobPoster, value: specifiedPaymentAmount });
        const storedVerificationCode = await freelanceContract.jobVerificationCode.call();
        const storedPaymentAmount = await freelanceContract.specifiedPaymentAmount.call();
        assert.equal(storedVerificationCode, verificationCode, "Verification code was not set correctly");
        assert.equal(storedPaymentAmount, specifiedPaymentAmount, "Payment amount was not set correctly");
    });

    it("should allow job solver to submit work", async () => {
        await freelanceContract.submitWork(workDescription, { from: jobSolver });
        const storedWorkDescription = await freelanceContract.jobSolverWork.call();
        assert.equal(storedWorkDescription, workDescription, "Work description was not set correctly");
    });

    it("should allow third party to verify work and release payment", async () => {
        const initialBalance = new web3.utils.BN(await web3.eth.getBalance(jobSolver));
        await freelanceContract.verifyWork(verificationCode, { from: thirdParty });
        const newBalance = new web3.utils.BN(await web3.eth.getBalance(jobSolver));
        const paymentReleased = await freelanceContract.paymentReleased.call();

        assert(paymentReleased, "Payment was not released");
        assert(newBalance.gt(initialBalance), "Payment was not received by job solver");
    });

});
