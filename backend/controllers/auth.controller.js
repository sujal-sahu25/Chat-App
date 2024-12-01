import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";


export const signup = async (req,res)=>{
    try{
        const {fullName,username,password,confirmPassword,gender} =req.body;
        if(password!==confirmPassword)
        {
            return res.status(400).json({error:"Password did not match"});
        }
        const user = await User.findOne({username});
        if(user)
        {
            return res.status(400).json({error:"User already exists"});
        }
        //hash password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt);

        let profilePic;
        if(gender === "male") profilePic= `https://avatar.iran.liara.run/public/boy?username=${username}`;
        else profilePic= `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullName,
            username,
            password:hashedPassword,
            gender,
            profilePic,
        });
        if(newUser)
        {
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();
            console.log(newUser);
            res.status(200).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                profilePic:newUser.profilePic,
            })
        }
        else{
            res.status(400).json({error:"Invalid user data"});
        }
    }catch(error){
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            error:'Internal server error',
        })
    }
}

export const login = async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user||!(await bcrypt.compare(password,user.password)))
        {
            return res.status(400).json({
                error:"Invalid Username or Password",
            })
        }
        generateTokenAndSetCookie(user._id,res);
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            profilePic:user.profilePic,
        })
    }catch(error){
        console.log("Error in login controller", error.message);
        res.status(500).json({
            error:'Internal server error',
        })
    }
}

export const logout = (req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    }catch(error){
        console.log("Error in logout controller", error.message);
        res.status(500).json({
            error:'Internal server error',
        })
    }
}
