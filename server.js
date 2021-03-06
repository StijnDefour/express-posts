const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const request = require('request');


app.listen(process.env.PORT || 3000, () => {
  console.log('Listening on port 3000')
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
  request({
    url: 'http://jsonplaceholder.typicode.com/posts',
    json: true
  }, function(err, response, body) {
    if (err) return console.log(err)
    res.render('posts.ejs', {posts: body})
  });

});

// Show the search form
app.get('/search', (req, res) => {
   res.render('search.ejs', { posts: '' });
});

// Find all comments for post
app.post('/search', (req, res) => {
  var query = req.body.title;
  /*db.collection('posts').find(query).toArray(function(err, result) {
    if (err) return console.log(err)
    if (result != '') res.render('search_result.ejs', { post: result[0] })
  });*/

  request({
    url: 'http://jsonplaceholder.typicode.com/posts',
    json: true
  }, function(err, response, body) {
    if (err) return console.log(err)

    var result = -1;

    var i = 0;
    while (i < body.length) {
      if (query == body[i].title) {
        result = i;
      }
      i++;
    }

    if (result != -1) {
      console.log(body[0].title);
      res.render('search_result.ejs', { post: body[result] })
    }
  });

});
