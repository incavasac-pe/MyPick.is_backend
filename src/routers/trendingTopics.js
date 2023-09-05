const express = require("express"); 
const router = express.Router();
const TrendingTopics = require('../controllers/trendingTopics'); 

router.get('/list_trendingTopics', async (req, res) => {
    const response = newResponseJson();
    let status = 400; 
    response.error = true;     
 
    exist = await new TrendingTopics().getTrendingTopics();
    
    if (exist.rowCount === 0) {              
        response.msg = `TrendingTopics empty`;        
    }else  { 
     
            response.error = false;
            response.msg = `List TrendingTopics`; 
            response.data =  exist.rows
            status = 200;        
    }
    
    res.status(status).json(response)
});
  
router.get('/list_trendingTopics_category', async (req, res) => {
    const response = newResponseJson();
    let status = 400; 
    response.error = true; 
    const id_category = req.query.id_category;

 
    exist = await new TrendingTopics().getTrendingTopicsId(id_category);
    
    if (exist.rowCount === 0) {              
        response.msg = `TrendingTopics empty`;        
    }else  {      
        response.error = false;
        response.msg = `List TrendingTopics`; 
        response.data =  exist.rows
        status = 200;        
    }
    
    res.status(status).json(response)
});
   
function newResponseJson() {
    return {error: true, msg: "", data: []};
}
module.exports = router;
