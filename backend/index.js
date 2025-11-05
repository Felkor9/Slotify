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
      return response
        .status(400)
        .json({ error: "Du måste fylla i uppgifterna korrekt" });
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
      return res
        .status(400)
        .json({ error: "Du måste fylla i både e-post och lösenord" });
    }
    const result = await client.query('SELECT * FROM "user" WHERE email = $1', [
      email,
    ]);
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

app.use(express.static(path.join(path.resolve(), "dist")));

app.listen(3000, () => {
  console.log("Redo på http://localhost:3000/");
});
