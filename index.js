var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/bower_components'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');
});

app.post('/', function (request, response) {
    var name = request.body.name;
    if (!name || !/[a-zA-Z0-9-]{5,30}/.test(name)) {
        name = 'default'
    }
    response.redirect('/main/' + name);
});

app.get('/main/:name([a-zA-Z0-9-]{5,30})', function (request, response) {
    var name = request.params.name || 'default';
    response.render('pages/main', {name: name});
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});


