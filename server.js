'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var fs = require('fs');

var exampleHtml = fs.readFileSync(path.join(__dirname,'views','example.html'),'utf-8');

var port = process.env.PORT || 3000;

var otherDomain = process.env.OTHER_DOMATIN || 'https://csrf-attacker.herokuapp.com/';

var url = process.env.PRIMARY_URL || 'http://localhost' + (process.env.PORT ? '' : ':'+port);

var app = express();

var jsonParser = bodyParser.json();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

exampleHtml = exampleHtml.replace(/PRIMARY_URL/g, url);

app.get('/', function (req, res) {
  if(otherDomain.match(req.headers.host)){
    return res.send(fs.readFileSync(path.join(__dirname,'views','other-domain.html'),'utf-8').replace(/BODY/g,exampleHtml));
  }
  res.render('index', {
    exampleHtml: exampleHtml,
    url: url
  });
});

app.post('/form/json', jsonParser, function (req, res) {
  if(req.headers['content-type']!=='application/json') {
    return res.status(415).end('Unsupported Media Type');
  }
  res.json({
    message: 'You have posted to this endpoint',
    postedData: req.body
  });
});

app.listen(port);