const express = require("express"); 
const router = express.Router();
const Comments = require('../controllers/comments');
const Auth = require('../controllers/auth');

router.get('/list_comments_bypicks', async (req, res) => {
    const response = newResponseJson();
    let status = 400; 
    response.error = true; 
    const id_pick = req.query.id_pick;
 
    exist = await new Comments().getCommentsWithReplies(id_pick); 
    if (exist.rowCount === 0) {              
        response.msg = `Comments empty`;        
    }else  { 
     
        response.error = false;
        response.msg = `List Comments`; 
        response.data =  exist.rows
        status = 200;        
    }
    
    res.status(status).json(response)
});
  
 router.post('/register_comments', async (req, res) => {
    const response = newResponseJson();
    let status = 400;
    let bandera = false;
    response.error = true;
    const { id_pick, contenido, email} = req.body; 

    if (contenido.trim == "") {
        bandera = true;        
        response.msg = 'empty data';      
    }
    exist = await new Auth().getUserByEmail(email);
    if (exist.rowCount == 0) {  
        response.msg = `User does not exist`;     
        bandera = true;     
    }  
       
    if (!bandera) {  
        const username = exist.rows[0].username;     
        const id_user = exist.rows[0].id;   
        let result_insert = await new Comments().createComment(id_pick, id_user, contenido,username);
     
        if (! result_insert ?. rowCount || result_insert ?. rowCount == 0) {           
            response.msg = `An error occurred while trying to create a Comments`;
            status = 500;            
        } else { 
            exist = await new Comments().getCommentsWithReplies(id_pick);
            response.error = false;
            response.msg = `Comments is created successfully`; 
            response.data = exist.rows
            status = 201;
        }
    }
    
    res.status(status).json(response)
});
   

router.post('/register_reply', async (req, res) => {
    const response = newResponseJson();
    let status = 400;
    let bandera = false;
    response.error = true;
    const { id_pick,comentario_id, contenido,email} = req.body;
     
    if (contenido.trim() == "") {
        bandera = true;        
        response.msg = 'empty data';      
    }
    exist = await new Auth().getUserByEmail(email);
    if (exist.rowCount == 0) {  
        response.msg = `User does not exist`;     
        bandera = true;     
    }  
    if (!bandera) {    
        const username = exist.rows[0].username;   
        const photo = exist.rows[0].photo;  
        let result_insert = await new Comments().createReply(comentario_id, contenido,username,photo);
      
        if (! result_insert ?. rowCount || result_insert ?. rowCount == 0) {           
            response.msg = `An error occurred while trying to create a Reply`;
            status = 500;            
        } else { 
            exist = await new Comments().getCommentsWithReplies(id_pick);
            response.error = false;
            response.msg = `Reply is created successfully`; 
            response.data = exist.rows
            status = 201;
        }
    }
    
    res.status(status).json(response)
});


  router.post('/register_like_comments', async (req, res) => {
    const response = newResponseJson();
    let status = 400;
    response.error = true;
    
    const { id_pick,comentario_id } = req.body;    
    if (id_pick === '' && comentario_id ==='' ) {
      response.msg = 'empty data';
      return res.status(status).json(response);
    }
    
    const pick_update = await new Comments().updateLikesComments(id_pick,comentario_id)
    
    if (!pick_update?.rowCount || pick_update.rowCount === 0) {
      response.msg = 'An error occurred while trying to update mypicks likes';
      return res.status(status).json(response);
    } 
     
    response.error = false;
    response.msg = 'Like Comments successfully';   
    status = 201;
    
    res.status(status).json(response);
  });


function newResponseJson() {
    return {error: true, msg: "", data: []};
}
module.exports = router;
