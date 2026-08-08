const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Homepage
app.get("/", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>GamEx</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            background: #f4f6f8;
            color: #222;
        }

        header {
            background: #1e293b;
            color: white;
            padding: 20px 60px;
            display: flex;
            justify-content: space-between;
        }

        header h1 {
            margin: 0;
        }

        nav a {
            color: white;
            text-decoration: none;
            margin-left: 25px;
        }

        .hero {
            text-align: center;
            padding: 80px 20px;
            background: white;
        }

        .hero h2 {
            font-size: 42px;
            margin-bottom: 10px;
        }

        .hero p {
            color: #64748b;
            font-size: 18px;
        }

        .button {
            display: inline-block;
            margin-top: 25px;
            padding: 12px 25px;
            background: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 6px;
        }

        .games {
            display: flex;
            justify-content: center;
            gap: 25px;
            padding: 50px;
        }

        .card {
            background: white;
            width: 250px;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        footer {
            text-align: center;
            padding: 30px;
            color: #64748b;
        }
    </style>
</head>

<body>

<header>
    <h1>GamEx</h1>

    <nav>
        <a href="/">Home</a>
        <a href="/generate">Generate Game</a>
    </nav>
</header>

<section class="hero">
    <h2>Welcome to GamEx</h2>
    <p>Create, discover and play games.</p>

    <a class="button" href="/generate">
        Generate a Game
    </a>
</section>

<section class="games">

    <div class="card">
        <h3>Adventure</h3>
        <p>Explore new worlds and complete exciting challenges.</p>
    </div>

    <div class="card">
        <h3>Strategy</h3>
        <p>Plan your moves and defeat your opponents.</p>
    </div>

    <div class="card">
        <h3>Arcade</h3>
        <p>Quick games designed for fast and fun gameplay.</p>
    </div>

</section>

<footer>
    GamEx © 2026
</footer>

</body>
</html>
    `);
});

// Game generation page
app.get("/generate", (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Generate Game - GamEx</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f4f6f8;
            padding: 50px;
        }

        .container {
            max-width: 700px;
            margin: auto;
            background: white;
            padding: 35px;
            border-radius: 8px;
        }

        input, textarea, select {
            width: 100%;
            padding: 10px;
            margin-top: 8px;
            margin-bottom: 20px;
            box-sizing: border-box;
        }

        button {
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 6px;
            cursor: pointer;
        }
    </style>
</head>

<body>

<div class="container">

    <h1>Generate a Game</h1>

    <form method="POST" action="/generate">

        <label>Game Name</label>
        <input type="text" name="gameName" required>

        <label>Game Type</label>

        <select name="gameType">
            <option>Adventure</option>
            <option>Strategy</option>
            <option>Arcade</option>
            <option>Puzzle</option>
        </select>

        <label>Game Description</label>

        <textarea
            name="description"
            rows="5"
            placeholder="Describe your game..."
        ></textarea>

        <button type="submit">
            Generate Game
        </button>

    </form>

</div>

</body>
</html>
    `);
});

// Game generation endpoint
app.post("/generate", (req, res) => {

    const gameName = req.body.gameName;
    const gameType = req.body.gameType;
    const description = req.body.description;

    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Game Generated</title>
</head>

<body style="font-family: Arial; padding: 50px;">

    <h1>Game Generated Successfully</h1>

    <h2>${gameName}</h2>

    <p><strong>Type:</strong> ${gameType}</p>

    <p><strong>Description:</strong></p>

    <p>${description}</p>

    <a href="/generate">Generate another game</a>

</body>
</html>
    `);
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "online",
        server: "GamEx-Web"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`GamEx running on port ${PORT}`);
});