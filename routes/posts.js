var express = require('express');
var router = express.Router();
var mongo=require('mongodb');
var db= require('monk')('localhost/nodeblog');
var multer = require('multer');
var upload = multer({dest: './public/images/uploads'});

router.get('/show/:id',function(req,res,next){
  var posts=db.get('posts');
  posts.findById(req.params.id,function(err,post){
    res.render('show',{
      'post':post
    });
  });
});

router.get('/add', function(req,res,next){
  var db= req.db;
  var categories = db.get('category');
  categories.find({},{}, function(err,categories){

    res.render('addpost',{
      "title": "Add Post",
      "categories": categories
    });

  });
});
router.post('/add', upload.single('mainimage'), function (req, res, next) {
  //Get Form Values
//   var items ={
//    title: req.body.title,
//    category : req.body.category,
//    body: req.body.body,
//    author : req.body.author,
//    date : new Date()

//  };
var title=req.body.title;
var category=req.body.category;
var body=req.body.body;
var author=req.body.author;
var date=new Date();


   if(req.file){
    var mainImageName=req.file.name
   }
   else{
     var mainImageName = "noimage.png";

   }
   // Form Validation
   req.checkBody('title', 'Title Field is Required').notEmpty();
   req.checkBody('body', 'Body Field is Required').notEmpty();

   // Check errors
   var errors= req.validationErrors();

   if(errors){
     res.render('addpost',{
       "errors": errors,
       "title":"hey",
       "body":"oops"
     });
   }else{
     var posts= db.get('posts');
     //db.close();

      // Submit to //
        posts.insert({
          "title":title,
          "body":body,
          "category":category,
          "date":date,
          "author":author
         
                      
          }, function(err, post){
          if(err){
            
            console.log(title);
          } 
          else{
            req.flash('success','Post Submitted');
            res.location('/');
            res.redirect('/');
           

          }

        });


          
   }
});




module.exports = router;
