const express = require("express"); 
const router = express.Router();
const Category = require('../controllers/category');

 
router.get('/list_category', async (req, res) => {
    const response = newResponseJson();
    let status = 400; 
    response.error = true; 
    const limit = req.query.limit;
 
    exist = await new Category().getCategoryAll(limit);
    
    if (exist.rowCount === 0) {              
        response.msg = `category empty`;        
    }else  { 
     
            response.error = false;
            response.msg = `List category`; 
            response.data =  exist.rows
            status = 200;        
    }
    
    res.status(status).json(response)
});
  
 router.post('/register_category', async (req, res) => {
    const response = newResponseJson();
    let status = 400;
    let bandera = false;
    response.error = true;
    const { category, status_c} = req.body;
     
    if (category.trim() == "") {
        bandera = true;        
        response.msg = 'empty data';      
    }
    exist = await new Category().getCategory(category);    
    if (exist.rowCount > 0) {
        bandera = true;       
        response.msg = `category exist`;        
    }
    if (!bandera) {      
        let result_insert = await new Category().createCategory(category, status_c);
      
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
