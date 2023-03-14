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

function renderBookList(id, name, author, desc){
	var list_x = document.createElement("div");

	book_name = document.createElement("span");
	book_author = document.createElement("span");
	book_desc = document.createElement("span");

	book_name.innerHTML = name
	book_author.innerHTML = author
	book_desc.innerHTML = desc

	list_x.appendChild(book_name)
	list_x.appendChild(book_author)
	list_x.appendChild(book_desc)

	list_x.setAttribute("id", "list_x")
	book_name.setAttribute("id", "book_name")
	book_author.setAttribute("id", "book_author")
	book_desc.setAttribute("id", "book_desc")

	document.getElementById("list_of_books").appendChild(list_x)
	document.getElementById("list_of_books").appendChild(document.createElement("hr"))
}

renderBookList(1,"dsdfname1","author1","desc1")
renderBookList(2,"name2","author2","desc2")
renderBookList(3,"name3","author3","desc3sdfs")
renderBookList(4,"name4","aulsoigfsthor4","desc4")
renderBookList(5,"name5","author5","desc5")

function getReq(){
	req('GET', '?data=all')
		.then((res)=>{
			var books = res["books"]
			for(i in books){
				renderBookList(books[i]["id"], books[i]["name"],books[i]["author"],books[i]["description"]);
			}
		})
}