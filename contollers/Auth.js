const User=require("../models/User");
const Otp=require("../models/Otp")
const Profile=require("../models/Profile")
const otpGenerator=require('otp-generator')
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
//sendOtp
exports.sendOtp=async(req,res)=>{
    //fetch email from reuest body
    try{
        const{email}=req.body;
        //check if user exit
        const checkUserPresent=await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:'User already registered!!'
            })
        } 
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        console.log("Otp is:",otp);
        //check uniwque otp or not
        const result =await Otp.findOne({otp:otp});
        while(result){
            otp=otpGenerator(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
            });
            result=await Otp.findOne({otp:otp});
        }
        const otpPayload={email,otp};
        //create an entry in db before otp
        const otpBody=await Otp.create(otpPayload);
        console.log(otpBody)

        return req.status(200).json({
            success:true,
            message:'Otp sent successfully!!',
            otp
        })
    }
    catch(error){
        console.log(error);
        return req.status(500).json({
            success:fasle,
            message:error.message,
            otp
        })

        }
   

}

//signUp
exports.signUp=async (req,res)=>{
    try{
          //data fetch  from req doby
        const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp}=req.body;
        //validate email
        if(!firstName || !lastName || !email|| !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required !!"
            })
        }
        //match 2 passward
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirmed password doesnt match"
            })
        }
        //check user alread exist
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"Already email is registered"
            })

        }
        //find recent otp for the user
        const recentOtp=await Otp.find({email}).sort({createdAt:-1}).limit(1);//sort all otps according to lastest and get recent otp
        console.log("Recent otp",recentOtp);
        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:'Otp not found'
            })
        }else if(otp!==recentOtp){
            //validate otp
            return res.status(400).json({
                success:false,
                message:'Invalid Otp'
            })
        };

        //Hash password
        const hashPassword=await bcrypt.hash(password,10);
        //entry create in DB
        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        });
        const user=await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        });
        //return response
        return res.status(200).json({
            success:true,
            message:'User is registered Successfully',
            user
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:'User cannot be registered please try again',
        })
    }

}
//logIn
exports.login=async(req,res)=>{
    try{
        //get data from request body
        const {email,password}=req.body;
        //validate data
        if(!emailExist || !password){
            return res.status(403).json({
                success:false,
                message:"All fields should be filled "
            })
        }
        const user=await User.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered,please signUp"
            })

        }
        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user_id,
                accountType:user.accountType
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h"
            });
            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now()+ 3*2*60*60*1000)
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged In"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            })
        }

    }catch(error){
        return res.status(401).json({
            success:false,
            message:"Login failure please login again"
        })

    }
}
//sendOtp
//changePass
exports.changePassword=async(req,res)=>{
    //get data from req body
    //get oldPass,newPass,confirmPass
    //validation

    //update pwd in dv
    //send mail-pass 
    //return res

}

