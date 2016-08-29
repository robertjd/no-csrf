'use strict';

var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var fs = require('fs');

var exampleHtml = fs.readFileSync(path.join(__dirname,'views','example.html'),'utf-8');

var port = process.env.PORT || 3000;

var otherDomain = process.env.OTHER_DOMATIN || 'https://no-csrf-other-domain.herokuapp.com/';

var url = process.env.URL || 'http://localhost' + (process.env.PORT ? '' : ':'+port);

var app = express();

var jsonParser = bodyParser.json();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

exampleHtml = exampleHtml.replace('URL', url);

app.get('/', function (req, res) {
  if(req.headers.host.match(otherDomain)){
    return res.send(fs.readFileSync(path.join(__dirname,'views','other-domain.html'),'utf-8'));
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