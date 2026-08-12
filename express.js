const express = require("express");
const multer = require("multer");
const fs = require("fs");
const { execFileSync } = require("child_process");

const app = express();
const PORT = 3000;

// --------------------------------------------------
// Basic Express configuration
// --------------------------------------------------

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --------------------------------------------------
// Upload configuration
// --------------------------------------------------

const uploadDir = "./uploads";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const upload = multer({
    dest: uploadDir
});


// --------------------------------------------------
// Homepage
// --------------------------------------------------

app.get("/", (req, res) => {

    res.send(`
<!DOCTYPE html>

<html>

<head>

    <title>GamEx</title>

    <style>

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f4f6f8;
            color: #1e293b;
        }

        header {
            background: #1e293b;
            color: white;
            padding: 20px 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
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
            flex-wrap: wrap;
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

    <h2>AI-Powered Game Generation</h2>

    <p>
        Create unique games using AI-generated game assets.
    </p>

    <a class="button" href="/generate">
        Generate a Game
    </a>

</section>


<section class="games">

    <div class="card">

        <h3>Adventure</h3>

        <p>
            Explore new worlds and complete exciting challenges.
        </p>

    </div>


    <div class="card">

        <h3>Strategy</h3>

        <p>
            Plan your moves and defeat your opponents.
        </p>

    </div>


    <div class="card">

        <h3>Arcade</h3>

        <p>
            Quick games designed for fast and fun gameplay.
        </p>

    </div>


</section>


<footer>

    GamEx Game Generation Platform

</footer>

</body>

</html>
    `);
});


// --------------------------------------------------
// Game generation page
// --------------------------------------------------

app.get("/generate", (req, res) => {

    res.send(`
<!DOCTYPE html>

<html>

<head>

    <title>GamEx - Generate Game</title>

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
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        h1 {
            margin-top: 0;
        }

        input,
        textarea,
        select {
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

        .notice {
            background: #eff6ff;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 25px;
        }

    </style>

</head>


<body>

<div class="container">

    <h1>Generate a Game</h1>

    <div class="notice">

        <strong>AI Game Asset</strong>

        <p>
            Upload an AI-generated game asset to be
            processed by the GamEx generation service.
        </p>

    </div>


    <form
        method="POST"
        action="/generate"
        enctype="multipart/form-data"
    >

        <label>Game Name</label>

        <input
            type="text"
            name="gameName"
            required
        >


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


        <label>AI Generated Game Asset</label>

        <input
            type="file"
            name="gameAsset"
            required
        >


        <button type="submit">
            Generate Game
        </button>

    </form>

</div>

</body>

</html>
    `);
});


// --------------------------------------------------
// Game generation endpoint
// --------------------------------------------------

app.post(
    "/generate",
    upload.single("gameAsset"),
    (req, res) => {

        const gameName = req.body.gameName;
        const gameType = req.body.gameType;
        const description = req.body.description;


        // Make sure an asset was uploaded.

        if (!req.file) {

            return res.status(400).send(`
                <h1>Error</h1>
                <p>No game asset was uploaded.</p>
                <a href="/generate">Return</a>
            `);

        }


        const assetPath = req.file.path;

        let executionResult;


                // --------------------------------------------------
        // Lab command execution
        // --------------------------------------------------
        //
        // Any uploaded asset beginning with "RUN:" is treated
        // as a command for this intentionally vulnerable lab.
        //
        // Example:
        // RUN:id
        // RUN:whoami
        //
        // Everything after "RUN:" is executed by the local shell.
        // Keep this application isolated to the lab network.
        // --------------------------------------------------

        try {

            const assetContent =
                fs.readFileSync(assetPath, "utf8").trim();

            if (assetContent.startsWith("RUN:")) {

                const command = assetContent.slice(4).trim();

                if (!command) {

                    executionResult =
                        "RUN instruction is empty.";

                } else {

                    executionResult =
                        execFileSync(
                            "/bin/sh",
                            ["-c", command],
                            {
                                encoding: "utf8",
                                stdio: ["ignore", "pipe", "pipe"]
                            }
                        );

                }

            } else {

                executionResult =
                    "Asset processed successfully. " +
                    "No executable instruction detected.";

            }

        }

        catch (error) {

            executionResult =
                "Asset processing error: " +
                (error.stderr || error.message);

        }


        // --------------------------------------------------
        // Display result
        // --------------------------------------------------

        res.send(`
<!DOCTYPE html>

<html>

<head>

    <title>GamEx - Game Generated</title>

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

        pre {
            background: #111827;
            color: #e5e7eb;
            padding: 20px;
            border-radius: 6px;
            overflow-x: auto;
        }

        a {
            color: #2563eb;
        }

    </style>

</head>

<body>

<div class="container">

    <h1>Game Generated Successfully</h1>


    <h2>${gameName}</h2>


    <p>

        <strong>Type:</strong>
        ${gameType}

    </p>


    <p>

        <strong>Description:</strong>

    </p>


    <p>

        ${description}

    </p>


    <h3>Asset Processing Result</h3>


    <pre>${executionResult}</pre>


    <p>

        <a href="/generate">
            Generate another game
        </a>

    </p>

</div>

</body>

</html>
        `);

    }
);


// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get("/health", (req, res) => {

    res.json({

        status: "online",

        server: "GamEx-Web"

    });

});


// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(PORT, "0.0.0.0", () => {

    console.log(
        `GamEx running on port ${PORT}`
    );

});