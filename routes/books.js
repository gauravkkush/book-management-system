const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");
const router = express.Router();

//get all books
/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * Parameters: none
 */
router.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: books,
	});
});

//get books by id
/**
 * Route: /books/:id
 * Method: GET
 * Description: Get book by id
 * Access: Public
 * Parameters: id
 */
router.get("/:id", (req, res) => {
	const { id } = req.params;

	const book = books.find((each) => each.id === id);
	if (!book) {
		return res.status(404).json({
			success: false,
			message: "book does not exist",
		});
	}
	return res.status(200).json({
		success: true,
		data: book,
	});
});

//return all issued books
/**
 * Route: /books/issued/by-user
 * Method: GET
 * Description: Get all issued books
 * Access: Public
 * Parameters: none
 */
router.get("/issued/by-user", (req, res) => {
	const usersWithIssuedBooks = users.filter((each) => {
		if (each.issuedBook) return each;
	});

	const issuedBooks = [];

	usersWithIssuedBooks.forEach((each) => {
		const book = books.find((book) => book.id === each.issuedBook);

		book.issuedBy = each.name;
		book.issuedDate = each.issuedDate;
		book.returnDate = each.returnDate;

		issuedBooks.push(book);
	});

	if (issuedBooks.length === 0) {
		return res.status(404).json({
			success: false,
			message: "no books issued yet",
		});
	}
	return res.status(200).json({
		success: true,
		data: issuedBooks,
	});
});

//add new books
/**
 * Route: /books
 * Method: POST
 * Description: Create new book
 * Access: Public
 * Parameters: none
 * Data: author, name, genre, price, publisher, id
 */
router.post("/", (req, res) => {
	const { data } = req.body;
	if (!data)
		return res.status(400).json({
			success: false,
			message: "No data present!",
		});

	const book = books.find((each) => each.id === data.id);
	if (book) {
		return res.status(404).json({
			success: false,
			message: "Book already exists, please use a diffrent id",
		});
	}

	const allBooks = [...books, data];
	res.status(200).json({
		success: true,
		message: allBooks,
	});
});

//Update book by id
router.put("/:id", (req, res) => {
	const { id } = req.params;
	const { data } = req.body;

	const book = books.find((each) => each.id === id);

	if (!book) {
		return res.status(400).json({
			success: false,
			message: "Book not found with this particular id",
		});
	}

	const updateData = books.map((each) => {
		if (each.id === id) {
			return { ...each, ...data };
		}
		return each;
	});

	return res.status(200).json({
		success: true,
		data: updateData,
	});
});

module.exports = router;
