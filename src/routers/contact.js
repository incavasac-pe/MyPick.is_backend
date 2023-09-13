const express = require("express");
 
const router = express.Router(); 
const EmailSender = new require('../services/send_email')
const emailSender = new EmailSender();
require('dotenv').config();

  
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
    
         // envío de correo
         emailSender.sendEmail(to, subject, content)
             .then(response => {
                console.log('Correo enviado:', response);
                response_data.error = false;
                response_data.msg = `Successful send email`;            
                status = 200;               
   
             res.status(status).json(response_data)
             })
             .catch(error => {
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