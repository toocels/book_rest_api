console.log("sup")

function req(type, urlParm, body_data = undefined) {
	const url = window.location.origin + window.location.pathname + 'api/' + urlParm;
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

function renderBookList(id, name, author, desc) {
	var list_x = document.createElement("div");

	book_id = document.createElement("span");
	book_name = document.createElement("span");
	book_author = document.createElement("span");
	book_desc = document.createElement("span");

	book_id.innerHTML = id
	book_name.innerHTML = name
	book_author.innerHTML = author
	book_desc.innerHTML = desc

	list_x.appendChild(book_id)
	list_x.appendChild(book_name)
	list_x.appendChild(book_author)
	list_x.appendChild(book_desc)

	list_x.setAttribute("id", "list_x")
	book_id.setAttribute("id", "book_id")
	book_name.setAttribute("id", "book_name")
	book_author.setAttribute("id", "book_author")
	book_desc.setAttribute("id", "book_desc")

	document.getElementById("list_of_books").appendChild(list_x)
	document.getElementById("list_of_books").appendChild(document.createElement("hr"))
}

getReq();

function getReq() {
	req('GET', '?data=all')
		.then((res) => {
			var books = res["books"]
			for (i in books) {
				renderBookList(books[i]["id"], books[i]["name"], books[i]["author"], books[i]["description"]);
			}
		})
}

function postReq() {
	var name = document.getElementById("post_name_i").value;
	var author = document.getElementById("post_author_i").value;
	var desc = document.getElementById("post_description_i").value;

	req('POST', '', {
		books: [name, author, desc]
	}).then((res) => {
		console.log(res)
	})
}

function deleteReq() {
	var id = document.getElementById("delete_id_i").value;

	req('DELETE', '?id=' + id).then((res) => {
		console.log(res)
	})
}

function putReq() {
	var id = document.getElementById("put_id_i").value;
	var name = document.getElementById("put_name_i").value;
	var author = document.getElementById("put_author_i").value;
	var desc = document.getElementById("put_description_i").value;

	console.log('fsdfsd')

	req('PUT', '', {
		book: [id, name, author, desc]
	}).then((res) => {
		console.log(res)
	})
}