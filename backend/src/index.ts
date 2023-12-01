import mongoose from "mongoose";
import { app } from "../app";
import { User } from "./auth/models/user-model";

const start = async () => {
    console.log('Backend Service is Starting...');

    //auth service

    // Check for JWT_KEY environment variable.
    if(!process.env.JWT_KEY){
        throw new Error('JWT_KEY must be defined.');
    }

    // Check for MONGO_URI environment variable 
    if(!process.env.MONGO_URI){
        throw new Error('MONGO_URI must be defined.');
    }

    try{
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log('Connected to MongoDB');
        await User.deleteMany({});
        console.log('DB init');
        
    }
    catch (err){
        //throw new DatabaseConnectionError();
        console.log('db error');
    }

    // Initialize the server listening on PORT 3001
    app.listen(3001, () => {
        console.log('Auth-Service Server Listening on Port 3001')
    })
}

start();