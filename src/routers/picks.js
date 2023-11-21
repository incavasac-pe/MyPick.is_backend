const express = require("express"); 
const router = express.Router();
const Picks = require('../controllers/picks');
const Choice = require('../controllers/choice');
const Category =  require('../controllers/category');
const Auth = require('../controllers/auth');


const path = require('path'); 
const fs = require('fs');  
 
const _dirname = './public/uploads';

router.get('/list_all_picks', async (req, res) => {
    const response = newResponseJson();
    let status = 400; 
    response.error = true;  
    const limit = req.query.limit ?? 100; 
    const ip_maq = req.query.ip_maq  ?? '';
    const email = req.query.email  ?? '';
    const id_pick = req.query.id_pick  ?? '';
 
     exist = await new Picks().getPicksAll(limit,id_pick);
    if (exist?.rowCount === 0) {              
        response.msg = `picks empty`;        
    }else  {  

    let id_user = 999999; 
    const result_user = await new Auth().getUserByEmail(email);
    if (result_user?.rowCount > 0) {  
      id_user = result_user?.rows[0].id
    } 
      const existLikePick = await new Picks().getLikesByUserIdAndIp(ip_maq,id_user);
      let arrayInsert = []
          arrayInsert = existLikePick?.rowCount > 0 ? existLikePick.rows[0].id_pick_like  : arrayInsert
     
      const flag = validarNumeroExistente(arrayInsert, exist?.rows[0].id) 
        response.error = false;
        response.msg = `List picks`; 
        response.data =  exist.rows
        response.other = flag
        status = 200;        
    }    
    res.status(status).json(response)
});
  

router.get('/list_all_picks_search', async (req, res) => {
  const response = newResponseJson();
  let status = 400; 
  response.error = true;   
  const search = req.query.search  ?? '';

   exist = await new Picks().getPicksAllSearch(search);
  if (exist?.rowCount === 0) {              
      response.msg = `Result not found`;        
  }else  {  
 
      response.error = false;
      response.msg = `List picks search`; 
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
    const id_category = req.query.id_category  ?? '';
    const result_user = await new Auth().getUserByEmail(email);
    if (result_user.rowCount == 0) {  
        response.msg = `User does not exist`;  
        return res.status(status).json(response);   
    } 
    const user = result_user.rows[0].id
    exist = await new Picks().getPicks(user,id_category);
    
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
    
    const { email,id_category, name_choice1, name_choice2 ,ulr_choice1,ulr_choice2 } = req.body;   
  
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
   
    let result_insert_choice1 = await new Choice().createChoices(name_choice1, EDFile1.name,ulr_choice1);
    let result_insert_choice2 = await new Choice().createChoices(name_choice2, EDFile2.name,ulr_choice2);
 
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
    await new Picks().createPicksComen(result_insert_pick.rows[0].id_pick, result_user.rows[0].id);

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
    
    const { id_pick, id_choice,email } = req.body;   
    

    if (id_pick === '' || id_choice === '') {
      response.msg = 'empty data';
      return res.status(status).json(response);
    }
    let id_user = 99999; 
    const result_user = await new Auth().getUserByEmail(email);
    if (result_user.rowCount>0) {  
      id_user = result_user.rows[0].id
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
    await new Picks().createVoto(id_pick,id_choice,id_user ) 
    const picks_percente = await new Picks().getPicksPorcentage(id_pick);
     
    response.error = false;
    response.msg = 'Select pick successfully';
    response.data = picks_percente.rows
    status = 200;
    
    res.status(status).json(response);
  });

  router.post('/register_like', async (req, res) => {
    const response = newResponseJson();
    let status = 400;
    response.error = true;
     
    const { id_pick,ip_maq ,email} = req.body;     
    if (id_pick === '' ) {
      response.msg = 'empty data';
      return res.status(status).json(response);
    }

    let id_user = 999999; 
    const result_user = await new Auth().getUserByEmail(email);
    if (result_user?.rowCount > 0) {  
      id_user = result_user.rows[0].id
    } 
      
    existLikePick = await new Picks().getLikesByUserIdAndIp(ip_maq, id_user);
    let arrayInsert = [];
    arrayInsert = existLikePick?.rowCount > 0 ? existLikePick.rows[0].id_pick_like  : arrayInsert;
  
    const newArray = validarNumeroExistente(arrayInsert, id_pick) ;
    if (newArray) {
        const index = arrayInsert.indexOf(id_pick.toString());
        if (index > -1) {
            arrayInsert.splice(index, 1);
        }
    } else {
        arrayInsert.push(id_pick.toString())
    } 
   
    await new Picks().insertLikePick(ip_maq,id_user,arrayInsert)   
    const pick_update = await new Picks().updateLikesPicks(id_pick,newArray);  
     
    if (!pick_update?.rowCount || pick_update.rowCount === 0) {
      response.msg = 'An error occurred while trying to update mypicks likes';
      return res.status(status).json(response);
    } 

     
    response.error = false;
    response.msg = 'Like pick successfully';   
    status = 200;
    response.data =pick_update.rows
     response.other = !newArray
    
    res.status(status).json(response);
  });

  
router.get('/my_pick_vote', async (req, res) => {
  const response = newResponseJson();
  let status = 400; 
  response.error = true; 
  const email = req.query.email;

  const result_user = await new Auth().getUserByEmail(email);
  if (result_user.rowCount == 0) {  
      response.msg = `User does not exist`;  
      return res.status(status).json(response);   
  } 
  const id_user = result_user.rows[0].id  

  exist = await new Picks().getMyPickerVote (id_user);
  
  if (exist.rowCount === 0) {              
      response.msg = `My picks vote empty`;        
  }else  {      
      response.error = false;
      response.msg = `List My picks vote `; 
      response.data =  exist.rows
      status = 200;        
  }
  
  res.status(status).json(response)
});

function validarNumeroExistente(array, numero) { 
    if (array.includes(numero.toString())) { 
        return true;
    } else { 
        return false;
    }
}
  function eliminarPuntos(texto) {
  return texto.replace(/\./g, '');
}


function newResponseJson() {
    return {error: true, msg: "", data: [],other:false};
}
module.exports = router;
