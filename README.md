# 🎯 Read the Room

A fun multiplayer party game where friends guess how well they know each other!

## How to Play

**The Goal**: Figure out how well your friends really know you (and earn points!)

### Game Flow

1. **One player is the "Target"** for each round
2. **Everyone writes an answer** to the question about the target
   - The target writes their REAL answer
   - Everyone else writes a BLUFF (fake answer)
3. **All answers are displayed** (anonymized - no one knows who wrote what)
4. **Everyone guesses** which answer is the target's real one
   - ⚠️ You can't pick your own answer!
5. **Scoring**:
   - +1 point if you guess the target's real answer correctly
   - +1 point for the target for each friend who guessed correctly
   - +1 point to whoever wrote the bluff that someone picked

### Example Round

**Question**: "What is Alice's favourite pizza topping?"

| Player | Wrote | Guessed |
|--------|-------|---------|
| Alice (Target) | Pepperoni | - |
| Bob | Pineapple | Pepperoni ✓ |
| Charlie | Bacon | Pineapple |
| Diana | Onions | Pepperoni ✓ |

- Alice gets +2 points (2 friends guessed right)
- Bob gets +1 point (Diana picked his bluff)
- Diana gets +1 point (guessed correctly)

## Quick Start

### Run Locally

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Then open **http://localhost:3000** in your browser!

### Play with Friends

1. **Host** creates a room and shares the 6-character code
2. **Friends** join using that code
3. Host clicks **Start Game** when everyone is ready
4. Have fun!

## Deploy Online

This game uses WebSockets for real-time multiplayer, so it needs a hosting platform that supports long-running servers:

- **Render** (recommended - free): Connect your GitHub repo
- **Railway**: Connect GitHub repo
- **Glitch**: Import from GitHub

Set the start command to `npm start` and build command to `npm install`.

## Features

- 🎮 2-8 players
- 📱 Works on desktop and mobile browsers
- 🔒 Private rooms with shareable codes
- 👑 Automatic host reassignment if host leaves
- ✨ 55+ family-friendly questions

## Tech Stack

- **Backend**: Node.js + Express + Socket.io
- **Frontend**: Vanilla HTML/CSS/JavaScript

## Questions?

Open an issue on GitHub if you need help!
