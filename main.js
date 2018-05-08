var mongoose = require('mongoose');
const express = require('express');
const app = express();
var path = require('path');

mongoose.connect('mongodb://localhost/myframesdb', function(err)
{
    if(err)
    {
        throw err;
    }
    console.log('The DB connection is successfully established :)');
});

app.use(express.static(__dirname + '/dist'));
app.set('views', __dirname + '/dist');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/', function(req, res)
{
    res.render('main.html');
});


app.listen(3000, () => console.log('App is running http://localhost:3000'));