var express = require('express');
var app = express();
var exphbs  = require('express-handlebars');
var mongodb = require('mongodb');
var validate = require('url-validator');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://urlhero:654321@ds021326.mlab.com:21326/url-database';

var port = process.env.PORT || 3000;

//View engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//listen app to certain port
app.listen(port,function(err){
  if(err){
    console.log('PORT error :' + err);
  } else{
    console.log('Server listening on port 3000');
  }
});

//Render HomePage
app.get('/',function(req,res){
  res.render('index');
})

//take url for shortening
app.get('/new/:url*',function(req,res){
  var originalUrl = req.url.slice(5);
  if(validate(originalUrl)){ //validatin input url

    var hostname = 'https://hidden-peak-34480.herokuapp.com';
    var nuu = randNum();
    var shortUrl = hostname+'/'+nuu;
    saveUrl(originalUrl,shortUrl,nuu);
    res.json({
      "Orginal URL" : originalUrl,
      "Short URL" : shortUrl
    });

  } else {
    res.json({
      "URL ERROR" : "Wrong url format, make sure you have a valid protocol and real site."
    });
  }
  res.end();
});

//take shortUrl as input
app.get('/:inputUrl',function(req,res){
  var input = req.path.slice(1);
  searchDB(input,res);
});


//generate ramdom number
function randNum(){
  return (Math.random()*10000).toFixed();
}

//save URL to database
function saveUrl(originalUrl,shortUrl,n){
  MongoClient.connect(dbUrl,function(err,db){
    if(err){
      console.log('DB error : '+ err);
    } else {
      console.log('DB connection established');
      var collection = db.collection('test');
      collection.insert({
        "orgiUrl": originalUrl,
        "shoUrl" : shortUrl,
        "urlNum" : n
      },function(err,doc){
        db.close();
      });
    }
  });
}

//search database for url
function searchDB(numb,res){
  MongoClient.connect(dbUrl,function(err,db){
    if(err){
      console.log('Search database err :-- '+err);
    } else{
      var collection = db.collection('test');
      collection.findOne({"urlNum" : numb},function(err,doc){
        if(err){
          console.log('Find error :-- '+err);
        } else {
          if(doc){
            console.log('Redirecting to :-- '+doc.orgiUrl);
            res.redirect(doc.orgiUrl);
            db.close();
          } else {
            res.json({
              "ERROR" : "This url is not in the database"
            });
          }

        }
      });
    }
  });
}
