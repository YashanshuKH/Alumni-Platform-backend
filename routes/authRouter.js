const path =require('path')

const express=require('express')
const authRouter=express.Router()

const authController=require("../Controllers/authController");

authRouter.get("/check",authController.checking)
authRouter.post("/login",authController.postLogin)
authRouter.post("/logout",authController.postLogout)
authRouter.post("/signup",authController.postSignup)
authRouter.post("/forgot-password",authController.forgotPassword)
authRouter.post("/reset-password/:token",authController.resetPassword)
authRouter.post("/verifyemail",authController.verifyEmail);
authRouter.post("/ResendOtp",authController.resendOtp);





module.exports=authRouter