const mongoose=require("mongoose");
require("dotenv").config();
exports.connect=()=>{
    mongoose.connect(process.env.MONGOOSE_URL,{
        userNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>console.log("DB connected successfully"))
    .catch((error)=>{
        console.log("DB failed to connect");
        console.error(error);
        process.exit(1);
    })
}