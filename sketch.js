let attempts = 0;
let randomNumber;
let leaderboard = [];
let messageP, guessInput, leaderboardTable;
let balls = []; // Array to hold the balls for celebration animation

function setup() {
    createCanvas(windowWidth, windowHeight); // Create a full-window canvas
    background(234, 234, 234); // Set a light gray background

    // Create a container for the game
    let container = createDiv().class('container');
    container.position(windowWidth / 2 - 200, windowHeight / 2 - 250); // Center the container

    createElement('h1', 'Number Guessing Game').parent(container);
    createP('Guess a number between 1 and 100!').parent(container);

    guessInput = createInput('').attribute('type', 'number').attribute('min', '1').attribute('max', '100').class('guess-input');
    guessInput.parent(container);

    createButton('Submit Guess').mousePressed(submitGuess).class('submit-button').parent(container);

    messageP = createP('').parent(container);

    createElement('h2', 'Leaderboard').parent(container);

    // Create table structure
    leaderboardTable = createElement('table').parent(container).class('leaderboard-table');
    let tableHead = createElement('thead').parent(leaderboardTable);
    let headerRow = createElement('tr').parent(tableHead);
    createElement('th', 'Name').parent(headerRow);
    createElement('th', 'Attempts').parent(headerRow);
    createElement('tbody').parent(leaderboardTable);

    resetGame(); // Initialize the game

    // Add CSS styles directly in JavaScript
    addStyles();
}

function addStyles() {
    let style = createElement('style');
    style.html(`
        body {
            font-family: Arial, sans-serif;
            background-color: #eaeaea; /* Light gray background */
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }

        .container {
            background-color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
            text-align: center;
            max-width: 400px;
            width: 100%;
            transition: transform 0.3s;
            position: relative; /* Position relative for absolute elements */
        }

        .container:hover {
            transform: scale(1.02); /* Scale effect on hover */
        }

        h1 {
            margin-bottom: 15px;
            color: #333;
            animation: fadeIn 0.5s;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .guess-input {
            padding: 10px;
            width: 80%;
            border-radius: 5px;
            border: 1px solid #ccc;
            margin-bottom: 15px;
            transition: border-color 0.3s;
        }

        .guess-input:focus {
            border-color: #007bff; /* Blue border on focus */
        }

        .submit-button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
        }

        .submit-button:hover {
            background-color: #0056b3;
            transform: scale(1.05); /* Slight scale on hover */
        }

        .message {
            margin: 15px 0;
            font-weight: bold;
            animation: fadeIn 0.5s;
        }

        .leaderboard-title {
            margin-top: 30px;
            color: #333;
            animation: fadeIn 0.5s;
        }

        .leaderboard-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .leaderboard-table th, .leaderboard-table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: center;
        }

        thead {
            background-color: #007bff;
            color: white;
        }

        tbody tr:nth-child(even) {
            background-color: #f9f9f9;
        }
    `);
    style.parent(document.head);
}

function submitGuess() {
    const guess = parseInt(guessInput.value());
    attempts++;

    if (guess < randomNumber) {
        messageP.html("Too low!");
    } else if (guess > randomNumber) {
        messageP.html("Too high!");
    } else {
        // Correct guess
        const playerName = prompt("Enter your name:");
        messageP.html(`Correct! ${playerName}, you guessed the number in ${attempts} attempts!`);
        addToLeaderboard(playerName, attempts);
        displayLeaderboard();
        createCelebrationBalls(); // Trigger celebration animation
        resetGame();
    }

    // Check if the guess is within 2 of the target number
    if (Math.abs(guess - randomNumber) <= 2 && guess !== randomNumber) {
        messageP.html(messageP.html() + " You're very close!");
    }
}

function createCelebrationBalls() {
    for (let i = 0; i < 10; i++) {
        balls.push(new CelebrationBall(random(width), 0)); // Start balls from random positions at the top
    }
}

function addToLeaderboard(name, attempts) {
    leaderboard.push({ name, attempts });
    leaderboard.sort((a, b) => a.attempts - b.attempts); // Sort by least attempts
}

function displayLeaderboard() {
    const tbody = select('tbody');
    tbody.html(''); // Clear previous leaderboard

    leaderboard.forEach(player => {
        const row = createElement('tr').parent(tbody);
        createElement('td', player.name).parent(row);
        createElement('td', player.attempts).parent(row);
    });
}

function resetGame() {
    attempts = 0;
    randomNumber = Math.floor(Math.random() * 100) + 1;
    guessInput.value('');
    messageP.html('');
}

// CelebrationBall class for animation
class CelebrationBall {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = random(20, 50); // Random size for the ball
        this.color = color(random(255), random(255), random(255)); // Random color
        this.speed = random(2, 5); // Random falling speed
    }

    update() {
        this.y += this.speed; // Move down
    }

    show() {
        fill(this.color);
        noStroke();
        ellipse(this.x, this.y, this.size);
    }
}

function draw() {
    background(234, 234, 234); // Redraw background each frame

    // Update and show celebration balls
    for (let i = balls.length - 1; i >= 0; i--) {
        balls[i].update();
        balls[i].show();

        // Remove balls that have fallen off the screen
        if (balls[i].y > height) {
            balls.splice(i, 1);
        }
    }
}


