const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const otpTemplate=require("../mail/templates/emailVerificationTemplate")
const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
}) 

//to send mail
async function sendVerificationEmail(email,otp){
    console.log(otp,"Entered model")
    try{
        const body=otpTemplate(otp)
        const mailResponse= await mailSender(email,"Verification email from studyNotion",body)
        console.log("Email Sent Successfully",mailResponse)
    }
    catch(error){
        console.log("Error in sendVerification")
        console.log(error)
        throw error
    }
}

otpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);

    next();
})
module.exports=mongoose.model("Otp",otpSchema)