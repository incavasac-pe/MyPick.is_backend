const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false, // true si usas SSL/TLS,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  sendEmail(to, subject, text,value,type) {
                let html;
            if(type==1){
            html = `<!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">     
            </head>
            <body>
            <h1>Welcome to MyPick!</h1>
            <p>Please activate your account by clicking on the following link:</p>
            <a href="http://localhost:3000/activate?token=${value}">Activate account here</a>
            </body>
            </html>` 
            }else{
                html = `<!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">     
                </head>
                <body>
                <h1>Reset to MyPick!</h1>
                <p>Please reset your password by clicking on the following link:</p>
                <a href="http://localhost:3000/resetPassword?token=${value}">Reset password here</a>
                </body>
                </html>` 
            }

        const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: to,
        subject: subject,
        text: text,
        html: html
        };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve(info.response);
        }
      });
    });
  }
}
module.exports = EmailSender;