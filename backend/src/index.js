const mongoose = require("mongoose");
const { User } = require("./auth/models/user-model");
const { Project } = require("./projects/models/project");
const { app } = require("../app");

const start = async () => {
  console.log("Backend Service is Starting...");

  // Check for JWT_KEY environment variable.
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined.");
  }

  // Check for MONGO_URI environment variable
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined.");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");
    await Project.deleteMany({});
    await User.deleteMany({});
    console.log("DB init");
  } catch (err) {
    //throw new DatabaseConnectionError();
    console.log(err);
  }

  // Initialize the server listening on PORT 3001
  app.listen(3001, () => {
    console.log("Auth-Service Server Listening on Port 3001");
  });
};
start();

//console.log("Deployed contract address:", contractAddress);
