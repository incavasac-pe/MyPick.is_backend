const express = require("express"); 
const router = express.Router();
const Picks = require('../controllers/picks');
const Choice = require('../controllers/choice');
const Category =  require('../controllers/category');
const Auth = require('../controllers/auth');


const path = require('path'); 
const fs = require('fs');  

router.get('/', function (req, res) {
  res.render('uploadForm.ejs')
})
 
const _dirname = './public/uploads';

router.get('/list_all_picks', async (req, res) => {
    const response = newResponseJson();
    let status = 400; 
    response.error = true;  
    const limit = req.query.limit ?? 100;
    exist = await new Picks().getPicksAll(limit);
    
    if (exist.rowCount === 0) {              
        response.msg = `picks empty`;        
    }else  { 
     
            response.error = false;
            response.msg = `List picks`; 
            response.data =  exist.rows
            status = 200;        
    }    
    res.status(status).json(response)
});
  
router.get('/list_my_picks', async (req, res) => {
    const response = newResponseJson();
    let status = 400; 
    response.error = true; 
    const email = req.query.email;
    
    const result_user = await new Auth().getUserByEmail(email);
    if (result_user.rowCount == 0) {  
        response.msg = `User does not exist`;  
        return res.status(status).json(response);   
    } 
    const user = result_user.rows[0].id
    exist = await new Picks().getPicks(user);
    
    if (exist.rowCount === 0) {              
        response.msg = `picks empty`;        
    }else  { 
     
            response.error = false;
            response.msg = `List picks`; 
            response.data =  exist.rows
            status = 200;        
    }
    
    res.status(status).json(response)
});

router.post('/register_picks', async (req, res) => {
    const response = newResponseJson();
    let status = 400;
    response.error = true;
    
    const { email,id_category, name_choice1, name_choice2  } = req.body;   
  
    let EDFile1 = req.files.photo1; 
    EDFile1.mv(`${_dirname}/${EDFile1.name}`,err => { 
        if(err){ return res.status(500).send({ message : err })}       
    })
   
    let EDFile2 = req.files.photo2; 
    EDFile2.mv(`${_dirname}/${EDFile2.name}`,err => { 
        if(err){ return res.status(500).send({ message : err })}       
    })
   
    const result_user = await new Auth().getUserByEmail(email);
    if (result_user.rowCount == 0) {  
        response.msg = `User does not exist`;  
        return res.status(status).json(response);   
    } 

    if (id_category.trim() === '') {
      response.msg = 'empty data';
      return res.status(status).json(response);
    }
    
    const categoryExists = await new Category().getCategoryid(id_category);
    
    if (categoryExists.rowCount === 0) {
      response.msg = 'category not  exists';
      return res.status(status).json(response);
    }
   
    let result_insert_choice1 = await new Choice().createChoices(name_choice1, EDFile1.name);
    let result_insert_choice2 = await new Choice().createChoices(name_choice2, EDFile2.name);

    if (!result_insert_choice1?.rowCount || result_insert_choice1?.rowCount === 0) {
      response.msg = 'An error occurred while trying to create choice_1';
      status = 500;
      return res.status(status).json(response);
    }
    
    if (!result_insert_choice2?.rowCount || result_insert_choice2?.rowCount === 0) {
      response.msg = 'An error occurred while trying to create choice_2';
      status = 500;
      return res.status(status).json(response);
    }
   
    let result_insert_pick = await new Picks()
    .createPicks(
            id_category,
            result_insert_choice1.rows[0].id_choice,
            result_insert_choice2.rows[0].id_choice,
            result_user.rows[0].id,         
         );
  
    if (!result_insert_pick?.rowCount || result_insert_pick?.rowCount === 0) {
      response.msg = 'An error occurred while trying to create pick';
      status = 500;
      return res.status(status).json(response);
    }
    
    response.error = false;
    response.msg = 'Category created successfully';
    response.data = result_insert_pick.rows[0].id_pick;
    status = 201;
    
    res.status(status).json(response);
  });

  router.post('/select_picks', async (req, res) => {
    const response = newResponseJson();
    let status = 400;
    response.error = true;
    
    const { id_pick, id_choice } = req.body;   
    

    if (id_pick === '' || id_choice === '') {
      response.msg = 'empty data';
      return res.status(status).json(response);
    }
    
    const pick_update = await new Picks().updateRankinkPicks(id_pick);  
    
    if (!pick_update?.rowCount || pick_update.rowCount === 0) {
      response.msg = 'An error occurred while trying to update mypicks';
      return res.status(status).json(response);
    }
    const choice_update = await new Choice().updateRankinkChoice(id_choice);   

    if (!choice_update?.rowCount || choice_update?.rowCount === 0) {
      response.msg = 'An error occurred while trying to update choice_1';
      status = 500;
      return res.status(status).json(response);
    }
    const picks_percente = await new Picks().getPicksPorcentage(id_pick);
     
    response.error = false;
    response.msg = 'Select pick successfully';
    response.data = picks_percente.rows
    status = 200;
    
    res.status(status).json(response);
  });

function newResponseJson() {
    return {error: true, msg: "", data: []};
}
module.exports = router;
