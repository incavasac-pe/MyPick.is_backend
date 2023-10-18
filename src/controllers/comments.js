 const db = require('../config/db')

class Comments {

    async  getCommentsWithReplies(id_pick) {
        let response;
        try {
          const query = ` 
         SELECT
         c.id AS id,
         c.username AS usuario,
         c.contenido AS contenido,
         c.likes as likes,
         u.photo AS foto,
         to_char(c.created_at, 'DD MON YYYY') AS fecha,
         COALESCE(
           json_agg(
             json_build_object(
               'id', r.id,
               'usuario', r.username,
               'foto', r.foto,
               'contenido', r.contenido,
               'fecha', to_char(r.created_at, 'DD MON YYYY')
             )
           ) FILTER (WHERE r.id IS NOT NULL),
           '[]'
         ) AS respuestas
       FROM
         mypick.comentario c
         LEFT JOIN mypick.reply r ON c.id = r.comentario_id
       LEFT JOIN mypick.users u ON c.username = u.username
       WHERE
         c.id_pick = ${id_pick}
       GROUP BY
         c.id, c.username, c.contenido, c.created_at, c.likes, u.photo
       ORDER BY
         c.id;  `;
          const result = await db.query(query);
          response = result
        } catch (err) {
          response = err;
        }
        return response;
      }
      
    async  createComment(id_pick, id_user, contenido,username) {
        let response;
        try {
          const query = 'INSERT INTO  mypick.comentario (id_pick, id_user, contenido, username, created_at,likes) VALUES ($1, $2, $3, $4 ,now(),$5) RETURNING id';
          const values = [id_pick, id_user, contenido,username,0];
          const result_insert = await db.query(query, values);
          response = result_insert;
        } catch (err) {
          response = err;
        }
        return response;
      }

    async  createReply(comentario_id, contenido,username,foto) {
      let response;
      try {
        const query = 'INSERT INTO  mypick.reply (comentario_id, contenido, username,foto, created_at) VALUES ($1, $2,$3 ,$4,now()) RETURNING id';
        const values = [comentario_id, contenido,username,foto];
        const result_insert = await db.query(query, values);
        response = result_insert;
      } catch (err) {
        response = err;
      }
      return response;
    }
   
  async  updateLikesComments(id_pick, comentario_id, type) {
    let response;
    try {
      let query;
      if (type) {
        query = 'UPDATE mypick.comentario SET likes = CASE WHEN likes > 0 THEN likes - 1 ELSE likes END WHERE id_pick = $1 AND id = $2';
      } else {
        query = 'UPDATE mypick.comentario SET likes = likes + 1 WHERE id_pick = $1 AND id = $2';
      }
      const values = [id_pick, comentario_id];
      const result_insert = await db.query(query, values);
      response = result_insert;
    } catch (err) {
      response = err;
    }
    return response;
  }

  async getLikesbyidpick(id_user,id_pick) {       
    let results = await db.query('SELECT * from mypick.comments_like_byuser  where id_user=$1  and id_pick =$2', [id_user,id_pick]).catch(console.log); 
    return results ;
}      

  async insertLikecomments_user(id_pick,comentario_id,id_user) {     
    let results = await db.query(`SELECT mypick.actualizar_coment_id_like($1, $2, $3)`, [id_pick,id_user,comentario_id]).catch(console.log); 
    return results ;
  }   
    
}

module.exports = Comments;
 
