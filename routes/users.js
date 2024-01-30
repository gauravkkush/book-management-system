const express = require("express");
const { users } = require("../data/users.json");
const router = express.Router();

//get all users
router.get("/", (req, res) => {
	res.status(200).json({
		success: true,
		data: users,
	});
});

//get an user by id
router.get("/:id", (req, res) => {
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
router.post("/", (req, res) => {
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
router.put("/:id", (req, res) => {
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

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Delete a user by id
 * Access: Public
 * Parameters: id
 */

router.delete("/:id", (req, res) => {
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

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get all user subscription details
 * Access: Public
 * Parameters: id
 */
router.get("/subscription-details/:id", (req, res) => {
	const { id } = req.params;
	const user = users.find((each) => each.id === id);
	if (!user) {
		return res.status(404).json({
			success: false,
			message: "user not found",
		});
	}

	const getDateInDays = (data = "") => {
		let date;
		if (data === "") {
			date = new Date();
		} else {
			date = new Date(data);
		}

		let days = Math.floor(date / (1000 * 60 * 60 * 24));
		return days;
	};

	const subscriptionType = (date) => {
		if (user.subscriptionType === "Basic") {
			date = date + 90;
		} else if (user.subscriptionType === "Standard") {
			date = date + 180;
		} else if (user.subscriptionType === "Premium") {
			date = date + 365;
		}
		return date;
	};

	let returnDate = getDateInDays(user.returnDate);
	let currentDate = getDateInDays();
	let subscriptionDate = getDateInDays(user.subscriptionDate);
	let subscriptionExpiry = subscriptionType(subscriptionDate);

	console.log("Return Date ", returnDate);
	console.log("Current Date ", currentDate);
	console.log("Subscription Date ", subscriptionDate);
	console.log("Subscription expiry date", subscriptionExpiry);

	const data = {
		...user,
		subscriptionExpired: subscriptionExpiry < currentDate,
		daysLeftForExpire:
			subscriptionExpiry <= currentDate ? 0 : subscriptionExpiry - currentDate,
		fine:
			returnDate < currentDate
				? subscriptionExpiry <= currentDate
					? 200
					: 100
				: 0,
	};

	res.status(200).json({
		success: true,
		data,
	});
});

module.exports = router;
