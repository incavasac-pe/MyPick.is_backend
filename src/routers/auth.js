const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Auth = require('../controllers/auth');
const EmailSender = new require('../services/send_email')
 

require('dotenv').config();

const clientId = process.env.EMAIL_CLIENTID;
const clientSecret = process.env.EMAIL_CLIENTSECRET;
const refreshToken = process.env.EMAIL_REFRESHTOKEN;
const email_from =    process.env.USER_EMAIL;

const base_url = process.env.BASE_URL;
  
 router.post('/register', async (req, res) => {
    const response = newResponseJson();
    let status = 400;
    let bandera = false;
    response.error = true;
    const { full_name, email, password,origin } = req.body;
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
      // Realiza el hash de la contraseña con el salt
      const hashedPassword = await bcrypt.hash(password, salt);

    if (full_name.trim() == "" || email.trim() == '' ) {
        bandera = true;        
        response.msg = 'empty data';      
    }
    exist = await new Auth().getUserByEmail(email);
    if (exist.rowCount > 0) {
        status=401
        bandera = true;       
        response.msg = `The email is already registered`;        
    }
    if (! bandera) {
        const token = jwt.sign({ email: email ,full_name:full_name},  process.env.SECRETKEY, { expiresIn: '1h' });
        const username = full_name.substring(0, 8)
        let usuarios = await new Auth().createUser(full_name, email, hashedPassword,token,username,origin);

        if (! usuarios ?. rowCount || usuarios ?. rowCount == 0) {           
            response.msg = `An error occurred while trying to create a user`;
            status = 500;
            
        } else {
           if(origin =='mipick'){
            //enviar correo con el token  de validacion de cuenta 
                const emailSender = new EmailSender(clientId, clientSecret, refreshToken, email_from);
             
               const content = `<!DOCTYPE html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">     
                </head>
                <body>
                <h1>Welcome to MyPick!</h1>
                <p>Please activate your account by clicking on the following link:</p>
                <a href="${base_url}/activate?token=${token}">Activate account here</a>
                </body>
                </html>` 

 
                const emailOptions = {
                    from: process.env.USER_EMAIL,
                    to: email,
                    subject: "Activation email",
                    html: content
                };
        
                emailSender.sendEmail(emailOptions)
                .then(() => {
                    console.log("Email sent successfully");   
                })
                .catch((error) => {
                    console.error("Failed to send email:", error); 
                }); 
                                    

            }


            response.error = false;
            response.msg = `Successful registration`; 
            response.data =  token
            status = 201;
        }
    }
    
    res.status(status).json(response)
});
 
 
// inicio de sesion app
router.post('/login', async (req, res) => {

    const response = newResponseJson();
    response.msg = 'Welcome!';
    let status = 401;
    response.error = true;
    const {email, password} = req.body
    const result = await new Auth().getUserByEmail(email);
    if (result.rowCount == 0) {  
        response.msg = `User does not exist`;     
    } else{
        const user = result.rows[0]; 
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {         
            response.msg = `Incorrect password`;           
        }else{
            // Generar el token de autenticación     
           
            const token = jwt.sign({ email: user.email ,full_name:user.full_name},  process.env.SECRETKEY, { expiresIn: '1h' });
            response.error = false;
            response.msg = `Login successfully`; 
            response.data = { user, token }
            status = 200
          
        }
    } 
    res.status(status).json(response)
});
 

router.get('/activate_account', async (req, res) => {
    try{
    const response = newResponseJson();
    response.msg = 'Activate!';
    let status = 400;
    response.error = true;
    const token = req.query.token; 
 
    const decoded = jwt.verify(token, process.env.SECRETKEY)
     
    const email = decoded.email;
    const full_name = decoded.full_name;;
    const result = await new Auth().getUserByEmail(email);
    const user = result.rows[0]; 
    if (result.rowCount == 0) {  
        response.msg = `User does not exist`;     
    } else{           
        const result_act = await new Auth().activateUser(email);            
            if(result_act.rowCount >0){      
                const token = jwt.sign({ email: email ,full_name:full_name},  process.env.SECRETKEY, { expiresIn: '1h' });
                response.error = false;
                response.msg = `Account activated successfully`; 
                response.data =  { user, token }
                status = 200
            }else{   
                response.msg = `Error activated account`; 
            }      
    } 
  res.status(status).json(response)
} catch (error) {
    if (error.name === 'TokenExpiredError') { 
      res.status(500).json({msg:'Token expired',error:true})
    }
    res.status(500).json({msg:'Invalid token',error:true})  
  }
});


router.post('/link_password', async (req, res) => {
    const response = newResponseJson();
    response.msg = 'Link password';
    let status = 400;
    response.error = true;

    const {email} = req.body  
    const result = await new Auth().getUserByEmail(email);
   
    if (result.rowCount == 0) {  
        response.msg = `User does not exist`;     
    } else {
       const user = result.rows[0];
        const token = jwt.sign({ email: user.email ,full_name:user.full_name},  process.env.SECRETKEY, { expiresIn: '1h' });
        //ENVIAR CORREO EL LINK CON EL TOKEN        
        
            const emailSender = new EmailSender(clientId, clientSecret, refreshToken, email_from);
             
            const content = `<!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width">
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">     
            </head>
            <body>
            <h1>Reset to MyPick!</h1>
            <p>Please reset your password by clicking on the following link:</p>
            <a href="${base_url}/resetPassword?token=${token}">Reset password here</a>
            </body>
            </html>`;


             const emailOptions = {
                 from: process.env.USER_EMAIL,
                 to: email,
                 subject: "Reset password",
                 html: content
             };
     
             emailSender.sendEmail(emailOptions)
             .then(() => {
                 console.log("Email sent successfully");   
             })
             .catch((error) => {
                 console.error("Failed to send email:", error); 
             }); 

        response.error = false;
        response.msg = `Send email link reset password`; 
        response.data = token
        status = 200     
    }     
    res.status(status).json(response)
});
 
 
router.get('/reset_password', async (req, res) => {
    const response = newResponseJson();
    response.msg = 'Reset password'
    let status = 400;
    response.error = true;

    const token = req.query.token;
    try {
    const decoded = jwt.verify(token, process.env.SECRETKEY)
    const email = decoded.email;
    const full_name = decoded.full_name;
    const result = await new Auth().getUserByEmail(email);
    if (result.rowCount == 0) {  
        response.msg = `User does not exist`;     
    } else{ 
            const token = jwt.sign({ email: email ,full_name:full_name},  process.env.SECRETKEY, { expiresIn: '1h' });
            response.error = false;
            response.msg = `Validate account successfully`; 
            response.data = {email,token}
            status = 200            
        }  
    res.status(status).json(response)
} catch (error) {
    if (error.name === 'TokenExpiredError') { 
      res.status(500).json({msg:'Token expired',error:true})
    }
    res.status(500).json({msg:'Invalid token',error:true})  
  }
});


router.post('/change_password', async (req, res) => {
    const response = newResponseJson();
    response.msg = 'Change password';
    let status = 400;
    response.error = true;
  
      // Realiza el hash de la contraseña con el salt
     
    const {email,new_password} = req.body  
    const result = await new Auth().getUserByEmail(email);
   
    if (result.rowCount === 0) {  
        response.msg = `User does not exist`;     
    } else {
       const user = result.rows[0];       

       // Compara la contraseña ingresada con el hash almacenado
        const passwordMatch = await bcrypt.compare(new_password, user.password);
        if (passwordMatch) {         
            response.msg = `The new password must not be the same as the current one`;       
        } else  {
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(new_password, salt);
            const result_act = await new Auth().updateUser(hashedPassword,email);    
    
        if(result_act.rowCount === 1){   
            response.error = false;
            response.msg = `Change password successfully`;            
            status = 200     
            }
        }   
    }
    res.status(status).json(response)
});
   
router.post('/change_profile', async (req, res) => {
    const response = newResponseJson();
    response.msg = 'Change Profile';
    let status = 400;
    response.error = true;   
     
    const {email,new_email,full_name} = req.body  
    const result = await new Auth().getUserByEmail(email);
   
    if (result.rowCount === 0) {  
        response.msg = `User does not exist`;     
    } else { 
       const result_act = await new Auth().updateProfile(full_name,new_email,email);        
        if(result_act.rowCount === 1){   
            const email_search = new_email !='' ? new_email :  email;
            const result_user = await new Auth().getUserByEmail(email_search);
            const user = result_user.rows[0]; 
            response.data = { user }
            response.error = false;
            response.msg = `Change profile successfully`;            
            status = 200                  
        }   
    }
    res.status(status).json(response)
});
   
function newResponseJson() {
    return {error: true, msg: "", data: []};
}
module.exports = router;
