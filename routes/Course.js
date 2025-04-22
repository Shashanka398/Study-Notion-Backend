const express = require("express")
const router = express.Router()

//Route for :- createCourse , Section(add, update, delete) , Subsection(add, update, delete), getAllCourses, getCoursesDetails;
//Route for :- createCategory , showAllCategories , getCategoryPageDetails
//Route for :-  createRating , getAverageRating , getReviews
//Route for :- updateCourseProgress

 
const {createCourse,  showAllCourses,  getCourseDetails,  getFullCourseDetails, editCourse, getInstructorCourses,  deleteCourse,getEnrolledCourses} = require("../contollers/Course")               // Course contollers Import
const {showAllCategories, createCategory, categoryPageDetails, } = require("../contollers/Category")      
const {createSection,  updateSection,  deleteSection, } = require("../contollers/Section")               
const {createSubSection, updateSubSection,  deleteSubSection, } = require("../contollers/Subsection")     
const {createRating,  getAverageRating, getAllRating, } = require("../contollers/RatingAndReview")      
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")                          
const {updateCourseProgress } = require("../contollers/CourseProgress");

const {createTag} =require("../contollers/Tags")



router.post("/createCourse", auth, isInstructor, createCourse)                            
router.post("/addSection", auth, isInstructor, createSection)
router.post("/updateSection", auth, isInstructor, updateSection)                         
router.post("/deleteSection", auth, isInstructor, deleteSection)                         
router.post("/updateSubSection", auth, isInstructor, updateSubSection)                 
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.get("/getAllCourses", showAllCourses)                                               // Get all Registered Courses
router.post("/getCourseDetails", getCourseDetails)    
router.get("/getEnrolledCourses",auth,getEnrolledCourses)                                    // Get Details for a Specific Courses

// router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// router.post("/editCourse", auth, isInstructor, editCourse)                              // Edit Course routes
// router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)           // Get all Courses Under a Specific Instructor
// router.delete("/deleteCourse", deleteCourse)                                            // Delete a Course
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);



router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

router.post("/createTag", auth, isAdmin, createTag)

module.exports = router