const express = require("express")
const router = express.Router()


// Routes for deleteprofile , updateprofile ,getuserdetails , getEnrolledCourse , updateDisplayPicture;


const { auth, isInstructor } = require("../middlewares/auth")
const {deleteAccount, updatedProfile, getAllUserDetails, updateDisplayPicture,  getEnrolledCourses, instructorDashboard,updateBasicDetails} = require("../contollers/Profile")
   console.log("Entered profile route")
    
// ********************************************************************************************************
//                                      Profile routes                                                    *
// ********************************************************************************************************
router.delete("/deleteProfile", auth, deleteAccount)                        // Delet User Account
router.put("/updateProfile", auth, updatedProfile)
router.put('/updateBasicDetails',auth,updateBasicDetails)
router.get("/getUserDetails", auth, getAllUserDetails)
router.get("/getEnrolledCourses", auth, getEnrolledCourses)                  // Get Enrolled Courses
 router.put("/updateDisplayPicture", auth, updateDisplayPicture)
// router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)


module.exports = router