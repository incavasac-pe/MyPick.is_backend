 const db = require('../config/db')

class TrendingTopics {
    
    async getTrendingTopics () {    

        let results = await db.query(`
     
   WITH trending_picks AS (
    SELECT
        p.id_category,
        p.id_choice1 AS id_choice,
        c.name_choice,
        COALESCE( p.picks ::integer, 0)  as pick_ranking,     
          COALESCE( c.selected::integer, 0)  as selected,
        cat."name" AS category_name,
        p.id_pick,
        c1.name_choice AS id_choice1_name,
        c2.name_choice AS id_choice2_name,
         c1.photo_choice AS photo1_name,
        c2.photo_choice AS photo2_name,
        ROW_NUMBER() OVER (PARTITION BY p.id_category ORDER BY c.selected DESC) AS rn
    FROM
        mypick.picks p
    INNER JOIN
        mypick.choice c ON p.id_choice1 = c.id_choice
    INNER JOIN
        mypick.choice c1 ON p.id_choice1 = c1.id_choice
    INNER JOIN
        mypick.choice c2 ON p.id_choice2 = c2.id_choice
    INNER JOIN
        mypick.category cat ON p.id_category::integer = cat.id 
)
SELECT
    t.id_category,
    t.category_name,
    t.pick_ranking,
    t.id_choice,
    t.name_choice AS trending_choice,
    t.id_choice1_name,
    t.id_choice2_name,
    t.photo1_name,
    t.photo2_name,
    t.selected AS trending_value
FROM
    trending_picks t
WHERE
    t.rn = 1 LIMIT 3`).catch(console.log); 
        return results ;
    }
 
    async getTrendingTopicsId (id_category) {       
        let results = await db.query(`
        WITH trending_picks AS (
         SELECT
             p.id_category,
             p.id_choice1 AS id_choice,
             c.name_choice,          
               COALESCE( p.picks ::integer, 0)  as pick_ranking,    
               COALESCE( c.selected::integer, 0)  as selected,
             cat."name" AS category_name,
             p.id_pick,
             c1.name_choice AS id_choice1_name,
             c2.name_choice AS id_choice2_name,
              c1.photo_choice AS photo1_name,
             c2.photo_choice AS photo2_name,
             ROW_NUMBER() OVER (PARTITION BY p.id_category ORDER BY c.selected DESC) AS rn
         FROM
             mypick.picks p
         INNER JOIN
             mypick.choice c ON p.id_choice1 = c.id_choice
         INNER JOIN
             mypick.choice c1 ON p.id_choice1 = c1.id_choice
         INNER JOIN
             mypick.choice c2 ON p.id_choice2 = c2.id_choice
         INNER JOIN
             mypick.category cat ON p.id_category::integer = cat.id 
     )
     SELECT
         t.id_category,
         t.category_name,
         t.pick_ranking,
         t.id_choice,
         t.name_choice AS trending_choice,
         t.id_choice1_name,
         t.id_choice2_name,
         t.photo1_name,
         t.photo2_name,
         t.selected AS trending_value
     FROM
         trending_picks t
     WHERE
        t.rn = 1 and t.id_category::integer = $1 LIMIT 3`, [id_category]).catch(console.log); 
        return results ;
    }  
              
}

module.exports = TrendingTopics;
 
