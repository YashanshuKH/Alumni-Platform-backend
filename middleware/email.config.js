const nodemailer =require("nodemailer")


  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // must provide server name, otherwise TLS certificate check will fail
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


module.exports = transporter;