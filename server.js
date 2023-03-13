require('dotenv').config();
const os = require('os');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql');

const SERVER_IP = "localhost";
const SERVER_PORT = 80; // process.env.SERVER_PORT

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
				var database_init_cmds = ['create database bookstore;',
					'use bookstore;',
					'create table books (id int unique auto_increment, name varchar(64), author unique varchar(64), description text);'
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

app.get('/api/*', (req, res) => {
	const urlParams = new URLSearchParams(req._parsedUrl.search);
	console.log(req.params[0].split('/')) // from client
	console.log("delete:",urlParams.get('data'));

	res.send(JSON.stringify({
		"stat": "get_ok"
	})) // reply
})

app.delete('/api', (req, res) => { // no body for get and delete
	console.log(req.params[0].split('/')) // from client
	res.send(JSON.stringify({
		"stat": "delete_ok"
	})) // reply
});

app.post('/api', (req, res) => {
	let body = '';
	req.on('data', data => body += data)
	req.on('end', () => {
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, GET',
		});

		console.log(JSON.parse(body));
		res.end(JSON.stringify({
			"ok": "OK"
		}));
	});
});

app.put('/api', (req, res) => {
	let body = '';
	req.on('data', data => body += data)
	req.on('end', () => {
		res.writeHead(200, {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, GET',
		});

		console.log(JSON.parse(body));
		res.end(JSON.stringify({
			"ok": "OK"
		}));
	});
});

app.listen(SERVER_PORT, SERVER_IP, error => {
	if (error) console.log("[ SERVER ]  Error in server startup.");
	else console.log("[ SERVER ]  Example app listening at http://" + SERVER_IP + ":" + SERVER_PORT)
});