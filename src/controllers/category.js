 const db = require('../config/db')

class Category {
        
    async getCategoryAll() {       
        let results = await db.query('SELECT * FROM mypick.category WHERE status = $1', ['A']).catch(console.log); 
        return results ;
    }

    async getCategory(category) {       
        let results = await db.query('SELECT * FROM mypick.category WHERE name = $1', [category]).catch(console.log); 
        return results ;
    }

    async createCategory(category,status) {
        let response
        try {
            const query = 'INSERT INTO mypick.category (name,status) VALUES ($1, $2) RETURNING id';
            const values = [category,status];
            const result_insert = await db.query(query, values);           
            response = result_insert
       
     } catch (err) { 
        response = err;
       }  
       return response
    }

              
}

module.exports = Category;
 
