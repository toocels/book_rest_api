
NOT CASE SENSITIVE


oredr: id, name, author, desc
/////////////////////////////////////////////////

WITH BODY

POST - add new book
Expected: in "/api"
Body: {books:[[name, author],...]
Will reply: in {stat:"ok"} {stat:"err"}

PUT  - update data
Expected: in "/api"
Body: {book:{id, name, author}}		// id is identifier for the data to be updated
Will reply: in {stat:"ok"} {stat:"err"}

/////////////////////////////////////////////////

WITHOUT BODY

GET    - get book, by id, or all
Expected: in "/api" ?data=all or data=specific & id=num or name=nm & author=auth
Will reply: in {books:[[id, name, author],...]}

DELETE - delete book
Expected: in "/api" ?data=all or data=specific & id=num or name=nm & author=auth
Will reply: in {stat:"ok"} {stat:"err"}