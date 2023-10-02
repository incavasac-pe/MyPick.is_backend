const express = require("express");
 
const router = express.Router(); 
const EmailSender = new require('../services/send_email')
 
require('dotenv').config();

const clientId = process.env.EMAIL_CLIENTID;
const clientSecret = process.env.EMAIL_CLIENTSECRET;
const refreshToken = process.env.EMAIL_REFRESHTOKEN;
const email =    process.env.USER_EMAIL;


 router.post('/send_email_contact', async (req, res) => {
    const response_data = newResponseJson();
    let status = 400; 
    response_data.error = true;
    response_data.msg = 'Ocurrio un error al enviar el correo'
    const {content, subject, to } = req.body; 
  
    if (content.trim() == "" || subject.trim() == '' || to.trim() == '') {  
        response_data.msg = 'Empty data'        
       return res.status(status).send(response_data)  
    }else{
        const emailSender = new EmailSender(clientId, clientSecret, refreshToken, email);
         // envío de correo
 
        const emailOptions = {
            from:  process.env.USER_EMAIL,
            to:to,
            subject: subject,
            html: content
        };

        emailSender.sendEmail(emailOptions)
        .then(() => {
          console.log("Email sent successfully"); 
          response_data.error = false;
          response_data.msg = `Successful send email`;            
          status = 200;               

       res.status(status).json(response_data)
        })
        .catch((error) => {
          console.error("Failed to send email:", error);
          response_data.msg = `Error al enviar el correo`;   
          console.log('Error al enviar el correo:', error);                 
           res.status(status).json(response_data)
        }); 
           
    }
   
});
  
function newResponseJson() {
    return {error: true, msg: "", data: []};
}
module.exports = router;