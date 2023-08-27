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
        let results = await db.query('SELECT * FROM mypick.bookmarks WHERE id_user = $1', [id_user]).catch(console.log); 
        return results ;
    }

    async createBookmarks (id_pick, id_user ) {
        let response
        try {
            const query = 'INSERT INTO mypick.bookmarks (id_pick, id_user) VALUES ($1, $2) RETURNING id_bookmarks';
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
 
