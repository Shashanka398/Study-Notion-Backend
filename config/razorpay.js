const Razorpay=require("razorpay")

exports.instance=new Razorpay({
    key_id:process.env.RAZORPAY,
    key_secret:process.env.RAZORPAY_SECRET
})