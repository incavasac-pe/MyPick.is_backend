const express = require('express'); 
const router = express.Router();
const Auth = require('../controllers/auth');

const path = require('path'); 
const fs = require('fs');  

router.get('/', function (req, res) {
  res.render('uploadForm.ejs')
})
 
const _dirname = './public/uploads';

router.post('/change_photo',async (req,res) => {
   const email = req.query.email;  

    let EDFile = req.files.file; 
    EDFile.mv(`${_dirname}/${EDFile.name}`,err => { 
        if(err){ return res.status(500).send({ message : err })}
         new  Auth().updatePhoto(`${EDFile.name}`,email);
         photo = path.resolve(`${_dirname}/${EDFile.name}`); 
         res.status(200).json({data:photo})         
    })

});

router.get('/see_photo', function(req, res){
   const img = req.query.img; 
  let pathFoto;
   if(img){
    pathFoto = path.resolve(`${_dirname}/${img}`);
  //Si la imagen existe
      const existe = fs.existsSync(pathFoto);        
      if (!existe) {
        pathFoto = path.resolve(`${_dirname}/producto-sin-imagen.png`);     
      } 
    }else{
      pathFoto = path.resolve(`${_dirname}/producto-sin-imagen.png`);     
    }
  res.sendFile(pathFoto);  
});
 
module.exports = router