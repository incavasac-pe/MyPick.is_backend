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
         c.id, c.username, c.contenido, c.created_at,u.photo
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
          const query = 'INSERT INTO  mypick.comentario (id_pick, id_user, contenido, username, created_at) VALUES ($1, $2, $3, $4 ,now()) RETURNING id';
          const values = [id_pick, id_user, contenido,username];
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
              
}

module.exports = Comments;
 
