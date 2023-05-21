const express = require("express");
const { books } = require("../data/books.json");
const { users } = require("../data/users.json");
const router = express.Router();

//get all books
router.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: books,
	});
});

//get books by id
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
router.post("/", (req, res) => {
	res.status(200).json({
		success: true,
		message: books,
	});
});

module.exports = router;
