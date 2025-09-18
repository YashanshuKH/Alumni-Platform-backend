const Verification_Email_Template = (username ,otp_code )=>{
return (`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Email OTP Verification</title>
<style>
  body {
    background-color: #f4f4f4;
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  .container {
    max-width: 600px;
    margin: auto;
    background: #ffffff;
    padding: 20px;
    border-radius: 8px;
  }
  .header {
    text-align: center;
    padding-bottom: 10px;
  }
  .header h1 {
    color: #333333;
  }
  .content {
    font-size: 16px;
    color: #555555;
    line-height: 1.6;
  }
  .otp-box {
    font-size: 24px;
    letter-spacing: 5px;
    font-weight: bold;
    color: #4CAF50;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 5px;
    display: inline-block;
    margin: 20px 0;
  }
  .footer {
    margin-top: 30px;
    font-size: 12px;
    color: #999999;
    text-align: center;
  }
</style>
</head>
<body>

<div class="container">
  <div class="header">
    <h1>Verify Your Email</h1>
  </div>
  <div class="content">
    <p>Hi ${username},</p>
    <p>Your One-Time Password (OTP) for email verification is:</p>
    <p class="otp-box">${otp_code}</p>
    <p>This code will expire in <strong> 10 minutes</strong>. Please do not share it with anyone.</p>
    <p>If you didn’t request this, you can safely ignore this email.</p>
  </div>
  <div class="footer">
    <p>© 2025 Your Company. All rights reserved.</p>
  </div>
</div>

</body>
</html>

`
)
}

module.exports=Verification_Email_Template