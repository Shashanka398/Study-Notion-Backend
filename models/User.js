const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        validate: {
            validator: function(value) {
                // Basic email validation regex
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: props => `${props.value} is not a valid email address!`
        }

    },
    password:{
        type:String,
        required:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"Profile"

    },
    courses:[{
        type:mongoose.Schema.ObjectId,
        ref:"Course"
    }],
    image:{
        type:String,
        required:true
    },
    token:{
        type:String
    },
    resetPasswordExpires:{
        type:Date
    },
    courseProgress:[
        {
            type:mongoose.Schema.ObjectId,
            ref:"CourseProgress"
        }
    ] 
},
)

module.exports=mongoose.model("User",userSchema)