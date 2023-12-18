
const jwt=require("jsonwebtoken")
require("dotenv").config()
const User=require("../models/User")
//auth
exports.auth=async(req,res,next)=>{
    try{
        const token=req.cookies.token || req.body.token | req.header("Authorisation".replace("Bearer ",""));
        if(!token){
            return res.status(401).json({
                 success:false,
                 messgae:"Token is Missing"
            })
        }
        try{
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;

        }
        catch(err){
            return res.status(401).json({
                success:false,
                messgae:"Token is Invalid"
           })

        }
        next();

    }
    catch(error){
        return res.status(401).json({
            success:false,
            messgae:"Something went wrong while validatin token"
       })

    }
}
//isStudent
exports.isStudent=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Student")
        {
            return res.status(401).json({
                success:false,
                messgae:"This is protected route for Students Only"
           })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            messgae:"Something went wrong while validatin token"
       })

    }
    
}

//isInstructor
exports.isInstructor=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor")
        {
            return res.status(401).json({
                success:false,
                messgae:"This is protected route for Instructor Only"
           })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            messgae:"Something went wrong while validatin token"
       })

    }
    
}

//isAdmin
exports.isInstructor=async (req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin")
        {
            return res.status(401).json({
                success:false,
                messgae:"This is protected route for Admin Only"
           })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            messgae:"Something went wrong while validatin token"
       })

    }
    
}
