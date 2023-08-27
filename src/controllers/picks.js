 const db = require('../config/db')

class Picks {
        
    async getPicksAll() {       
        let results = await db.query(`SELECT
        p.id_pick,
        c.name AS category,
        c.status,
        c.picks AS pick_ranking,
        c1.name_choice AS choice1_name,
        c2.name_choice AS choice2_name,
        c1.photo_choice AS photo1_name,
        c2.photo_choice AS photo2_name,
        p.likes,
        p.status
      FROM mypick.picks p
      JOIN mypick.choice c1 ON p.id_choice1 = c1.id_choice
      JOIN mypick.choice c2 ON p.id_choice2 = c2.id_choice
      JOIN mypick.category c ON p.id_category::integer = c.id ` ).catch(console.log); 
        return results ;
    }

   
    async getPicks(user) {       
        let results = await db.query(`SELECT
        p.id_pick,
        c.name AS category,
        c.status,
        c.picks AS pick_ranking,
        c1.name_choice AS choice1_name,
        c2.name_choice AS choice2_name,
        c1.photo_choice AS photo1_name,
        c2.photo_choice AS photo2_name,
        p.likes,
        p.status
      FROM mypick.picks p
      JOIN mypick.choice c1 ON p.id_choice1 = c1.id_choice
      JOIN mypick.choice c2 ON p.id_choice2 = c2.id_choice
      JOIN mypick.category c ON p.id_category::integer = c.id
      JOIN mypick.users u ON p.id_user::integer = u.id
      WHERE p.id_user =$1`, [user]).catch(console.log); 
        return results ;
    }
 
    async createPicks(id_category, id_choice1, id_choice2,id_user) {
        let response
        try {
            const query = 'INSERT INTO mypick.picks (id_category, id_choice1, id_choice2,id_user ) VALUES ($1, $2, $3, $4) RETURNING id_pick';
            const values = [id_category, id_choice1, id_choice2 ,id_user];
            const result_insert = await db.query(query, values);           
            response = result_insert
       
     } catch (err) { 
        response = err;
       }  
       return response
    }

              
}

module.exports = Picks;
 
