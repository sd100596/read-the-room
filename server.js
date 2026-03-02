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
  { text: "If {player} could travel to any time period, where would they go?", category: "Hypothetical" },
  { text: "If {player} could only eat one food for the rest of their life, what would it be?", category: "Hypothetical" },
  { text: "What would {player}'s dream job be if money wasn't a factor?", category: "Hypothetical" },
  { text: "If {player} could instantly master any skill, what would it be?", category: "Hypothetical" },
  { text: "What would {player}'s last meal be if they could choose anything?", category: "Hypothetical" },
  { text: "If {player} could swap lives with any fictional character, who would it be?", category: "Hypothetical" },
  { text: "What would {player}'s spirit animal be?", category: "Personality" },
  { text: "Is {player} a morning person or a night owl?", category: "Personality" },
  { text: "How would {player} react if they saw a spider in their room?", category: "Reaction" },
  { text: "What would {player} do if they won the lottery?", category: "Hypothetical" },
  { text: "What would {player}'s dream vacation be?", category: "Travel" },
  { text: "If {player} could only watch one movie forever, what would it be?", category: "Entertainment" },
  { text: "What would {player}'s theme song be?", category: "Music" },
  { text: "If {player} could be any animal, what would they be?", category: "Hypothetical" },
  { text: "What would {player}'s most embarrassing moment be?", category: "Funny" },
  { text: "If {player} could only wear one outfit forever, what would it be?", category: "Fashion" },
  { text: "What would {player}'s dream car be?", category: "Cars" },
  { text: "If {player} could live in any fictional world, where would it be?", category: "Hypothetical" },
  { text: "What would {player}'s catchphrase be?", category: "Funny" },
  { text: "If {player} could have any pet (real or mythical), what would it be?", category: "Pets" },
  { text: "What would {player}'s most used emoji be?", category: "Internet" },
  { text: "If {player} could only listen to one album forever, what would it be?", category: "Music" },
  { text: "What would {player}'s most used app be?", category: "Tech" },
  { text: "If {player} could only read one book forever, what would it be?", category: "Books" },
  { text: "What would {player}'s go-to karaoke song be?", category: "Music" },
  { text: "If {player} could only watch one TV show forever, what would it be?", category: "Entertainment" },
  { text: "What would {player}'s most used social media platform be?", category: "Internet" },
  { text: "If {player} could only play one video game forever, what would it be?", category: "Gaming" },
  { text: "What would {player}'s most used board game be?", category: "Gaming" },
  { text: "If {player} could only eat at one restaurant forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used fast food order be?", category: "Food" },
  { text: "If {player} could only drink one beverage forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used candy be?", category: "Food" },
  { text: "If {player} could only wear one brand forever, what would it be?", category: "Fashion" },
  { text: "What would {player}'s most used piece of technology be?", category: "Tech" },
  { text: "If {player} could only use one website forever, what would it be?", category: "Internet" },
  { text: "What would {player}'s most used tool be?", category: "General" },
  { text: "If {player} could only have one hobby forever, what would it be?", category: "General" },
  { text: "What would {player}'s most used room in their house be?", category: "General" },
  { text: "If {player} could only collect one thing forever, what would it be?", category: "General" },
  { text: "What would {player}'s most used scent/candle be?", category: "General" },
  { text: "If {player} could only have one piece of furniture forever, what would it be?", category: "General" },
  { text: "What would {player}'s most used kitchen appliance be?", category: "Food" },
  { text: "If {player} could only have one type of cuisine forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used condiment be?", category: "Food" },
  { text: "If {player} could only have one type of pizza forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used sandwich be?", category: "Food" },
  { text: "If {player} could only have one type of ice cream forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used breakfast food be?", category: "Food" },
  { text: "If {player} could only have one type of dessert forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used drink be?", category: "Food" },
  { text: "If {player} could only have one type of coffee forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used late-night snack be?", category: "Food" },
  { text: "If {player} could only have one type of candy forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used comfort food be?", category: "Food" },
  { text: "If {player} could only have one type of sandwich topping forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used pizza topping be?", category: "Food" },
  { text: "If {player} could only have one type of pizza crust forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used cooking ingredient be?", category: "Food" },
  { text: "If {player} could only have one type of breakfast food forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used fast food restaurant be?", category: "Food" },
  { text: "If {player} could only have one type of snack forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used type of weather be?", category: "General" },
  { text: "If {player} could only have one type of season forever, what would it be?", category: "General" },
  { text: "What would {player}'s most used time of day be?", category: "General" },
  { text: "If {player} could only have one type of room in their house forever, what would it be?", category: "General" },
  { text: "What would {player}'s most used scent/candle be?", category: "General" },
  { text: "If {player} could only have one type of emoji forever, what would it be?", category: "Internet" },
  { text: "What would {player}'s most used piece of clothing be?", category: "Fashion" },
  { text: "If {player} could only have one type of animal forever, what would it be?", category: "General" },
  { text: "What would {player}'s most used mythical creature be?", category: "General" },
  { text: "If {player} could only have one type of planet forever, what would it be?", category: "Science" },
  { text: "What would {player}'s most used element (periodic table) be?", category: "Science" },
  { text: "If {player} could only have one type of card game forever, what would it be?", category: "Gaming" },
  { text: "What would {player}'s most used party game be?", category: "Gaming" },
  { text: "If {player} could only have one type of video game forever, what would it be?", category: "Gaming" },
  { text: "What would {player}'s most used board game be?", category: "Gaming" },
  { text: "If {player} could only have one type of sport to watch forever, what would it be?", category: "Sports" },
  { text: "What would {player}'s most used sport to play be?", category: "Sports" },
  { text: "If {player} could only have one type of superhero forever, what would it be?", category: "Entertainment" },
  { text: "What would {player}'s most used video game character be?", category: "Gaming" },
  { text: "If {player} could only have one type of book genre forever, what would it be?", category: "Books" },
  { text: "What would {player}'s most used type of book be?", category: "Books" },
  { text: "If {player} could only have one type of app on their phone forever, what would it be?", category: "Tech" },
  { text: "What would {player}'s most used programming language be?", category: "Tech" },
  { text: "If {player} could only have one type of meme forever, what would it be?", category: "Internet" },
  { text: "What would {player}'s most used thing to do on a rainy day be?", category: "General" },
  { text: "If {player} could only have one type of childhood cartoon forever, what would it be?", category: "Entertainment" },
  { text: "What would {player}'s most used Disney movie be?", category: "Entertainment" },
  { text: "If {player} could only have one type of Pokémon forever, what would it be?", category: "Gaming" },
  { text: "What would {player}'s most used Youtuber be?", category: "Internet" },
  { text: "If {player} could only have one type of food combination forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used thing to collect be?", category: "General" },
  { text: "If {player} could only have one type of time of day forever, what would it be?", category: "General" },
  { text: "What would {player}'s most used room in their house be?", category: "General" },
  { text: "If {player} could only have one type of scent/candle forever, what would it be?", category: "General" },
  { text: "What would {player}'s most used emoji be?", category: "Internet" },
  { text: "If {player} could only have one type of piece of clothing forever, what would it be?", category: "Fashion" },
  { text: "What would {player}'s most used fast food restaurant be?", category: "Food" },
  { text: "If {player} could only have one type of coffee drink forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used animal at the zoo be?", category: "General" },
  { text: "If {player} could only have one type of mythical creature forever, what would it be?", category: "General" },
  { text: "What would {player}'s most used planet be?", category: "Science" },
  { text: "If {player} could only have one type of element (periodic table) forever, what would it be?", category: "Science" },
  { text: "What would {player}'s most used card game be?", category: "Gaming" },
  { text: "If {player} could only have one type of party game forever, what would it be?", category: "Gaming" },
  { text: "What would {player}'s most used type of pizza crust be?", category: "Food" },
  { text: "If {player} could only have one type of cooking ingredient forever, what would it be?", category: "Food" },
  { text: "What would {player}'s most used sandwich topping be?", category: "Food" },
  { text: "If {player} could only have one type of late-night snack forever, what would it be?", category: "Food" }
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
      hostId: socket.id,
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
    const player = { id: socket.id, name: playerName, score: 0, isHost: true };
    rooms[roomCode].players.push(player);
    rooms[roomCode].scores[socket.id] = 0;
    socket.roomCode = roomCode;
    socket.playerName = playerName;
    callback({ success: true, roomCode, player, players: rooms[roomCode].players, isHost: true });
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
    const player = { id: socket.id, name: playerName, score: 0, isHost: false };
    room.players.push(player);
    room.scores[socket.id] = 0;
    socket.roomCode = roomCode.toUpperCase();
    socket.playerName = playerName;
    io.to(roomCode.toUpperCase()).emit('playerJoined', room.players);
    callback({ success: true, roomCode: roomCode.toUpperCase(), player, players: room.players, isHost: false });
  });

  socket.on('startGame', (callback) => {
    const room = rooms[socket.roomCode];
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }
    if (socket.id !== room.hostId) {
      callback({ success: false, error: 'Only the host can start the game' });
      return;
    }
    if (room.players.length < 2) {
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
      io.to(room.code).emit('allAnswersReceived', { answers: room.answers });
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
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }
    if (socket.id !== room.hostId) {
      callback({ success: false, error: 'Only the host can advance the round' });
      return;
    }
    
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
    }
    callback({ success: true });
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
        // Assign new host if current host left
        if (socket.id === room.hostId && room.players.length > 0) {
          room.hostId = room.players[0].id;
          room.players[0].isHost = true;
        }
        
        io.to(socket.roomCode).emit('playerLeft', { 
          players: room.players,
          hostId: room.hostId
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
