const express = require('express')
const bodyParser = require('body-parser')
const cors = require("cors");
const app = express()
require('dotenv').config();
const fileUpload = require('express-fileupload');
   
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(cors());
app.use(fileUpload());
const PORT = process.env.PORT || 3100;
 
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })
 

  //import the routes
const userRoutes = require('./src/routers/auth'); 
const categoryRoutes = require('./src/routers/category'); 
const upload = require('./src/routers/upload');
const picks = require('./src/routers/picks');
const bookmarks = require('./src/routers/bookmarks');

app.use(userRoutes); 
app.use(categoryRoutes); 
app.use(upload); 
app.use(picks);
app.use(bookmarks);

  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
  })
