Deliverables:
Source code 					✔	
Steps to setup server			✔
Api definition and how to test	✔
About souce / any detailed info	✔


/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/

STEPS TO SETUP SERVER

Need to have installed:
	-> Nodejs, npm, mysql 

Running the program with automatically setup the mysql database, if not present.

The program uses "bookstore" as the name for the database.
If you have any other database using the same name:
	-> It might create problems, so change the name of the database.

The nodejs runs server by default on https://localhost:80
	-> Can be changed by changing the constants at the start of the "server.js" file

The frontend is hard-coded to send the requests to "localhost" only.
	-> So if changing server ip, need to change in fronend too.
	-> If having a proper domain, the commented line in "public/main.js" line 27 can be used.

/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/

API DEFINITION AND HOW TO TEST:

All api calls are done to "https://localhost:80/api" path.

Only POST and PUT req need body; that contains the data to be updated/entered.
GET and DELETE request have url parameters; that contain what data to get/delete.

To test:
	GET req:
		Entering these directly in browser, gives req output
		Eg GET request: http://localhost/api?data=all
						http://localhost/api?data=1,2
			Expected url parms 	: "?data=all" or "?data=id1,id2,id3"
			Will reply			: {books:[[id, name, author],...]}
			Eg					: req('GET', '?data=all')

	DELETE req:
		Cant just type in browser.
		Created a re-useable req function in "public/main.js". Recomended to use it. 
			Req url 			: "http://localhost/api/?id=6"
			Expected url parms 	:  in "/api" ?data=id
			Will reply			: {result:"ok"}
			Eg					: req('DELETE', '?id=' + id)

	PUT req:
		Cant just type in browser.
		Created a re-useable req function in "public/main.js".
			Req url 		: "http://localhost/api"
			Expected body 	: {book:{id, name, author, desc}}
			Will reply		: {result:"ok"}
			Eg				: req('PUT', '', {book: ["id", "name", "author", "desc"]})

	POST req:
		Cant just type in browser.
		Created a re-useable req function in "public/main.js".
			Req url 		: "http://localhost/api/?id=6"
			Expected body 	: {books:[name, author]]
			Will reply		: {result:"ok"}
			Eg				: req('POST', '', {books: ["name", "author", "desc"]})

	Re-useable req function: req(requst_type, url_parameters, body_data(optional))

/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/


ABOUT SOURCE:

Nodejs server, using express framework.
Files in "public" folder shared as static.
Created database class, to handle mysql queries.

Frontend, html, js, css, and one image for favicon.
Simple, but all functions working.
The database shown in bottom if updated automatically after every requst.
The search bar searches by name, author and description.