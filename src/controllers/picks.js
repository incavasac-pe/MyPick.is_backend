 const db = require('../config/db')

class Picks {
        
    async getPicksAll(limit,id,flag) { 
    let sql =   `SELECT
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
        c1.url_choice AS url_choice1,
        c2.url_choice AS url_choice2,
        COALESCE(p.likes::integer, 0) AS likes,
        p.status,
        p.created_at AS datePicked
      FROM mypick.picks p
      JOIN mypick.choice c1 ON p.id_choice1 = c1.id_choice
      JOIN mypick.choice c2 ON p.id_choice2 = c2.id_choice
      JOIN mypick.category c ON p.id_category::integer = c.id `;
      if(id!='' && !flag){
          sql+= `WHERE p.id_pick != ${id}`
      
      }else if(id!='' && flag){ 
        sql+= `WHERE p.id_pick = ${id}`
      }
    
      sql+=` ORDER BY RANDOM()  LIMIT ${limit}` 
        let results = await db.query(sql ).catch(console.log); 
        return results ;
    
  }
   
    async getPicks(user,id_category) {  
     let sql = `SELECT
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
        mypick.calcular_diferencia_( p.created_at::timestamp) as dias,
        COALESCE(c1.selected ::integer, 0) AS selectd1,
        COALESCE(c2.selected ::integer, 0) AS selectd2  
      FROM mypick.picks p
      JOIN mypick.choice c1 ON p.id_choice1 = c1.id_choice
      JOIN mypick.choice c2 ON p.id_choice2 = c2.id_choice
      JOIN mypick.category c ON p.id_category::integer = c.id
      JOIN mypick.users u ON p.id_user::integer = u.id
      WHERE p.id_user =$1`;  
        if(id_category!=''){
        sql+= ` AND p.id_category::integer=${id_category}`;
      }   
   
        let results = await db.query(sql, [user]).catch(console.log); 
        return results ;
    }
 
    async createPicks(id_category, id_choice1, id_choice2,id_user) {
        let response
        try {
            const query = 'INSERT INTO mypick.picks (id_category, id_choice1, id_choice2,id_user,likes,picks,update_at) VALUES ($1, $2, $3, $4, $5, $6,now()) RETURNING id_pick';
            const values = [id_category, id_choice1, id_choice2 ,id_user,'0','0'];
            const result_insert = await db.query(query, values);           
            response = result_insert
       
     } catch (err) { 
        response = err;
       }  
       return response
    }

    async createPicksComen(id_pick) {
      let response
      try {
          const query = ' INSERT INTO mypick.comentario  (id_pick, id_user, contenido, username, created_at)  VALUES ($1, $2, $3, $4, now()) RETURNING id';
          const values = [id_pick, '99999999', '' ,''];
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
          const query = 'UPDATE mypick.picks  SET picks = picks + 1 where id_pick =$1';
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

  
  async updateLikesPicks(id_pick,type) {
    let response
      try {
         let query;
        if (type) {
          query = 'UPDATE mypick.picks SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE likes END WHERE id_pick = $1 RETURNING likes';
        } else {
          query = 'UPDATE mypick.picks SET likes = likes + 1 where id_pick =$1 RETURNING likes';
        }
          const values = [id_pick];
          const result_insert = await db.query(query, values);           
          response = result_insert
     
      } catch (err) { 
      response = err;
     }  
     return response
  }
 
async createVoto(id_pick,id_choice,id_user ) {
  let response
  try {
      const query = 'INSERT INTO mypick.vote_pick (id_pick, id_choice, id_user,update_at) VALUES ($1, $2, $3,now()) RETURNING id';
      const values = [id_pick,id_choice,id_user];
      const result_insert = await db.query(query, values);           
      response = result_insert
 
} catch (err) { 
  response = err;
 }  
 return response
} 
async getMyPickerVote (id_user) {       
  let results = await db.query(`
             SELECT   
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
                vp.update_at AS datePicked, 
                mypick.calcular_diferencia_( vp.update_at::timestamp) as dias,
                COALESCE(c1.selected ::integer, 0) AS selectd1,
                COALESCE(c2.selected ::integer, 0) AS selectd2
            FROM
                mypick.picks p
                JOIN mypick.choice c1 ON p.id_choice1 = c1.id_choice
                JOIN mypick.choice c2 ON p.id_choice2 = c2.id_choice
                JOIN mypick.category c ON p.id_category::integer = c.id
                JOIN mypick.users u ON p.id_user::integer = u.id
                JOIN mypick.vote_pick vp   ON vp.id_pick =p.id_pick        
                where vp.id_user = $1 
  `, [id_user]).catch(console.log); 
  return results ;
} 

 
async getLikesByUserIdAndIp(ip, id_user) {
  let query = 'SELECT * FROM mypick.pick_like_byuser ';
  const values = [ip];
  if (id_user !== 999999) {
    query += ' WHERE  ip= $1 OR id_user = $2  ';
    values.push(id_user); 
  }else{
    query += ' WHERE ip = $1'; 
  } 
  
    const results = await db.query(query, values);
    return results;
 
}
 async insertLikePick (ip,id_user,id_pick) {   
    let results = await db.query(`SELECT mypick.actualizar_id_like($1, $2, $3)`, [ip,id_user,id_pick]).catch(console.log); 
    return results ;
  } 

  
        
  async getPicksAllSearch(search) { 
    let sql =   `SELECT
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
        c1.url_choice AS url_choice1,
        c2.url_choice AS url_choice2,
        COALESCE(p.likes::integer, 0) AS likes,
        p.status
      FROM mypick.picks p
      JOIN mypick.choice c1 ON p.id_choice1 = c1.id_choice
      JOIN mypick.choice c2 ON p.id_choice2 = c2.id_choice
      JOIN mypick.category c ON p.id_category::integer = c.id 
      WHERE c1.name_choice ILIKE  '%${search}%' or  c2.name_choice ILIKE  '%${search}%'  
      ORDER BY p.update_at asc`; 
 
        let results = await db.query(sql ).catch(console.log); 
        return results ;
    }


}

module.exports = Picks;
 
