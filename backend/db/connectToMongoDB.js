import mongoose from "mongoose";
// require("dotenv").config();

const connectToMongoDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB Successfully Connected");
    }catch(error){
        console.log("Error while connecting to MongoDB", error.message);
    }
}
export default connectToMongoDB;