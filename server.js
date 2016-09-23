var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var dbUrl = 'mongodb://urlhero:654321@ds021326.mlab.com:21326/url-database';

var port = process.env.PORT || 3000;

app.listen(port,function(err){
  if(err){
    console.log('PORT error :' + err);
  } else{
    console.log('Server listening on port 3000');
  }
});

app.get('/new/:url*',function(req,res){
  var originalUrl = req.url.slice(5);
  var hostname = 'https://hidden-peak-34480.herokuapp.com';
  console.log(originalUrl);
  var shortUrl = hostname+'/'+randNum();
  saveUrl(originalUrl,shortUrl);
  console.log(shortUrl);
  res.end();
});

app.get('/:inputUrl*',function(req,res){
  var input = req.hostname + req.path;
  var urlFromDb = searchDB(input);
  console.log(input);
  console.log(urlFromDb);
  res.redirect(urlFromDb);
  res.end();
})

//generate ramdom number
function randNum(){
  return (Math.random()*10000).toFixed();
}

//save URL to database
function saveUrl(originalUrl,shortUrl){
  MongoClient.connect(dbUrl,function(err,db){
    if(err){
      console.log('DB error : '+ err);
    } else {
      console.log('DB connection established');
      var collection = db.collection('storeurl');
      collection.insert({
        "orgiUrl": originalUrl,
        "shoUrl" : shortUrl
      },function(err){
        console.log('Inserted');
      });
    }
  });
}

//search database for url
function searchDB(queryUrl){
  MongoClient.connect(dbUrl,function(err,db){
    if(err){
      console.log('Searching DB error :' + err);
    } else{
      console.log('Ready for search');
      var collection = db.collection('storeurl');
      var q = queryUrl;
      console.log(q);
      collection.find({shoUrl : queryUrl }).toArray(function(err, results){
          console.log(results); // output all records
          return(results.orgiUrl);
      });
    }
  });
}
