const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailSender {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,  
      requireTLS: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } 
  sendEmail(to, subject, contenct) {        
      
      const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: to,
      subject: subject, 
      html: contenct,
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