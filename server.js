const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const questions = [
  { text: "What is {player}'s favourite pizza topping?", category: "Food" },
  { text: "What is {player}'s favourite ice cream flavour?", category: "Food" },
  { text: "What is {player}'s favourite movie of all time?", category: "Entertainment" },
  { text: "What is {player}'s favourite TV show?", category: "Entertainment" },
  { text: "What is {player}'s favourite colour?", category: "General" },
  { text: "What is {player}'s favourite animal?", category: "General" },
  { text: "What is {player}'s favourite music genre?", category: "Music" },
  { text: "What is {player}'s favourite singer/artist?", category: "Music" },
  { text: "What is {player}'s favourite sport to watch?", category: "Sports" },
  { text: "What is {player}'s favourite sport to play?", category: "Sports" },
  { text: "What is {player}'s favourite video game?", category: "Gaming" },
  { text: "What is {player}'s favourite board game?", category: "Gaming" },
  { text: "What is {player}'s favourite holiday destination?", category: "Travel" },
  { text: "What is {player}'s favourite season of the year?", category: "General" },
  { text: "What is {player}'s favourite type of cuisine?", category: "Food" },
  { text: "What is {player}'s favourite dessert?", category: "Food" },
  { text: "What is {player}'s favourite breakfast food?", category: "Food" },
  { text: "What is {player}'s favourite drink (non-alcoholic)?", category: "Food" },
  { text: "What is {player}'s favourite candy?", category: "Food" },
  { text: "What is {player}'s favourite superhero?", category: "Entertainment" },
  { text: "What is {player}'s favourite video game character?", category: "Gaming" },
  { text: "What is {player}'s favourite book genre?", category: "Books" },
  { text: "What is {player}'s favourite type of book?", category: "Books" },
  { text: "What is {player}'s favourite app on their phone?", category: "Tech" },
  { text: "What is {player}'s favourite programming language?", category: "Tech" },
  { text: "What is {player}'s favourite meme?", category: "Internet" },
  { text: "What is {player}'s favourite thing to do on a rainy day?", category: "General" },
  { text: "What is {player}'s favourite comfort food?", category: "Food" },
  { text: "What is {player}'s favourite way to relax?", category: "General" },
  { text: "What is {player}'s favourite childhood cartoon?", category: "Entertainment" },
  { text: "What is {player}'s favourite Disney movie?", category: "Entertainment" },
  { text: "What is {player}'s favourite Pokémon?", category: "Gaming" },
  { text: "What is {player}'s favourite Youtuber?", category: "Internet" },
  { text: "What is {player}'s favourite food combination?", category: "Food" },
  { text: "What is {player}'s favourite thing to collect?", category: "General" },
  { text: "What is {player}'s favourite type of weather?", category: "General" },
  { text: "What is {player}'s favourite星饮料?", category: "Food" },
  { text: "What is {player}'s guilty pleasure song?", category: "Music" },
  { text: "What is {player}'s favourite hobby?", category: "General" },
  { text: "What is {player}'s favourite time of day?", category: "General" },
  { text: "What is {player}'s favourite room in their house?", category: "General" },
  { text: "What is {player}'s favourite scent/candle?", category: "General" },
  { text: "What is {player}'s favourite emoji?", category: "Internet" },
  { text: "What is {player}'s favourite piece of clothing?", category: "Fashion" },
  { text: "What is {player}'s favourite fast food restaurant?", category: "Food" },
  { text: "What is {player}'s favourite coffee drink?", category: "Food" },
  { text: "What is {player}'s favourite animal at the zoo?", category: "General" },
  { text: "What is {player}'s favourite mythical creature?", category: "General" },
  { text: "What is {player}'s favourite planet?", category: "Science" },
  { text: "What is {player}'s favourite element (periodic table)?", category: "Science" },
  { text: "What is {player}'s favourite card game?", category: "Gaming" },
  { text: "What is {player}'s favourite party game?", category: "Gaming" },
  { text: "What is {player}'s favourite type of pizza crust?", category: "Food" },
  { text: "What is {player}'s favourite cooking ingredient?", category: "Food" },
  { text: "What is {player}'s favourite sandwich topping?", category: "Food" },
  { text: "What is {player}'s favourite late-night snack?", category: "Food" }
];

const rooms = {};

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('createRoom', (playerName, callback) => {
    const roomCode = generateRoomCode();
    rooms[roomCode] = {
      code: roomCode,
      players: [],
      gameState: 'lobby',
      currentRound: 0,
      totalRounds: 10,
      questions: shuffleArray(questions).slice(0, 10),
      answers: {},
      guesses: {},
      scores: {},
      currentTargetIndex: 0
    };
    socket.join(roomCode);
    const player = { id: socket.id, name: playerName, score: 0 };
    rooms[roomCode].players.push(player);
    rooms[roomCode].scores[socket.id] = 0;
    socket.roomCode = roomCode;
    socket.playerName = playerName;
    callback({ success: true, roomCode, player, players: rooms[roomCode].players });
  });

  socket.on('joinRoom', (roomCode, playerName, callback) => {
    const room = rooms[roomCode.toUpperCase()];
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }
    if (room.gameState !== 'lobby') {
      callback({ success: false, error: 'Game already in progress' });
      return;
    }
    if (room.players.length >= 8) {
      callback({ success: false, error: 'Room is full (max 8 players)' });
      return;
    }
    socket.join(roomCode.toUpperCase());
    const player = { id: socket.id, name: playerName, score: 0 };
    room.players.push(player);
    room.scores[socket.id] = 0;
    socket.roomCode = roomCode.toUpperCase();
    socket.playerName = playerName;
    io.to(roomCode.toUpperCase()).emit('playerJoined', room.players);
    callback({ success: true, roomCode: roomCode.toUpperCase(), player, players: room.players });
  });

  socket.on('startGame', (callback) => {
    const room = rooms[socket.roomCode];
    if (!room || room.players.length < 2) {
      callback({ success: false, error: 'Need at least 2 players' });
      return;
    }
    room.gameState = 'playing';
    room.currentRound = 1;
    room.currentTargetIndex = 0;
    room.answers = {};
    room.guesses = {};
    const targetPlayer = room.players[0];
    io.to(room.code).emit('gameStarted', {
      totalRounds: room.totalRounds,
      round: room.currentRound,
      question: room.questions[0].text.replace('{player}', targetPlayer.name),
      targetPlayer: targetPlayer.name,
      targetId: targetPlayer.id
    });
    callback({ success: true });
  });

  socket.on('submitAnswer', (answer, callback) => {
    const room = rooms[socket.roomCode];
    if (!room) return;
    room.answers[socket.id] = answer;
    const answeredCount = Object.keys(room.answers).length;
    io.to(room.code).emit('answerSubmitted', { count: answeredCount, total: room.players.length });
    if (answeredCount === room.players.length) {
      const answersList = Object.values(room.answers);
      io.to(room.code).emit('allAnswersReceived', { answers: answersList });
    }
    callback({ success: true });
  });

  socket.on('submitGuess', (selectedAnswer, callback) => {
    const room = rooms[socket.roomCode];
    if (!room) return;
    room.guesses[socket.id] = selectedAnswer;
    const guessCount = Object.keys(room.guesses).length;
    if (guessCount === room.players.length) {
      const targetPlayer = room.players[room.currentTargetIndex];
      const targetAnswer = room.answers[targetPlayer.id];
      const results = [];
      let targetPoints = 0;

      room.players.forEach(player => {
        const guess = room.guesses[player.id];
        let points = 0;
        let answerAuthor = null;
        
        Object.keys(room.answers).forEach(authorId => {
          if (room.answers[authorId] === guess && authorId !== targetPlayer.id) {
            answerAuthor = authorId;
          }
        });

        if (guess === targetAnswer) {
          points = 1;
          targetPoints++;
        } else if (answerAuthor) {
          points = 1;
          room.scores[answerAuthor] = (room.scores[answerAuthor] || 0) + 1;
        }

        room.scores[player.id] = (room.scores[player.id] || 0) + points;
        
        results.push({
          playerId: player.id,
          playerName: player.name,
          guess: guess,
          isCorrect: guess === targetAnswer,
          points: points
        });
      });

      room.scores[targetPlayer.id] = (room.scores[targetPlayer.id] || 0) + targetPoints;

      io.to(room.code).emit('roundResults', {
        results,
        targetPlayer: targetPlayer.name,
        targetAnswer: targetAnswer,
        allAnswers: room.answers,
        scores: room.scores,
        players: room.players
      });
    }
    callback({ success: true });
  });

  socket.on('nextRound', (callback) => {
    const room = rooms[socket.roomCode];
    if (!room) return;
    
    room.currentTargetIndex = (room.currentTargetIndex + 1) % room.players.length;
    room.currentRound++;
    room.answers = {};
    room.guesses = {};

    if (room.currentRound > room.totalRounds) {
      room.gameState = 'ended';
      const leaderboard = room.players
        .map(p => ({ name: p.name, score: room.scores[p.id] || 0 }))
        .sort((a, b) => b.score - a.score);
      io.to(room.code).emit('gameEnded', { leaderboard });
      callback({ success: true, ended: true });
    } else {
      const targetPlayer = room.players[room.currentTargetIndex];
      const question = room.questions[room.currentRound - 1].text.replace('{player}', targetPlayer.name);
      io.to(room.code).emit('newRound', {
        round: room.currentRound,
        totalRounds: room.totalRounds,
        question: question,
        targetPlayer: targetPlayer.name,
        targetId: targetPlayer.id
      });
      callback({ success: true, ended: false });
    }
  });

  socket.on('getPlayers', (callback) => {
    const room = rooms[socket.roomCode];
    if (!room) {
      callback({ players: [] });
      return;
    }
    callback({ players: room.players });
  });

  socket.on('disconnect', () => {
    if (socket.roomCode && rooms[socket.roomCode]) {
      const room = rooms[socket.roomCode];
      room.players = room.players.filter(p => p.id !== socket.id);
      delete room.scores[socket.id];
      delete room.answers[socket.id];
      delete room.guesses[socket.id];
      
      if (room.players.length === 0) {
        delete rooms[socket.roomCode];
      } else {
        io.to(socket.roomCode).emit('playerLeft', { 
          players: room.players,
          remainingId: socket.id 
        });
        
        if (room.gameState === 'playing' && room.players.length < 2) {
          room.gameState = 'lobby';
          io.to(socket.roomCode).emit('gameAborted', { reason: 'Not enough players' });
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
