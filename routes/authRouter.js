const path =require('path')

const express=require('express')
const authRouter=express.Router()

const authController=require("../Controllers/authController")

authRouter.get("/check",authController.checking)
authRouter.post("/login",authController.postLogin)
authRouter.post("/logout",authController.postLogout)
authRouter.post("/signup",authController.postSignup)
authRouter.post("/forgot-password",authController.forgotpassword)
authRouter.post("/reset-password/:token",authController.resetpassword)
authRouter.post("/verifyemail",authController.verifyEmail);
authRouter.post("/ResendOtp",authController.ResendOtp);





module.exports=authRouter