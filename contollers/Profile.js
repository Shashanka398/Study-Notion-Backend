const Profile=require("../models/Profile")
const User= require("../models/User")

//explore->how to schedule datele after 5days automatically (crowjob)
exports.updatedProfile=async(req,res)=>{
    try{
        //get data
        const {dateOfBirth="",about="",contact,gender}=req.body
        //get userId
        const id=req.user.id
        //validation
        if(!contact || !gender || !id){
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            })
        }
        //find profile
        const userDetails=await User.findById(id)
        const  profileId=userDetails.additionalDetails
        const profileDetails=await Profile.findById(profileId)
        //update profile
        profileDetails.dateOfBirth=dateOfBirth
        profileDetails.about=about
        profileDetails.contact=contact
        profileDetails.gender=gender
        profileDetails.contactNumber=contact
        await profileDetails.save();
        //return response
        return res.status(200).json({
            success:true,
            profileDetails
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Profile not updated",
            error:error.message
        })

    }
}
//detele Account
exports.deleteAccount=async(req,res)=>{
    try{
        //get id
        const id= req.user.id
        //validation
        const userDetails= await User.findById(id)
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User not found'
            })

        }
         //delete profile
        //TODO :HW unenroll user form all enrolled courses
       
        await Profile.findByIdAndDelete({id:userDetails.additionalDetails})
        //delete user
        await User.findByIdAndDelete({_id:id})
        
        //return response
        return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:'User cannot be deleted'
        })
    }
}

exports.getAllUserDetails=async(req,res)=>{
    try{
        const id=req.user.id
        if(!id){
            return res.status(404).json({
                success:false,
                message:'User not found'
            })
        }
        const userDetails= await User.findById(id).populate("additionalDetails").exec()
        return res(200).json({
            success:true,
            message:'User found successfully!!',
            userDetails
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}