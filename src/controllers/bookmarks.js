 const db = require('../config/db')

class Bookmarks {
    async getBookmarksAll () {       
        let results = await db.query('SELECT * FROM mypick.bookmarks').catch(console.log); 
        return results ;
    }
 
    async getBookmarksByUserIdPick (id_user,id_pick) {       
        let results = await db.query('SELECT * FROM mypick.bookmarks WHERE id_user = $1 and id_pick = $2', [id_user,id_pick]).catch(console.log); 
        return results ;
    }
    async getBookmarksByUser (id_user) {       
        let results = await db.query(`
        SELECT  p.id_user AS user,
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
                b.update_at AS datePicked, 
                mypick.calcular_diferencia_( b.update_at::timestamp) as dias,
                COALESCE(c1.selected ::integer, 0) AS selectd1,
                COALESCE(c2.selected ::integer, 0) AS selectd2
            FROM
                mypick.picks p
                JOIN mypick.choice c1 ON p.id_choice1 = c1.id_choice
                JOIN mypick.choice c2 ON p.id_choice2 = c2.id_choice
                JOIN mypick.category c ON p.id_category::integer = c.id
                JOIN mypick.users u ON p.id_user::integer = u.id
                JOIN mypick.bookmarks b ON b.id_user::integer = p.id_user
                AND b.id_pick =p.id_pick 
                where b.id_user = $1 
        `, [id_user]).catch(console.log); 
        return results ;
    }

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

              
}

module.exports = Bookmarks;
 
