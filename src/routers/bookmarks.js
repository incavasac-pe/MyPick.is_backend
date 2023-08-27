const express = require("express"); 
const router = express.Router();
const Bookmarks = require('../controllers/bookmarks');


router.get('/list_bookmarks', async (req, res) => {
    const response = newResponseJson();
    let status = 400; 
    response.error = true; 
    const limit = req.query.limit;
 
    exist = await new Bookmarks().getBookmarksAll();
    
    if (exist.rowCount === 0) {              
        response.msg = `Bookmarks empty`;        
    }else  { 
     
            response.error = false;
            response.msg = `List Bookmarks`; 
            response.data =  exist.rows
            status = 200;        
    }
    
    res.status(status).json(response)
});
  
router.get('/my_bookmarks', async (req, res) => {
    const response = newResponseJson();
    let status = 400; 
    response.error = true; 
    const id_user = req.query.id_user;
 
    exist = await new Bookmarks().getBookmarksByUser (id_user);
    
    if (exist.rowCount === 0) {              
        response.msg = `Bookmarks empty`;        
    }else  {      
        response.error = false;
        response.msg = `List Bookmarks`; 
        response.data =  exist.rows
        status = 200;        
    }
    
    res.status(status).json(response)
});
  
 router.post('/register_bookmarks', async (req, res) => {
    const response = newResponseJson();
    let status = 400;
    let bandera = false;
    response.error = true;
    const { id_pick, id_user} = req.body;
     
    if (id_pick == "" || id_user == "") {
        bandera = true;        
        response.msg = 'empty data';      
    }
    exist = await new Bookmarks().getBookmarksByUserIdPick (id_user,id_pick);    
    if (exist.rowCount > 0) {
        bandera = true;       
        response.msg = `Bookmark exist for this user`;        
    }
    if (!bandera) {      
        let result_insert = await new Bookmarks().createBookmarks (id_pick, id_user );
      
        if (! result_insert ?. rowCount || result_insert ?. rowCount == 0) {           
            response.msg = `An error occurred while trying to create a category`;
            status = 500;            
        } else { 
            response.error = false;
            response.msg = `category is created successfully`; 
            response.data =  result_insert.rows[0].id
            status = 201;
        }
    }
    
    res.status(status).json(response)
});
   
function newResponseJson() {
    return {error: true, msg: "", data: []};
}
module.exports = router;
