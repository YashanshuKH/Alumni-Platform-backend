const Reset_Email_Template = require("../libs/ResetTemplate.js");
const transporter  = require("./email.config.js");

const SendResendMail = async (email ,firstname ,resetLink)=>{
    try{
        const response = await transporter.sendMail({
            from:'"Yashanshu" <yashanshukhandelwal272011@gmail.com>',
            to :email,
            subject:"Reset your Password",
            text:"Reset your Password",
            html:Reset_Email_Template(firstname ,resetLink),
        });
        console.log('email Sent successfully',response)
    } catch (error){
        console.log(error);
    }
}
module.exports = SendResendMail;