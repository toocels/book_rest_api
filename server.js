require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const SERVER_IP = "localhost";
const SERVER_PORT = 80;

class Database {
	constructor() {
		// try to connect
		this.con = mysql.createConnection({
			host: "localhost",
			user: process.env.SQLuser,
			password: process.env.SQLpass
		});
		this.con.connect(function(err) {
			if (err) throw err;
			console.log("Mysql Connected.");
		});

		// check if the database exists, if not, create n initialize it
		this.runQuery('use bookstore;', (err, data) => {
			if (err) {
				var database_init_cmds = [
					'create database bookstore;',
					'use bookstore;',
					'create table books (id int unique auto_increment, name varchar(64), author varchar(64), description text);'
				]
				for (var command in database_init_cmds)
					this.runQuery(database_init_cmds[command], (err, data) => {})
				console.log("Database initialised.") //create database if not already created in computer.
			}
		})
	}

	runQuery(query_in, callback) {
		return this.con.query(query_in, function(err, result) {
			if (err) {
				callback(err, null);
				console.log("[ MYSQL ] Error: ", err["sql"])
			}
			else {
				callback(null, result);
			}
		});
	}
}

let main_database = new Database()
app = express();
app.use(express.static("public")) // to serve the html, css, js stuff

app.get('/api', (req, res) => {
	const urlParams = new URLSearchParams(req._parsedUrl.search);
	res.setHeader('Access-Control-Allow-Origin', '*');

	if (urlParams.get('data') == "all") {
		main_database.runQuery('select * from books;', (err, data) => {
			res.send(JSON.stringify({
				"books": data
			}))
		})
	} else {
		var list = urlParams.get('data').split(',')
		var query = "SELECT * FROM books WHERE "
		for (var i = 0; i < list.length - 1; i++) {
			query += "id=" + list[i] + " or "
		}
		query += "id=" + list[list.length - 1] + ";"

		main_database.runQuery(query, (err, data) => {
			res.send(JSON.stringify({
				"books": data
			}))
		})
	}
})

app.delete('/api', (req, res) => { // no body for get and delete
	const urlParams = new URLSearchParams(req._parsedUrl.search);
	res.setHeader('Access-Control-Allow-Origin', '*');

	main_database.runQuery("DELETE FROM books WHERE id=" + urlParams.get('id'), (err, data) => {})

	res.send(JSON.stringify({
		"result": "ok"
	}))
});

app.post('/api', (req, res) => {
	let body = '';
	req.on('data', data => body += data)
	req.on('end', () => {
		res.setHeader('Access-Control-Allow-Origin', '*');

		books = JSON.parse(body)["books"];

		var cmd = 'INSERT INTO books (name,author,description) VALUES (\"' + books[0] + '\",\"' + books[1] + '\",\"' + books[2] + '\");'
		main_database.runQuery(cmd, (err, data) => {})

		res.end(JSON.stringify({
			"result": "ok"
		}))
	});
});

app.put('/api', (req, res) => {
	let body = '';
	req.on('data', data => body += data)
	req.on('end', () => {
		res.setHeader('Access-Control-Allow-Origin', '*');

		book = JSON.parse(body)["book"];

		var cmd = 'UPDATE books SET name=\"' + book[1] + '\", author=\"' + book[2] + '\", description=\"' + book[3] + '\" WHERE id=' + book[0] + ';'
		main_database.runQuery(cmd, (err, data) => {})

		res.end(JSON.stringify({
			"result": "ok"
		}))
	});
});

app.listen(SERVER_PORT, SERVER_IP, error => {
	if (error) console.log("[ SERVER ]  Error in server startup.");
	else console.log("[ SERVER ]  Example app listening at http://" + SERVER_IP + ":" + SERVER_PORT)
});