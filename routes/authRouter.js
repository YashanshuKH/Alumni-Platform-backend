const path =require('path')

const express=require('express')
const authRouter=express.Router()

const authController=require("../Controllers/authController")

// authRouter.post("/login",authController.getLogin)
authRouter.post("/login",authController.postLogin)
authRouter.post("/signup",authController.postSignup)




module.exports=authRouter