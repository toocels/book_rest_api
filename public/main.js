var prev_search = ""
var all_books;

window.setInterval(() => {
	var input_field = document.getElementById("search_books").value
	if (input_field != prev_search) {
		document.getElementById("list_of_books").innerHTML = "" // clear all blogs;

		renderTableHeading();
		for (var i in all_books) {
			if (all_books[i]["name"].toLowerCase().includes(input_field))
				renderBookList(all_books[i]["id"], all_books[i]["name"], all_books[i]["author"], all_books[i]["description"]);
			else if (all_books[i]["author"].toLowerCase().includes(input_field))
				renderBookList(all_books[i]["id"], all_books[i]["name"], all_books[i]["author"], all_books[i]["description"]);
			else if (all_books[i]["description"].toLowerCase().includes(input_field))
				renderBookList(all_books[i]["id"], all_books[i]["name"], all_books[i]["author"], all_books[i]["description"]);
		}
		window.scrollTo(0, document.body.scrollHeight);

		prev_search = input_field
	}
}, 200);

refreshBookList();

function req(type, urlParm, body_data = undefined) {
	// const url = window.location.origin + window.location.pathname + 'api/' + urlParm;

	const url = "http://localhost/api/" + urlParm
	console.log(url)
	if (body_data != undefined) {
		return fetch(url, {
				method: type,
				body: JSON.stringify(body_data)
			})
			.then((response) => response.json())
			.then((data) => {
				return data;
			});
	} else {
		return fetch(url, {
				method: type
			})
			.then((response) => response.json())
			.then((data) => {
				return data;
			});
	}
	return null;
}

function renderTableHeading() {
	var table = document.getElementById("list_of_books");

	var row = table.insertRow(0);

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);

	cell1.innerHTML = "ID";
	cell2.innerHTML = "NAME";
	cell3.innerHTML = "AUTHOR";
	cell4.innerHTML = "DESCRIPTION";
}

function renderBookList(id, name, author, desc) {
	var table = document.getElementById("list_of_books");

	var row = table.insertRow(-1);

	var cell1 = row.insertCell(0);
	var cell2 = row.insertCell(1);
	var cell3 = row.insertCell(2);
	var cell4 = row.insertCell(3);

	cell1.innerHTML = id;
	cell2.innerHTML = name;
	cell3.innerHTML = author;
	cell4.innerHTML = desc;
}

function refreshBookList() {
	getReq().then((res) => {
		all_books = res
		document.getElementById("list_of_books").innerHTML = "";
		renderTableHeading();
		for (i in all_books)
			renderBookList(all_books[i]["id"], all_books[i]["name"], all_books[i]["author"], all_books[i]["description"]);
	})
}

function getReq() {
	return req('GET', '?data=all')
		.then((res) => {
			return res["books"];
		})
}

function idExists(id){
	for (i in all_books)
		if (all_books[i]["id"] == id)
			return i
	return -1
}

function postReq() {
	var name = document.getElementById("post_name_i").value;
	var author = document.getElementById("post_author_i").value;
	var desc = document.getElementById("post_description_i").value;

	req('POST', '', {
		books: [name, author, desc]
	}).then((res) => {
		document.getElementById("post_reply").innerHTML = res["result"]
		refreshBookList()
	})
}

function deleteReq() {
	var id = document.getElementById("delete_id_i").value;
	if (idExists(id) == -1) {
		document.getElementById("delete_reply").innerHTML = " The given id dosen't seem to exist."
		return
	}

	req('DELETE', '?id=' + id).then((res) => {
		document.getElementById("delete_reply").innerHTML = res["result"]
		refreshBookList()
	})
}

function putReq() {
	var id = document.getElementById("put_id_i").value;
	var idIndex = idExists(id)
	if (idIndex == -1) {
		document.getElementById("put_reply").innerHTML = " The given id dosen't seem to exist."
		return
	}

	var name = document.getElementById("put_name_i").value;
	var author = document.getElementById("put_author_i").value;
	var desc = document.getElementById("put_description_i").value;

	if (name == "") name = all_books[idIndex]["name"]
	if (author == "") author = all_books[idIndex]["author"]
	if (desc == "") desc = all_books[idIndex]["description"]

	req('PUT', '', {
		book: [id, name, author, desc]
	}).then((res) => {
		document.getElementById("put_reply").innerHTML = res["result"]
		refreshBookList()
	})
}