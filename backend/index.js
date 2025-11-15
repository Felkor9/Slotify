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

app.get("/api/users", async (_request, response) => {
	const { rows } = await client.query('SELECT * FROM "user";');
	response.send(rows);
});

app.post("/api/login", async (_request, res) => {
	console.log("hej från post");
	try {
		const { email, password } = _request.body;
		console.log("body mottagen", _request.body);
		if (!email || !password) {
			return res.status(400).json({ error: "Du måste fylla i både e-post och lösenord" });
		}
		const result = await client.query('SELECT * FROM "user" WHERE email = $1', [email]);
		if (result.rows.length === 0) {
			return res.status(401).json({ error: "Fel e-post eller lösenord" });
		}

		const user = result.rows[0];

		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res.status(401).json({ error: "Fel e-post eller lösenord" });
		}

		res.status(200).json({
			message: "Inloggning lyckades",
			user: {
				id: user.id,
				username: user.username,
				email: user.email,
				isadmin: user.isadmin,
			},
		});
	} catch (err) {
		console.error("Fel vid inloggning:", err);
		res.status(500).json({ error: err.message });
	}
});

app.get("/api/days", async (_request, response) => {
	const { rows } = await client.query("SELECT * FROM day;");
	response.send(rows);
});

app.get("/api/slots", async (_request, response) => {
	const { rows } = await client.query("SELECT * FROM timeSlots;");
	response.send(rows);
});

app.get("/api/seats", async (_request, response) => {
	const { rows } = await client.query("SELECT * FROM seats;");
	response.send(rows);
});

app.get("/api/bookings", async (_request, response) => {
	const { rows } = await client.query("SELECT * FROM bookings;");
	response.send(rows);
});

app.post("/api/bookings", async (_request, response) => {
	try {
		const { user_id, day_id, timeslots_id, seats_id } = _request.body;
		if (!user_id || !day_id || !timeslots_id || !seats_id) {
			return response.status(400).json({ error: "Något gick fel" });
		}

		// kontrollera om användaren redan har en bokning för samma dag+tid
		const userCheck = await client.query(
			`SELECT 1 FROM bookings WHERE user_id = $1 AND day_id = $2 AND timeslots_id = $3`,
			[user_id, day_id, timeslots_id]
		);
		if (userCheck.rowCount > 0) {
			return response.status(409).json({ message: "Du har redan en bokning den tiden" });
		}

		// kontrollera om platsen är upptagen för samma dag+tid
		const seatCheck = await client.query(
			`SELECT 1 FROM bookings WHERE day_id = $1 AND timeslots_id = $2 AND seats_id = $3`,
			[day_id, timeslots_id, seats_id]
		);
		if (seatCheck.rowCount > 0) {
			return response.status(409).json({ message: "Den här platsen är redan bokad den tiden" });
		}

		// skapa bokningen
		const result = await client.query(
			`INSERT INTO bookings (user_id, day_id, timeslots_id, seats_id)
      VALUES($1, $2, $3, $4) RETURNING *`,
			[user_id, day_id, timeslots_id, seats_id]
		);
		response.status(201).json({
			id: result.rows[0].id,
			user_id: result.rows[0].user_id,
			day_id: result.rows[0].day_id,
			timeslots_id: result.rows[0].timeslots_id,
			seats_id: result.rows[0].seats_id,
		});
	} catch (err) {
		console.error("Fel vid bokning:", err);
		response.status(500).json({ error: err.message });
	}
});

app.delete("/api/bookings", async (_request, response) => {
	try {
		const { user_id, day_id, timeslots_id, seats_id } = _request.body;
		console.log("body", _request.body);
		if (!user_id || !day_id || !timeslots_id || !seats_id) {
			return response.status(400).json({ error: "Något gick fel" });
		}

		const result = await client.query(
			`DELETE FROM bookings WHERE user_id = $1 AND day_id = $2 AND timeslots_id = $3 AND seats_id = $4 RETURNING *`,
			[user_id, day_id, timeslots_id, seats_id]
		);
		response.status(201).json({
			id: result.rows[0].id,
			user_id: result.rows[0].user_id,
			day_id: result.rows[0].day_id,
			timeslots_id: result.rows[0].timeslots_id,
			seats_id: result.rows[0].seats_id,
		});
	} catch (err) {
		console.error("Fel vid bokning:", err);
		response.status(500).json({ error: err.message });
	}
});

app.put(`/api/user/:id`, async (req, res) => {
	try {
		const { id } = req.params;
		const { username, email, password, currentPassword } = req.body; // Lägg till currentPassword för verifiering av gammalt lösenord

		// Hämta användarens nuvarande data från databasen
		const result = await client.query('SELECT * FROM "user" WHERE id = $1', [id]);
		const user = result.rows[0];

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Kontrollera om det angivna gamla lösenordet stämmer överens med det nuvarande hashade lösenordet
		const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
		if (!isPasswordCorrect) {
			return res.status(400).json({ message: "Incorrect current password" });
		}

		// Hasha det nya lösenordet
		const hashedPassword = await bcrypt.hash(password, 10);

		// Uppdatera användarens information
		const updateResult = await client.query(
			'UPDATE "user" SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
			[username, email, hashedPassword, id]
		);
		const updatedUser = updateResult.rows[0];

		res.status(200).json({
			message: "Updated successfully",
			user: {
				id: updatedUser.id,
				username: updatedUser.username,
				email: updatedUser.email,
				isadmin: updatedUser.isadmin,
			},
		});
	} catch (err) {
		console.error("Could not update credentials", err.message);
		res.status(500).json({
			message: "There was an error updating the user information",
			error: err.message,
		});
	}
});

app.put(`/api/admin/:id`, async (req, res) => {
	try {
		const { id } = req.params;

		// Här hämtar vi användarens nuvarande isadmin-status
		const result = await client.query('SELECT isadmin FROM "user" WHERE id = $1', [id]);
		const user = result.rows[0];

		// Om användaren inte hittas, skicka en 404 error
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Toggle isadmin (om isadmin är true sätt den till false, om den är false sätt den till true)
		const updatedResult = await client.query(
			'UPDATE "user" SET isadmin = NOT isadmin WHERE id = $1 RETURNING id, username, email, isadmin',
			[id]
		);

		const updatedUser = updatedResult.rows[0];

		// Skicka tillbaka det uppdaterade användarobjektet
		res.status(200).json({
			message: "Updated successfully",
			user: {
				id: updatedUser.id,
				username: updatedUser.username,
				email: updatedUser.email,
				isadmin: updatedUser.isadmin,
			},
		});
	} catch (err) {
		console.error("Could not update credentials", err.message);
		res.status(500).json({
			message: "There was an error updating the user information",
			error: err.message,
		});
	}
});

app.delete("/api/deleteuser", async (req, res) => {
	try {
		const { id } = req.body;
		console.log("Request body:", req.body);

		if (!id) {
			return res.status(400).json({ error: "Något gick fel — inget ID angivet" });
		}
		await client.query(`DELETE FROM bookings WHERE user_id = $1 RETURNING *`, [id]);

		const result = await client.query(`DELETE FROM "user" WHERE id = $1 RETURNING *`, [id]);

		console.log("SQL result:", result);

		if (result.rowCount === 0) {
			return res.status(404).json({ error: "Ingen användare hittades att ta bort" });
		}

		res.status(200).json({ id: result.rows[0].id });
	} catch (err) {
		console.error("Fel vid borttagning:", err);
		res.status(500).json({ error: err.message });
	}
});

app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(3000, () => {
	console.log("Redo på http://localhost:3000/");
});
