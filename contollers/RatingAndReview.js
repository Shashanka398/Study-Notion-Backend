const { default: mongoose } = require("mongoose");
const RatingAndReview=require(".././models/RatingAndReview")
const Course=require("../models/Course");

//creating rating

exports.createRating=async(req,res)=>{
    try{
        
        //get userId,
        const userId=req.user.id
        //fetchdata from req 
        const {courseId,rating,review}=req.body
        //check if user is enrolled or not
        const courseDetails=await Course.findOne({_id:courseId,studentsEnrolled:{$elemMatch:{$eq:userId}}})
        if(!courseDetails){
            res.status(404).json({
                success:false,
                message:'Student is not enrolled in course'
            })
        }
        //creating arating and review
        const alreadyReviewed= await RatingAndReview.findOne({
            user:userId,
            course:courseId
        })
        if(alreadyReviewed){
            res.status(403).json({
                success:false,
                message:'Course is already reviewed'
            })
        }
        //update course with rating and review
        const ratingReview=await RatingAndReview.create({
            rating,review,course:courseId,user:userId
        })

        const upadtedCourseDetails=await Course.findeByIdAndUpdate({_id:courseId},
                                       {
                                        $push:{
                                           ratingAndReview:ratingReview._id
                                        }
                                       },{new:true})
        //return res
        console.log(upadtedCourseDetails)
        return res.status(200).json({
            success:true,
            message:'Rating and review created successfully',
            ratingReview
        })

    }catch(er){
        return res.status(500).json({
            success:false,
            message:er.message,
        })

    }
  
}

//get average rating
exports.getAverageRating=async (req,res)=>{
    try{
       //get course Id
       const courseId=req.body.courseId
       //calculate avg rating
       const result=await RatingAndReview.aggregate(
        [
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseId),

                },
                $group:{
                        _id:null,
                        averageRating:{$avg:"$rating"}

                    }
            }
        ]
       )  
       if(result.legth>0){
        return res.status(200).json({
            success:true,
            averageRating:result[0].averageRating
        })
       }

       return res.status(200).json({
        success:true,
        message:"No review or rating for this course",
        averageRating:0
       })

    }catch(err){

    }
}


//get all rating and reviews
exports.getAllRating=async(req,res)=>{
    try{

    }catch(err){
        
    }
}