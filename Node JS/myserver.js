var Chance = require('chance');
var chance = new Chance();
var crypto = require('crypto');
var express = require('express');
var cors = require('cors');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var BD = mysql.createConnection({
	host : 'localhost',
	user : 'up201007482',
	password : 'seg',
});

BD.connect(function(err) {
	if (err) console.log(err);
	var query = BD.query('USE up201007482;', function(err, res) {
		if (err) console.log(err);
	});
});

app.post('/register', function (request, response) {// register
	var name = request.body.name;
	var pw = request.body.pass;
	var query = BD.query('SELECT * FROM Users WHERE name = ?', [name], function(err,res) {
		if (err) console.log(err);
		if (res.length > 0) {//user existe
			console.log('user existe');
			var user = res[0];
			if (crypto.createHash('md5').update(pw + user.salt).digest('hex') == user.pass) {
				console.log("ok");
				response.json({});
			}
			else {
				console.log('pw errada');
				response.json({"error": "User registered with a different password"});
			}
		}
		else {// user nao existe
			console.log('novo user');
			var sal = chance.string({length : 4});
			var hash = crypto.createHash('md5').update(pw + sal).digest('hex');
			var post = { name : name, pass : hash, salt : sal };
			var query = BD.query('INSERT INTO Users SET ?', [post], function(err, res) {
				if (err) console.log(err);
				console.log('OK');
				response.json({});
			});
		}
	});
});

app.post('/ranking', function (request, response) {//ranking
	console.log('mostrar BD');
	var level = request.body.level;
	var query = BD.query('SELECT * FROM Rankings WHERE level = ? ORDER BY boxes DESC, time ASC LIMIT 10;', [level], function(err, res) {
		if (err)
		console.log(err);
		response.json({"ranking":res});
	});
	console.log('OK');
});

var sv = app.listen(8024, '0.0.0.0', function() {//poe o sv a correr
	console.log('a correr');
});
