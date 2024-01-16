const { default: mongoose } = require("mongoose")
const {instance}=require("../config/razorpay")
const Course=require("../models/User")
const User=require("../models/User")
const mailSender=require("../utils/mailSender")
const {courseEnrollmentEmail}= require("./mail/templates/courseEnrollmentEmail")


//catpure payment and initate razorpay

exports.capturePayment=async(req,res)=>{
    try{
    //get courseId and UserId
    const {course_id}=req.body
    const userId=req.user.id
    //validate course and user
    if(!course_id){
        return res.status(404).json({
            success:false,
            message:'Provide valid course Id'
        } )
    }
    //vaild coursedetails
    let course;
    course=await Course.findById(course_id)
    if(!course){
        return res.status(404).json({
            success:false,
            message:'Course not found'
        } )

    }
    //user already paid for same course
    const uid=new mongoose.Types.ObjectId(userId)//coverting to objectid beacuse in schema(model) of course user is stored in object
    if(course.studentsEnrolled.includes(uid)){
        return res.status(200).json({
            success:false,
            message:'Student already exist'
        } )


    }
    //order create
    const amount=course.price
    const currency="INR"
    const options={
        amount:amount *100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId
        }
    }
    //return response
    try{
        const paymentResponse=await instance.orders.create(options);
         console.log(paymentResponse);

         return res.status(200).json({
            success:true,
            coursenName:course.courseName,
            courseDescriptionL:course.courseDescription,
            thumbnail:course.thumbnail,
            orderId:paymentResponse.id,
            currency:paymentResponse.currency,
            amount:paymentResponse.amount
         })

    }catch(error){
        console.log(error)
        res.json({
            success:false,
            message:"Error while creating payment"
        })

    }
    

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:'failed while payment'
        } )
    }
  
}

//verify Signature of razorpay(Webhook)
exports.verifySignature =async(req,res)=>{
    const webhookSecret="12345678"
    const signature=req.headers["x-razorpay-signature"]
    //below 3 code will convert over webhooksecrect to signature to verify
    const shasum=crypto.createHmax("sha256",webhookSecret)//hashed based message auth code (SHA secure hashing alogorithm) 
    shasum.update(JSON.stringify(req.body)) //convert to string
    const digest=shasum.digest("hex")

    if(signature===digest){
        console.log("Payement is authorized")
        const {courseId,userId}=req.body.payload.payment.entity.notes
        try{
            //fullfill action
            //find course and enroll to it
            const enrolledCourse= await Course.findOneAndUpdate({_id:courseId},{$push:{studentsEnrolled:userId}},{new:true})
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"course not found"
                })
            }
            console.log(enrolledCourse)

            //find student and add the course to student 
            const enrolledStudent =await User.findOneAndUpdate({_id:userId},{$push:{courses:courseId}},{new:true})
            console.log(enrolledStudent)
            //send mail for about buying course
            const emailResponse=await mailSender(
                enrolledStudent.email,"Congratuation for buying courses","courseEnrollmentEmail"
            )
            console.log(emailResponse)
            return res.status(200).json({
                success:true,
                message:"Signature verified and course added"
            })
        }catch(error){
            console.log(error)
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }


    }
    else{
        return res.status(400).json({
            success:false,
            message:'Invalid message in payment'
        })
    }
}