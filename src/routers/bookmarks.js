const express = require("express"); 
const router = express.Router();
const Bookmarks = require('../controllers/bookmarks');
const Auth = require('../controllers/auth');

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
    const email = req.query.email;
    const id_category = req.query.id_category  ?? '';
    const result_user = await new Auth().getUserByEmail(email);
    if (result_user.rowCount == 0) {  
        response.msg = `User does not exist`;  
        return res.status(status).json(response);   
    } 
    const id_user = result_user.rows[0].id  
 
    exist = await new Bookmarks().getBookmarksByUser(id_user,id_category);
    
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
    response.error = false;
    const { id_pick, email} = req.body;
     
    if (id_pick == "" || email == "") {       
        response.error = true
        response.msg = 'empty data';      
    }
    const result_user = await new Auth().getUserByEmail(email);
    if (result_user.rowCount == 0) {  
        response.msg = `User does not exist`;  
         response.error = true
        return res.status(status).json(response);   
    } 
    const id_user = result_user.rows[0].id  

    exist = await new Bookmarks().createOrDeleteBookmark(id_pick,id_user);   

    if (exist.command =='INSERT' ) {  
            response.other = true     
            response.error = false;
            response.msg = `Bookmarks is created successfully`;           
            status = 201;
    }else if(exist.command =='DELETE'){
        response.other = false 
           response.msg = `Bookmarks is delete successfully`;
           status = 200;
    }else{
         response.msg = `An error occurred while trying to create a Bookmarks `;
            status = 500; 
    }       
        
    res.status(status).json(response)
});
   
function newResponseJson() {
    return {error: true, msg: "", data: [],other:false};
}
module.exports = router;
