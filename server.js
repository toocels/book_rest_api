require('dotenv').config();
const os = require('os');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql');
const exec = require('util').promisify(require('child_process').exec);

const SERVER_IP = "localhost";
const SERVER_PORT = 80; // process.env.SERVER_PORT

class Server {
	constructor(SERVER_IP, SERVER_PORT, DATABASE) {
		this.SERVER_PORT = SERVER_PORT
		this.SERVER_IP = SERVER_IP
		this.DATABASE = DATABASE
		this.app = express();
		this.post_req();

		this.app.use(express.static("public")) // if in static, thats sent, else, get_req called/ GG
		// this.get_req();

		console.log("[ SERVER ]  Started server.")
	}

	start_server() {
		this.app.listen(this.SERVER_PORT, this.SERVER_IP, error => {
			if (error)
				console.log("[ SERVER ]  Error in server startup.");
			else
				console.log("[ SERVER ]  Example app listening at http://" + this.SERVER_IP + ":" + this.SERVER_PORT)
		});
	}

	get_req() {
		this.app.get('*', (req, res) => {
			// var a = Math.floor(Math.random() * 69420)
			// var files_folders = ["projects_showcase", "sticky_notes.txt", "Aasaiye Alai Poley.mp3"]
			// var cmd = "zip -r ./public/storage/files/" + a + ".zip ./public/storage/files/"
			// cmd = cmd + data
			// for (var i in files_folders)
			// 	cmd = cmd.concat("./public/storage/files/" + files_folders[i].replace(/ /g, "\\ ") + ' ')

			// console.log(cmd)
			// exec(cmd).then(res => {
			// 	console.log(res.stdout)
			// 	res.sendFile(__dirname + "/public/storage/files/" + a + ".zip")
			// }).catch(e => {
			// 	console.log(e)
			// })

			// console.log(req)

			// console.log(req)
			// res.sendFile(__dirname + req.url)
			// res.render("public/index")
			// res.download("app.js")
			// res.json({"message":"error"});
			// res.sendStatus(500);
			// res.send("Hello");
			// res.redirect("/page")
			console.log("[ SERVER ]  Req path: " + req.path)
		})
	}

	post_req() {
		this.app.post('*', (req, res) => {
			let body = '';
			req.on('data', data => body += data)
			req.on('end', () => {
				res.writeHead(200, {
					'Content-Type': 'application/json',
					'Access-Control-Allow-Origin': '*',
					'Access-Control-Allow-Methods': 'POST, GET',
				});
				body = JSON.parse(body)

				// console.log(body)
				var purpose = body["purpose"]
				var data = body["data"]
				var path = req.originalUrl;
				var reply = {
					"purpose": purpose,
					"data": null
				}

				switch (path) {
					case "/login":
					case "/login/":
						let cookies = req.headers.cookie
						let username = this.getCookie(cookies, "username");
						let password = this.getCookie(cookies, "password");
						switch (purpose) {
							case "isUser":
								this.DATABASE.runQuery("select username, password from users;", (err, data) => {
									for (var row in data) {
										if (data[row]['username'] == username && data[row]['password'] == password) {
											reply["data"] = "yes"
											res.end(JSON.stringify(reply))
											return;
										}
									}
									reply["data"] = "no"
									res.end(JSON.stringify(reply))
								})
								break;
							case "isAdmin":
								this.DATABASE.runQuery("select username from users where isAdmin=1;", (err, data) => {
									for (var row in data) {
										if (data[row]['username'] == username) {
											reply["data"] = "yes"
											res.end(JSON.stringify(reply))
											return;
										}
									}
									reply["data"] = "no"
									res.end(JSON.stringify(reply))
								})
								break;
						}
						break;

					case "/blogs/":
						switch (purpose) {
							case "blogs_list":
								this.DATABASE.runQuery('SELECT id, heading, head_image, description, DATE_FORMAT(time_stamp, "%d/%m/%Y %h:%i %p") as time_stamp from blogs ORDER BY DATE_FORMAT(time_stamp, "%Y/%m/%d %h:%i %p") desc;', (err, data) => {
									reply["data"] = JSON.stringify(data);
									res.end(JSON.stringify(reply))
								})
								break;
							case "delete_blog":
								this.DATABASE.runQuery("DELETE from blogs where id=" + body["blog_id"] + ";", (err, data) => {
									reply["data"] = JSON.stringify(data);
									res.end(JSON.stringify(reply))
								})
								break;
						}
						break;

					case "/blogs/blog_create/":
						var blog = JSON.parse(body["blog_create"])
						var values = '"' + blog["heading"] + '","' + blog["image"] + '","' + blog["description"] + '",' + JSON.stringify(blog["content"]) + ',"' + blog["time_stamp"] + '"'
						this.DATABASE.runQuery("INSERT INTO blogs(heading, head_image, description, content, time_stamp) VALUES(" + values + ");", (err, data) => {
							reply["data"] = "ok";
							res.end(JSON.stringify(reply))
						})
						break;

					case "/blogs/blog_view/":
						this.DATABASE.runQuery('SELECT id, heading, head_image, description, content, DATE_FORMAT(time_stamp, "%d/%m/%Y %h:%i %p") as time_stamp FROM blogs WHERE id=' + body["blog_id"], (err, data) => {
							if (data != null) reply["data"] = data[0]; // only 1 entry is sent
							else reply["data"] = "nope";
							res.end(JSON.stringify(reply))
						})
						break;

					case "/blogs/blog_edit/":
						switch (purpose) {
							case "blog_view":
								this.DATABASE.runQuery('SELECT id, heading, head_image, description, content, DATE_FORMAT(time_stamp, "%d/%m/%Y %h:%i %p") as time_stamp FROM blogs WHERE id=' + body["data"] + ';', (err, data) => {
									if (data != null) reply["data"] = data[0]; // only 1 entry is sent
									else reply["data"] = "nope";
									res.end(JSON.stringify(reply))
								})
								break;

							case "blog_edit":
								data = JSON.parse(data)
								this.DATABASE.runQuery('UPDATE blogs SET heading="' + data["heading"] + '", head_image="' + data["image"] + '", description="' + data["description"] + '", content=' + JSON.stringify(data["content"]) + ' WHERE id=' + data["id"], (err, data) => {
									reply["data"] = "ok";
									res.end(JSON.stringify(reply))
								})
								break;
						}
						break;
					
					default:
						console.log("[ SERVER ] Unknown req")
						console.log(path)
						// res.end(JSON.stringify(reply))
				}
			});
		});
	}

	getCookie(cookies, cname) {
		let name = cname + "=";
		let decodedCookie = decodeURIComponent(cookies);
		let ca = decodedCookie.split(';');
		for (let i = 0; i < ca.length; i++) {
			let c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return null;
	}
}

class Database {
	constructor() {
		this.con = mysql.createConnection({
			host: "localhost",
			user: process.env.SQLuser,
			password: process.env.SQLpass
		});
		this.con.connect(function(err) {
			if (err) throw err;
			console.log("Mysql Connected.");
		});

		this.runQuery('use toocels_web;', (err, data) => {
			if (err) {
				var database_init_cmds = ['create database bookstore;', 'use toocels_web;', 'create table users (username varchar(32) not null unique, password varchar(32) not null, email varchar(64), isAdmin bool);', 'insert into users values("too", "too", "too@gmail.com", true)', 'insert into users values("cels", "cels", "cels@gmail.com", false)', 'insert into users values("test", "test", "test@gmail.com", false)', 'create table blogs (id int unique auto_increment,heading varchar(64), head_image varchar(64), description TINYTEXT, time_stamp  DATETIME,content MEDIUMTEXT);']
				for (var command in database_init_cmds)
					this.runQuery(database_init_cmds[command], function(err, data) {})
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
let main_server = new Server(SERVER_IP, SERVER_PORT, main_database)
main_server.start_server()
