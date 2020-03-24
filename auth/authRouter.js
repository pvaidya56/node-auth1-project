const bcrypt = require("bcryptjs");

const router = require("express").Router();

const Users = require("../users/userModel.js");

router.post("/register", (req, res) => {
	const userInfo = req.body;

	const ROUNDS = process.env.HASHING_ROUNDS || 8;
	const hash = bcrypt.hashSync(userInfo.password, ROUNDS);

	userInfo.password = hash;

	Users.add(userInfo)
		.then(user => {
			res.json(user);
		})
		.catch(err => res.send(err));
});

router.post("/login", (req, res) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.then(([user]) => {
			if (user && bcrypt.compareSync(password, user.password)) {

				req.session.user = {
					id: user.id,
					username: user.username
				};

				res.status(200).json({ message: ` ${user.username} has logged in` });
			} else {
				res.status(401).json({ message: "Error logging in, try again" });
			}
		})
		.catch(error => {
			res.status(500).json({ errorMessage: "Error finding user" });
		});
});

router.get("/logout", (req, res) => {
	if (req.session) {
		req.session.destroy(error => {
			if (error) {
				res.status(500).json({
					message:
						"error logging out!"
				});
			} else {
				res.status(200).json({ message: "Logged out successfully" });
			}
		});
	} else {
		res.status(200).json({ message: "Error, please try again later" });
	}
});

module.exports = router;