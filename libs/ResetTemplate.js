const Reset_Email_Template = (username, resetLink) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Password Reset</title>
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
  .reset-btn {
    display: inline-block;
    background-color: #4CAF50;
    color: #ffffff !important;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 18px;
    text-decoration: none;
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
    <h1>Password Reset Request</h1>
  </div>
  <div class="content">
    <p>Hi <strong>${username}</strong>,</p>
    <p>We received a request to reset your account password. Click the button below to reset it:</p>

    <a href="${resetLink}" class="reset-btn">Reset Password</a>

    <p>This link will expire in <strong>10 minutes</strong>. If you did not request a password reset, just ignore this email.</p>
  </div>
  <div class="footer">
    <p>© 2025 Your Company. All rights reserved.</p>
  </div>
</div>

</body>
</html>
  `;
};

module.exports = Reset_Email_Template;
