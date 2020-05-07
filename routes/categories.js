var express = require('express');
var router = express.Router();
var mongo=require('mongodb');
var db= require('monk')('localhost/nodeblog');
var multer = require('multer');
var upload = multer({dest: './public/images/uploads'});

router.get('/show/:category', function(req,res,next){
  var db=req.db;
  var posts=db.get('posts');
  posts.find({category: req.params.category}, {}, function(err, posts){
    res.render('index',{
      'title':req.params.category,
      'posts':posts

    });
  });
});


router.get('/add', function(req, res, next) {
  res.render('addcategory',{
    "title": "Add Category"
  });
});

router.post('/add', upload.single('mainimage'),function (req, res, next) {
  //Get Form Values
  var title = req.body.title;
   // Form Validation
   req.checkBody('title', 'Title Field is Required').notEmpty();

   // Check errors
   var errors= req.validationErrors();

   if(errors){
     res.render('addcategory',{
       "errors": errors,
       "title":title

     });
   }else{
     var posts= db.get('category');
    // db.close();

     // Submit to //
        posts.insert({
          'title':title
        }, function(err, post){
          if(err){
            res.send('There was an issue submitting the post'); 
            console.log(title);
          }else{
            res.location('/');
            res.redirect('/');
          }

        });


         
   }
});

router.post('/test', function(req,res,next){
  res.send(req.body.test);

});

module.exports = router;
