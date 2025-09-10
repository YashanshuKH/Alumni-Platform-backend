const path =require('path')

const express=require('express')
const authRouter=express.Router()

const authController=require("../Controllers/authController")

authRouter.get("/login",authController.getLogin)
authRouter.post("/signup",authController.postSignup)



module.exports=authRouter