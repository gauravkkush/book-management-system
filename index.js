const express = require("express");
const { users } = require("./data/users.json");

const app = express();
const PORT = 8081;
app.use(express.json());


app.get("/", (req, res) => {
	res.status(200).json({ message: "Server is running" });
});

app.get("*", (req, res) => {
	res.status(404).json({
		message: "Node not found",
	});
});

app.get("/users", (req, res) => {
	res.status(200).json({
		success: true,
		data: users,
	});
});

app.get("/users/:id", (req, res) => {
	const { id } = req.params;
	const user = users.find((each) => each.id === id);
	if (!user) {
		return res.status(404).json({
			success: false,
			message: "user not found",
		});
	}
	return res.status(200).json({
		success: true,
		data: user,
	});
});

//create new user
app.post("/", (req, res) => {
	const { id, name, surname, email, subscriptionType, subscriptionDate } =
		req.body;
	const user = users.find((each) => each.id === id);

	if (user) {
		res.status(404).json({
			success: false,
			message: "User already exists",
		});
	}
	users.push({ id, name, surname, email, subscriptionType, subscriptionDate });
	return res.status(200).json({
		success: true,
		data: users,
	});
});

app.listen(PORT, () => {
	console.log("Server is runnig at port", PORT);
});
