const  Verification_Email_Template  = require("../libs/EmailTemplate.js");
const transporter  = require("./email.config.js");

 const SendVerificationCode = async (email , verificationCode ,name)=>{
    try{
        const response = await transporter.sendMail({
            from:'"Yashanshu" <yashanshukhandelwal272011@gmail.com>',
            to :email,
            subject:"Verify your email",
            text:"Verify your email",
            html:Verification_Email_Template(name ,verificationCode),
        });
        console.log('email Sent successfully',response)
    } catch (error){
        console.log(error);
    }
}
module.exports = SendVerificationCode;