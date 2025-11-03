const express = require("express"),
	path = require("path");
const dotenv = require("dotenv");
const { Client } = require("pg");
const { request } = require("http");
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();

app.use(express.json());

const client = new Client({
	connectionString: process.env.PGURI,
});
client.connect();

app.get("/api/user", async (_request, response) => {
	const { rows } = await client.query('SELECT * FROM "user";');
	response.send(rows);
});

app.post("/api/user", async (_request, response) => {
	try {
		const { username, email, password } = _request.body;
		console.log("body", _request.body);
		if (!username || !email || !password) {
			return response.status(400).json({ error: "Du måste fylla i uppgifterna korrekt" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const result = await client.query(
			'INSERT INTO "user" (username, email, password)VALUES($1, $2, $3) RETURNING *',
			[username, email, hashedPassword]
		);
		response.status(201).json({
			id: result.rows[0].id,
			username: result.rows[0].username,
			email: result.rows[0].email,
			isadmin: result.rows[0].isadmin,
		});
	} catch (err) {
		console.error("Fel vid skapande av avdelning:", err);
		response.status(500).json({ error: err.message });
	}
});

app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(3000, () => {
	console.log("Redo på http://localhost:3000/");
});
