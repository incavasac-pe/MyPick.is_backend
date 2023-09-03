 const db = require('../config/db')

class Picks {
        
    async getPicksAll(limit) {       
        let results = await db.query(`SELECT
        p.id_pick AS id,
        c1.id_choice AS id_choice1,
        c2.id_choice AS id_choice2,
        c.name AS category,
        c.status,
        p.picks AS pick_ranking,
        c1.name_choice AS choice1_name,
        c2.name_choice AS choice2_name,
        c1.photo_choice AS photo1_name,
        c2.photo_choice AS photo2_name,
        COALESCE(p.likes::integer, 0) AS likes,
        p.status,
        p.created_at AS datePicked
      FROM mypick.picks p
      JOIN mypick.choice c1 ON p.id_choice1 = c1.id_choice
      JOIN mypick.choice c2 ON p.id_choice2 = c2.id_choice
      JOIN mypick.category c ON p.id_category::integer = c.id 
      ORDER BY p.update_at desc 
      LIMIT ${limit}` ).catch(console.log); 
        return results ;
    }

   
    async getPicks(user) {       
      const newLocal = `SELECT
        p.id_pick AS id,
        c.name AS category,
        c.status,
        p.picks AS pick_ranking,
        c1.name_choice AS choice1_name,
        c2.name_choice AS choice2_name,
        c1.photo_choice AS photo1_name,
        c2.photo_choice AS photo2_name,
        COALESCE(p.likes::integer, 0) AS likes,
        p.status,
        p.created_at AS datePicked,
        c1.selected AS selectd1,
        c2.selected AS selectd2
      FROM mypick.picks p
      JOIN mypick.choice c1 ON p.id_choice1 = c1.id_choice
      JOIN mypick.choice c2 ON p.id_choice2 = c2.id_choice
      JOIN mypick.category c ON p.id_category::integer = c.id
      JOIN mypick.users u ON p.id_user::integer = u.id
      WHERE p.id_user =$1`;
        let results = await db.query(newLocal, [user]).catch(console.log); 
        return results ;
    }
 
    async createPicks(id_category, id_choice1, id_choice2,id_user) {
        let response
        try {
            const query = 'INSERT INTO mypick.picks (id_category, id_choice1, id_choice2,id_user) VALUES ($1, $2, $3, $4) RETURNING id_pick';
            const values = [id_category, id_choice1, id_choice2 ,id_user];
            const result_insert = await db.query(query, values);           
            response = result_insert
       
     } catch (err) { 
        response = err;
       }  
       return response
    }

    async updateRankinkPicks(id_pick) {
      let response
      try {
          const query = 'UPDATE mypick.picks   SET picks = picks + 1 where id_pick =$1';
          const values = [id_pick];
          const result_insert = await db.query(query, values);           
          response = result_insert
     
   } catch (err) { 
      response = err;
     }  
     return response
  }
 
   
  async getPicksPorcentage(id_pick) {       
    const newLocal = `SELECT
    p.id_pick,
    c.id_choice,
    c.name_choice,
    c.selected,
    ROUND((c.selected::numeric / p.picks) * 100, 2) AS percentage_selected
FROM
    mypick.choice c
JOIN
    mypick.picks p ON c.id_choice = p.id_choice1 
    where id_pick = $1
   union all 
     SELECT
    p.id_pick,
    c.id_choice,
    c.name_choice,
    c.selected,
    ROUND((c.selected::numeric / p.picks) * 100, 2) AS percentage_selected
FROM
    mypick.choice c
JOIN
    mypick.picks p ON c.id_choice = p.id_choice2 
    where id_pick = $2 `;
      let results = await db.query(newLocal, [id_pick,id_pick]).catch(console.log); 
      return results ;
  }

  
  async updateLikesPicks(id_pick) {
    let response
    try {
        const query = 'UPDATE mypick.picks  SET likes = likes + 1 where id_pick =$1';
        const values = [id_pick];
        const result_insert = await db.query(query, values);           
        response = result_insert
   
 } catch (err) { 
    response = err;
   }  
   return response
}

              
}

module.exports = Picks;
 
