 const db = require('../config/db')

class Auth {
   
    async getUserByEmail(email) {       
        let results = await db.query('SELECT * FROM mypick.users WHERE email = $1', [email]).catch(console.log); 
        return results ;
    }
    async getUserByToken(token) {       
        let results = await db.query('SELECT * FROM mypick.users WHERE token = $1', [token]).catch(console.log); 
        return results ;
    }
    async createUser(full_name, email, password,token,username,origin) {
        let response
        try {
            const status = origin =='mipick' ? 'P':'A';

            const query = 'INSERT INTO mypick.users (full_name, email, password,status,token,username,origin) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING id';
            const values = [full_name, email, password,status,token,username,origin];
            const result_insert = await db.query(query, values);           
            response = result_insert
       
     } catch (err) { 
        response = err;
       }  
       return response
    }
/*
    async activateUser(email) {
        let response
        try {
            const query = 'UPDATE mypick.users SET status = $1,token=$2 WHERE email= $3';
            const values = ['A','',email];
            const result = await db.query(query, values);           
            response = result
       
     } catch (err) { 
        response = err;
       }  
       return response
    }*/
    async  activateUser(email) {
        let response;
      
        try {
          // Verificar el estatus actual del usuario
          const checkQuery = 'SELECT status FROM mypick.users WHERE email = $1';
          const checkResult = await db.query(checkQuery, [email]);
      
          if (checkResult.rows.length > 0) {
            const currentStatus = checkResult.rows[0].status;
      
            // Si el estatus ya es "A", retornar 0
            if (currentStatus === 'A') {
              response = 0;
              return response;
            }
          }
      
          // Actualizar el estatus y el token del usuario
          const updateQuery = 'UPDATE mypick.users SET status = $1, token = $2 WHERE email = $3';
          const updateValues = ['A', '', email];
          const result = await db.query(updateQuery, updateValues);
          response = result;
        } catch (err) {
          response = err;
        }
      
        return response;
      }

    async updateUser(password, email) {
        let response
        try {
            const query = 'UPDATE mypick.users SET password = $1 WHERE email = $2';
            const values = [password,email];
            const result = await db.query(query, values);
           
            response = result
       
     } catch (err) { 
        response = err;
       }  
       return response
    }
    
    async updateProfile(full_name,new_email,email) {
        let response
        try {         

            const query = 'UPDATE mypick.users SET full_name = $1 WHERE email = $2';
            const values = [full_name,email];
            const result = await db.query(query, values);           
            response = result

            if(new_email !=''){
                const query = 'UPDATE mypick.users SET email = $1 WHERE email = $2';
                const values = [new_email,email];
                await db.query(query, values); 
            }
     } catch (err) { 
        response = err;
       }  
       return response
    }
 
    async updatePhoto(photo, email) {
        let response
        try {
            const query = 'UPDATE mypick.users SET photo = $1 WHERE email = $2';
            const values = [photo,email];
            const result = await db.query(query, values);           
            response = result
       
     } catch (err) { 
        response = err;
       }  
       return response
    }
              
}

module.exports = Auth;
 
