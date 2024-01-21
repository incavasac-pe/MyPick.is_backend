 const db = require('../config/db')

class Bookmarks {
    async getBookmarksAll () {       
        let results = await db.query('SELECT * FROM mypick.bookmarks').catch(console.log); 
        return results ;
    }
  
    async   getBookmarksByUser (id_user,id_category) {
    let sql = `  SELECT
                    p.id_user AS user,
                    p.id_pick AS id,
                    c.name AS category,
                    c.status,
                    p.picks AS pick_ranking,
                    c1.name_choice AS choice1_name,
                    c2.name_choice AS choice2_name,
                    c1.photo_choice AS photo1_name,
                    c2.photo_choice AS photo2_name,
                    c1.url_choice AS url1,
                    c2.url_choice AS url2,
                    COALESCE(p.likes::integer, 0) AS likes,
                    p.status,
                    b.update_at AS datePicked, 
                    mypick.calcular_diferencia_( b.update_at::timestamp) as dias,
                    COALESCE(c1.selected::integer, 0) AS selectd1,
                    COALESCE(c2.selected::integer, 0) AS selectd2
                FROM
                    mypick.picks p
                    JOIN mypick.choice c1 ON p.id_choice1 = c1.id_choice
                    JOIN mypick.choice c2 ON p.id_choice2 = c2.id_choice
                    JOIN mypick.category c ON p.id_category::integer = c.id
                    JOIN mypick.users u ON p.id_user::integer = u.id
                    JOIN mypick.bookmarks b ON p.id_pick = b.id_pick
                WHERE
                    b.id_user =$1 `; 
                  if(id_category!=''){
                    sql+= ` AND p.id_category::integer=${id_category}`;
                  }  
        let results = await db.query(sql, [id_user]).catch(console.log); 
        return results ;
    }

async  createOrDeleteBookmark(id_pick, id_user) {
  let response;
  try {
    const bookmarkExists = await this.checkBookmarkExists(id_pick, id_user);
    if (bookmarkExists) {
      // El marcador ya existe, así que lo borramos
      response = await this.deleteBookmark(id_pick, id_user);
    } else {
      // El marcador no existe, así que lo creamos
      response = await this.createBookmark(id_pick, id_user);
    }
  } catch (err) {
    response = err;
  }
  return response;
}

async  checkBookmarkExists(id_pick, id_user) {
  const query = 'SELECT EXISTS(SELECT 1 FROM mypick.bookmarks WHERE id_pick=$1 AND id_user=$2)';
  const values = [id_pick, id_user];
  const result = await db.query(query, values);
  return result.rows[0].exists;
}

async  createBookmark(id_pick, id_user) {
  const query = 'INSERT INTO mypick.bookmarks (id_pick, id_user, update_at) VALUES ($1, $2, now()) RETURNING id_bookmarks';
  const values = [id_pick, id_user];
  const result_insert = await db.query(query, values);
  return result_insert;
}

async  deleteBookmark(id_pick, id_user) {
  const query = 'DELETE FROM mypick.bookmarks WHERE id_pick=$1 AND id_user=$2';
  const values = [id_pick, id_user];
  const result_delete = await db.query(query, values);
  return result_delete;
}
/*
    async createBookmarks (id_pick, id_user ) {
        let response
        try {
            const query = 'INSERT INTO mypick.bookmarks (id_pick, id_user,update_at) VALUES ($1, $2,now()) RETURNING id_bookmarks';
            const values = [id_pick, id_user];
            const result_insert = await db.query(query, values);           
            response = result_insert
       
     } catch (err) { 
        response = err;
       }  
       return response
    } 

  async deleteBookmarks (id_pick, id_user ) {
        let response
        try {
            const query = 'DELETE FROM mypick.bookmarks WHERE id_pick=$1 and id_user = $2';
            const values = [id_pick, id_user];
            const result_delete = await db.query(query, values);           
            response = result_delet
       
     } catch (err) { 
        response = err;
       }  
       return response
    } 
          */    
}

module.exports = Bookmarks;
 
