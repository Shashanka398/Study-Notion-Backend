const mongoose=require("mongoose");

const courseProgress=new mongoose.Schema({
  courseID:{
    type:mongoose.Schema.ObjectId,
    ref:"Course"
  },
  completedVideos:[
    {
        type:mongoose.Schema.ObjectId,
        ref:"Subsection"
    }
  ]

})

module.exports=mongoose.model("CourseProgress",courseProgress)