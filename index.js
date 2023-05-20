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

//get a user
app.get("/users", (req, res) => {
	res.status(200).json({
		success: true,
		data: users,
	});
});

//get user by id
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

//update a user
app.put("/users/:id", (req, res) => {
	const { id } = req.params;
	const { data } = req.body;

	const user = users.find((each) => each.id === id);

	if (!user) {
		res.status(404).json({
			success: false,
			message: "user not found",
		});
	}

	const updatedUser = users.map((each) => {
		if (each.id === id) {
			return {
				...each,
				...data,
			};
		}
		return each;
	});

	return res.status(200).json({
		success: true,
		data: updatedUser,
	});
});

//delete a user

app.delete("/users/:id", (req, res) => {
	const { id } = req.params;
	const user = users.find((each) => each.id === id);

	if (!user) {
		return res.status(404).json({
			success: false,
			message: "user not found",
		});
	}
	const index = users.indexOf(user);
	users.splice(index, 1);
	return res.status(202).json({
		success: true,
		data: users,
	});
});
app.listen(PORT, () => {
	console.log("Server is runnig at port", PORT);
});
