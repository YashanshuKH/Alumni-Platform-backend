const express = require('express');
const DB_PATH="mongodb+srv://yashanshukhandelwal272011:Yashanshu@yashanshu.m7cldnh.mongodb.net/FinFlow?retryWrites=true&w=majority&appName=Yashanshu";
const { default: mongoose } = require('mongoose');


const app=express();
app.use(authRouter)



const PORT=3000;
mongoose.connect(DB_PATH).then(()=>{
    console.log('Connected to Mongo');
    app.listen(PORT,()=>{
    console.log(`Server running at http://localhost:${PORT}`);
});
}).catch(err=>{
    console.log("Error while connecting",err)
})