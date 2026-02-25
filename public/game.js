const socket = io();

let currentScreen = 'welcome';
let playerName = '';
let roomCode = '';
let players = [];
let isHost = false;
let currentRound = 1;
let totalRounds = 10;
let selectedAnswer = null;
let answers = [];
let currentTargetPlayer = '';
let currentTargetId = '';

const screens = {
  welcome: document.getElementById('welcome-screen'),
  name: document.getElementById('name-screen'),
  lobby: document.getElementById('lobby-screen'),
  game: document.getElementById('game-screen'),
  end: document.getElementById('end-screen')
};

function showScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[screenName].classList.add('active');
  currentScreen = screenName;
}

document.getElementById('create-btn').addEventListener('click', () => {
  document.getElementById('name-title').textContent = 'Create Room';
  document.getElementById('room-code-input').style.display = 'none';
  showScreen('name');
});

document.getElementById('join-btn').addEventListener('click', () => {
  document.getElementById('name-title').textContent = 'Join Room';
  document.getElementById('room-code-input').style.display = 'block';
  showScreen('name');
});

document.getElementById('name-submit').addEventListener('click', () => {
  const name = document.getElementById('player-name').value.trim();
  const code = document.getElementById('room-code-input').value.trim().toUpperCase();
  const errorEl = document.getElementById('name-error');
  
  if (!name) {
    errorEl.textContent = 'Please enter your name';
    return;
  }
  
  if (name.length > 15) {
    errorEl.textContent = 'Name must be 15 characters or less';
    return;
  }
  
  playerName = name;
  errorEl.textContent = '';
  
  if (code) {
    socket.emit('joinRoom', code, name, (response) => {
      if (response.success) {
        roomCode = response.roomCode;
        players = response.players;
        isHost = response.isHost;
        updateLobby();
        showScreen('lobby');
      } else {
        errorEl.textContent = response.error;
      }
    });
  } else {
    socket.emit('createRoom', name, (response) => {
      if (response.success) {
        roomCode = response.roomCode;
        players = response.players;
        isHost = response.isHost;
        updateLobby();
        showScreen('lobby');
      }
    });
  }
});

document.getElementById('room-code-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('name-submit').click();
  }
});

document.getElementById('player-name').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('name-submit').click();
  }
});

function updateLobby() {
  document.getElementById('display-room-code').textContent = roomCode;
  document.getElementById('player-count').textContent = players.length;
  const list = document.getElementById('players-list');
  list.innerHTML = players.map(p => `<li>${p.name}${p.isHost ? ' 👑' : ''}</li>`).join('');
  
  const startBtn = document.getElementById('start-btn');
  startBtn.style.display = isHost ? 'block' : 'none';
  if (isHost) {
    startBtn.disabled = players.length < 2;
  }
}

socket.on('playerJoined', (updatedPlayers) => {
  players = updatedPlayers;
  isHost = players.some(p => p.id === socket.id && p.isHost);
  updateLobby();
});

socket.on('playerLeft', ({ players: leftPlayers, hostId }) => {
  players = leftPlayers;
  isHost = hostId === socket.id;
  updateLobby();
});

document.getElementById('start-btn').addEventListener('click', () => {
  socket.emit('startGame', (response) => {
    if (!response.success) {
      document.getElementById('lobby-error').textContent = response.error;
    }
  });
});

socket.on('gameStarted', (data) => {
  totalRounds = data.totalRounds;
  currentRound = data.round;
  currentTargetPlayer = data.targetPlayer;
  currentTargetId = data.targetId;
  document.getElementById('current-round').textContent = currentRound;
  document.getElementById('total-rounds').textContent = totalRounds;
  showScreen('game');
  showWaitingPhase(data.question, data.targetPlayer);
});

socket.on('answerSubmitted', ({ count, total }) => {
  document.getElementById('waiting-status').textContent = `Waiting for answers... (${count}/${total})`;
});

socket.on('allAnswersReceived', (data) => {
  answers = data.answers;
  showGuessingPhase(answers);
});

function showWaitingPhase(question, targetName) {
  document.getElementById('waiting-phase').style.display = 'block';
  document.getElementById('guessing-phase').style.display = 'none';
  document.getElementById('results-phase').style.display = 'none';
  
  document.getElementById('question-text').textContent = question;
  document.getElementById('target-player').textContent = `Target: ${targetName}`;
  document.getElementById('answer-input').value = '';
  document.getElementById('waiting-status').textContent = 'Waiting for answers... (0/' + players.length + ')';
  document.getElementById('submit-answer').disabled = false;
}

function showGuessingPhase(answersObj) {
  document.getElementById('waiting-phase').style.display = 'none';
  document.getElementById('guessing-phase').style.display = 'block';
  document.getElementById('results-phase').style.display = 'none';
  
  document.getElementById('question-text-2').textContent = `What is ${currentTargetPlayer}'s favourite...?`;
  document.getElementById('target-player-2').textContent = `Guess ${currentTargetPlayer}'s answer!`;
  
  const grid = document.getElementById('options-grid');
  grid.innerHTML = '';
  selectedAnswer = null;
  
  const answerList = Object.entries(answersObj);
  
  answerList.forEach(([playerId, answer]) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.dataset.playerId = playerId;
    btn.textContent = answer;
    
    if (playerId === socket.id) {
      btn.disabled = true;
      btn.title = "You can't pick your own answer";
      btn.classList.add('disabled');
    }
    
    btn.addEventListener('click', () => {
      document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAnswer = answer;
      document.getElementById('submit-guess').disabled = false;
    });
    grid.appendChild(btn);
  });
  
  document.getElementById('submit-guess').disabled = true;
}

document.getElementById('submit-answer').addEventListener('click', () => {
  const answer = document.getElementById('answer-input').value.trim();
  if (!answer) return;
  
  socket.emit('submitAnswer', answer, () => {
    document.getElementById('submit-answer').disabled = true;
  });
});

document.getElementById('submit-guess').addEventListener('click', () => {
  if (!selectedAnswer) return;
  socket.emit('submitGuess', selectedAnswer, () => {
    document.getElementById('submit-guess').disabled = true;
  });
});

socket.on('roundResults', (data) => {
  document.getElementById('waiting-phase').style.display = 'none';
  document.getElementById('guessing-phase').style.display = 'none';
  document.getElementById('results-phase').style.display = 'block';
  
  document.getElementById('target-name-result').textContent = data.targetPlayer;
  document.getElementById('target-answer').textContent = data.targetAnswer;
  
  const resultsList = document.getElementById('results-list');
  resultsList.innerHTML = data.results.map(r => `
    <div class="result-item ${r.isCorrect ? 'correct' : 'wrong'}">
      <span class="result-player">${r.playerName}</span>
      <span class="result-guess">${r.guess}</span>
      <span class="result-points">+${r.points}</span>
    </div>
  `).join('');
  
  const scoresDisplay = document.getElementById('scores-display');
  scoresDisplay.innerHTML = data.players.map(p => `
    <div class="score-row">
      <span>${p.name}</span>
      <span>${data.scores[p.id] || 0} pts</span>
    </div>
  `).join('');
  
  updateScoresMini(data.scores);
  
  // Show/hide Next Round button based on host status
  const nextRoundBtn = document.getElementById('next-round-btn');
  nextRoundBtn.style.display = isHost ? 'block' : 'none';
  
  // Add waiting message for non-hosts
  let waitingMsg = document.getElementById('waiting-host-msg');
  if (!isHost) {
    if (!waitingMsg) {
      waitingMsg = document.createElement('p');
      waitingMsg.id = 'waiting-host-msg';
      waitingMsg.className = 'waiting-text';
      waitingMsg.style.textAlign = 'center';
      nextRoundBtn.parentNode.insertBefore(waitingMsg, nextRoundBtn);
    }
    waitingMsg.textContent = 'Waiting for host to start next round...';
    waitingMsg.style.display = 'block';
  } else if (waitingMsg) {
    waitingMsg.style.display = 'none';
  }
});

function updateScoresMini(scores) {
  const container = document.getElementById('scores-mini');
  container.innerHTML = players.map(p => 
    `<span class="score-pill">${p.name.charAt(0)}: ${scores[p.id] || 0}</span>`
  ).join('');
}

// Listen for broadcasted new round from server
socket.on('newRound', (data) => {
  currentRound = data.round;
  currentTargetPlayer = data.targetPlayer;
  currentTargetId = data.targetId;
  document.getElementById('current-round').textContent = currentRound;
  showWaitingPhase(data.question, data.targetPlayer);
});

document.getElementById('next-round-btn').addEventListener('click', () => {
  socket.emit('nextRound', (response) => {
    if (!response.success) {
      console.error(response.error);
    }
  });
});

socket.on('gameEnded', (data) => {
  showScreen('end');
  const leaderboard = document.getElementById('leaderboard');
  leaderboard.innerHTML = data.leaderboard.map((p, i) => `
    <div class="leaderboard-item">
      <span class="rank">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1) + '.'}</span>
      <span class="name">${p.name}</span>
      <span class="score">${p.score} pts</span>
    </div>
  `).join('');
});

socket.on('gameAborted', (data) => {
  alert('Game ended: ' + data.reason);
  showScreen('lobby');
  updateLobby();
});

document.getElementById('play-again-btn').addEventListener('click', () => {
  location.reload();
});

document.getElementById('answer-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('submit-answer').click();
  }
});
