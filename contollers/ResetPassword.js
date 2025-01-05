const User= require("../models/User")
const mailSender=require("../utils/mailSender")
const bycrpt =require("bcrypt")
//resetPasswordToken
exports.resetPasswordToken=async(req,res)=>{
    try{
        //get email from req body
        const email=req.body.email
        //check user for email,email verification
        const user=await User.findOne({email:email})
        if(!user){
            return res.json({succcess :fasle,message:"Email not registred"})
        }
        
        //genreate token
        const token =crypto.randomUUID()
         //update user by adding toekn and experation date
   
        const updatedDetails=await User.findOneAndUpdate({email:email},{
            token:token,
            resetPasswordExpires:Date.now()+5*60*1000
        },{new:true})//{new:true} updated with in response
        // create url
        const url=`https:/localhost:3000/update-password/${token}`
        await mailSender(email,
            "Password reset link",
            `Password reset link: ${url}`)

        return res.status.json({
            success:true,
            message:"Reset link sent to email please check"
        })


    }
    catch(err){
        console.error(err)
        return res.status(401).json({
            success:"fasle",
            message:"Error while creating new password"
        })
    }
}

//resetPassword 
exports.resetPassword = async (req,res)=>{
    try{
        //data fetch
        const {password,confirmPassword,token}=req.body;
        //validation
        if(password!==confirmPassword){
            return res.status(401).json({
                success:"fasle",
                message:"Password is not matching"
            })

        }
        //get user details using token
        debugger
        const userDetails=await User.findOne({token:token})
         //if no entry-invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:'Token is invalid'
            })
        }
        //token time
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:'Session time out .Please creating again!!'
            })

        } 
        //hash pass
        const hashedPassword=await bycrpt.hash(password,10)
        await User.findOneAndUpdate({toke:token},{password:hashedPassword},{new:true})
        //pass update
        return res.status(200).json({
            success:true,
            message:"Password reseted successfull!!!"
        })

    }catch(err){
        console.error(error)
        return res.status(401).json({
            success:false,
            message:"Error while creating password"
        })

    }
}