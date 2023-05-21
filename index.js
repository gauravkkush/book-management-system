const express = require("express");
const app = express();
const PORT = 8081;

const usersRouter = require("./routes/users");
const booksRouter = require("./routes/books");

app.use(express.json());

app.get("/", (req, res) => {
	res.status(200).json({
		message: "Server is running",
	});
});

app.use("/users", usersRouter);
app.use("/books", booksRouter);

app.get("*", (req, res) => {
	res.status(404).json({
		message: "The Route does not exist",
	});
});

app.listen(PORT, () => {
	console.log("Server is runnig at port", PORT);
});
