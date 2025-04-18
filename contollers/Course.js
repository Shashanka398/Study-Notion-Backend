const Course = require("../models/Course");
const Tag = require("../models/Tags");
const User = require("../models/User");
const Category=require('../models/Category')
const uploadImageToCloudinary=require('../utils/imageUploader')

//createCourse handler function

exports.createCourse = async (req, res) => {
  try {
    //fetch data
    console.log( req.body,"Course Body")
    const { courseName, courseDescription, whatYouWillLearn, price, tag,status,category } =
      req.body;
    //get thumbnail
    const thumbnail = req.files.thumbnailImage;
    console.log( req.files.thumbnailImage,"thumbnail")
    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !tag ||
      !thumbnail || !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    //check for instructore
    const userId = req.user.id;
    console.log(req.user,"---USER-ID---")
    const instructorDetails = await User.findById(userId);
    console.log("--User Details",instructorDetails)
    //TODO:Verify that user id and instroctor  id is same
    if (!instructorDetails) {
      return res.status(400).json({
        success: false,
        message: "Instructor details not found",
      });
    }
    //check tag is given valid
    const tagDetails = await Tag.findById(tag);
    if (!tagDetails) {
      return res.status(400).json({
        success: false,
        message: "Tag details is not found",
      });
    }
    console.log(tagDetails,"tagDetails")
    //check if category is valid
     const categoryDetails = await Category.findById(category)
    if(!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category Details Not Found",
      })
    }

    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails.id,
      whatYouWillLearn: whatYouWillLearn,
      tag: ['66df28cd34c756991a0de3cb'],
      thumbnail: thumbnailImage.secure_url,
      category:categoryDetails._id
    });

    //add the new course to user schema
    await User.findByIdAndUpdate(
      {
        _id: instructorDetails._id,
      },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //update the Tag ka schema
    await Tag.findByIdAndUpdate(
        {
            _id:tagDetails._id
        },
        {
            $push:{
                course:newCourse._id
    
            }

        },
        {
            new:true
        }
       
    )
    //update the category schema
    await Category.findByIdAndUpdate(
      {
        _id:categoryDetails._id
      },
      {
        $push:{
            courses:newCourse._id
        }
      }
    )

    return res.status(200).json({
      success: true,
      message: "Course created Successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
      error: error.message,
    });
  }
};

exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      {},
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
      }
    ).populate(
      {
        path:"instructor",
        populate:{
          path:"additionalDetails",
          path:"courses"
        }
      }
     ).exec()
    return res.status(500).json({
        success: true,
        message: "data for all course fetched successfully",
        data:allCourses
      });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch course",
      error: error.message,
    });
  }
};


//getCourseDetails

exports.getCourseDetails=async(req,res)=>{
  try{
    //get id
    const {courseId}=req.body
    //find course details
    const courseDetails=await Course.find({_id:courseId}).populate(
                                    {
                                      path:"instructor",
                                      populate:{
                                        path:"additionalDetails"
                                      }
                                    }
                                   )
                                   .populate("category")
                                   .populate("ratingAndReviews")
                                   .populate(
                                    {
                                      path:"courseContent",
                                      populate:{
                                        path:"subSection"
                                      }
                                    }
                                   ).exec()

      if(!courseDetails){
        return res.status(400).json({
          success:false,
          message:`Could not find the course with ${courseId}`
        })
      }

      return res.status(200).json({
        success:true,
        message:"Course details fetched sucesfully",
        data:courseDetails

      })


  }catch(er){
    return res.status(500).json({
      success:false,
      message:"Course details could not fetched "+er.message

    })
  }
}

exports.getEnrolledCourses=

