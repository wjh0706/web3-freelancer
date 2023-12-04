const express = require("express");
const { currentUser } = require("../../common/middleware/current-user");
const { web3 } = require("../../common/web3-lib");
const router = express.Router();

router.get("/api/auth/user", currentUser, async (req, res) => {
  var balanceEth = 0;
  if (req.currentUser) {
    const balanceWei = await web3.eth.getBalance(req.currentUser.address);
    // Convert Wei to Ether
    balanceEth = web3.utils.fromWei(balanceWei, "ether");
  }
  res.send({
    currentUser: req.currentUser || null,
    balanceEth: balanceEth,
  });
});

module.exports = { UserRouter: router };
