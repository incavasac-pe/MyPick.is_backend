 const db = require('../config/db')

class Choice {
        
    async getChoiceAll(limit) {       
        let results = await db.query('SELECT * FROM mypick.choice  LIMIT $1', [ limit]).catch(console.log); 
        return results ;
    }
 
    async getChoice(name_choice) {       
        let results = await db.query('SELECT * FROM mypick.choice WHERE name_choice = $1', [name_choice]).catch(console.log); 
        return results ;
    }

    async createChoices(name_choice,photo ) {
        let response
        try {
            const query = 'INSERT INTO mypick.choice (name_choice, photo_choice) VALUES ($1, $2) RETURNING id_choice';
            const values = [name_choice,photo];
            const result_insert = await db.query(query, values);           
            response = result_insert
       
     } catch (err) { 
        response = err;
       }  
       return response
    } 

    async updateRankinkChoice(id_choice) {
        let response
        try {
            const query = 'UPDATE mypick.choice SET selected = selected + 1 where id_choice =$1';
            const values = [id_choice];
            const result_insert = await db.query(query, values);           
            response = result_insert
       
     } catch (err) { 
        response = err;
       }  
       return response
    }
              
}

module.exports = Choice;
 
