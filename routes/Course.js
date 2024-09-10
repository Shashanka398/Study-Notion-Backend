const express = require("express")
const router = express.Router()

//Route for :- createCourse , Section(add, update, delete) , Subsection(add, update, delete), getAllCourses, getCoursesDetails;
//Route for :- createCategory , showAllCategories , getCategoryPageDetails
//Route for :-  createRating , getAverageRating , getReviews
//Route for :- updateCourseProgress

 
const {createCourse,  showAllCourses,  getCourseDetails,  getFullCourseDetails, editCourse, getInstructorCourses,  deleteCourse,getEnrolledCourses} = require("../contollers/Course")               // Course contollers Import
const {showAllCategories, createCategory, categoryPageDetails, } = require("../contollers/Category")      // Categories contollers Import
const {createSection,  updateSection,  deleteSection, } = require("../contollers/Section")                // Sections contollers Import
const {createSubSection, updateSubSection,  deleteSubSection, } = require("../contollers/Subsection")     // Sub-Sections contollers Import
const {createRating,  getAverageRating, getAllRating, } = require("../contollers/RatingAndReview")        // Rating contollers Import
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")                          // Importing Middlewares
const {updateCourseProgress } = require("../contollers/CourseProgress");

const {createTag} =require("../contollers/Tags")


// ********************************************************************************************************
//                                      Course routes (only by Instructors)                               *
// ********************************************************************************************************
router.post("/createCourse", auth, isInstructor, createCourse)                            // Courses can Only be Created by Instructors
router.post("/addSection", auth, isInstructor, createSection)                            //Add a Section to a Course
router.post("/updateSection", auth, isInstructor, updateSection)                         // Update a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)                         // Delete a Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)                   // Edit Sub Section
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



// ********************************************************************************************************
//                                      Category routes (Only by Admin)                                   *
// ********************************************************************************************************
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)


// ********************************************************************************************************
//                                      Rating and Review (only by Student)                               *
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)


// ********************************************************************************************************
//                                      Tags routes (Only by Admin)                                   *
// ********************************************************************************************************
router.post("/createTag", auth, isAdmin, createTag)

module.exports = router