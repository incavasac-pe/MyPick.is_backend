const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app = express();
require('dotenv').config();
const fileUpload = require('express-fileupload');

const PORT = process.env.PORT || 3100;

// Middleware
app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cors());
app.use(fileUpload());

// Routes
const routes = [
  require('./src/routers/auth'),
  require('./src/routers/category'),
  require('./src/routers/upload'),
  require('./src/routers/picks'),
  require('./src/routers/bookmarks'),
  require('./src/routers/trendingTopics'),
  require('./src/routers/comments'),  
  require('./src/routers/scraping'),   
  require('./src/routers/contact'),   
];

for (const route of routes) {
  app.use(route);
}

// Default route
app.get('/api', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}.`);
});