const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient

var db

MongoClient.connect('mongodb://localhost:27017/posts', (err, database) => { //products is database + lijn 37
  if (err) return console.log(err)
  db = database // from version 3 : db = database.db('products')
  app.listen(process.env.PORT || 4000, () => {
    console.log('Listening on port 4000')
  })
})

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

// Redirect to posts
app.get('/', (req, res) => {
   res.redirect('/posts');
});

// List all posts
app.get('/posts', (req, res) => {
  db.collection('posts').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('posts.ejs', {posts: result})
  })
});

// Show the search form
app.get('/search', (req, res) => {
   res.render('search.ejs', { post: '' });
});

// Find all comments for post
app.post('/search', (req, res) => {
  var query = { name: req.body.title }
  db.collection('posts').find(query).toArray(function(err, result) {
    if (err) return console.log(err)
    if (result != '')
        res.render('search_result.ejs', { post: result[0] })
  });
});
