const path =require('path')

const express=require('express')
const authRouter=express.Router()

const authController=require("../Controllers/authController")

// authRouter.post("/login",authController.getLogin)
authRouter.post("/login",authController.postLogin)
authRouter.post("/logout",authController.postLogout)
authRouter.post("/signup",authController.postSignup)
authRouter.post("/forgot-password",authController.forgotpassword)
authRouter.post("/reset-password/:token",authController.resetpassword)
authRouter.post("/verifyemail",authController.verifyemail);




module.exports=authRouter