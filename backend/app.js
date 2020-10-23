const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts-route')
const app = express();

mongoose.connect('mongodb+srv://meanblogroot:BXKFYs1oUUv5OMyO@cluster0.tjufv.mongodb.net/mean-blog?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(_ => console.log('connected to database'))
  .catch(error => console.log('Connection failed' + error));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS')

  next();
});

app.use('/api/posts', postsRoutes);

module.exports = app;
