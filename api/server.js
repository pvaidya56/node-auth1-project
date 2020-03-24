const express = require("express");
const session = require("express-session");

const userRouter = require("../users/userRouter.js");
const authRouter = require("../auth/authRouter.js");
const restricted = require("../auth/restricted-middleware.js");

const server = express();

const sessionConfig = {
	name: "testing",
	secret: "testing this big secret!",
	cookie: {
		maxAge: 1000 * 30,
		secure: false, 
		httpOnly: true 
	},
	resave: false,
	saveUninitialized: true 
};

server.use(express.json());
server.use(session(sessionConfig));

server.use("/api/users", restricted, userRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
	res.json({ api: "running" });
});

module.exports = server;