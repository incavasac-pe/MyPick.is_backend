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
const PORT = process.env.PORT || 3000;
 
app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })
 

  //import the routes
const userRoutes = require('./src/routers/auth'); 

app.use(userRoutes); 
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
  })
