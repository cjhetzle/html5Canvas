var game = new Game('ungame', 'gameCanvas');

// Scrolling background.......................

var score = 0,
   lastScore = 0
   lastScoreUpdate = undefined,
   livesLeft = 10,
   translateDelta = 0.025,
   translateOffset = 0,
   pausedToast = document.getElementById('pausedToast'),

// PAUSE GAME..................................

togglePaused = function () {
   game.togglePaused();
   pausedToast.style.display = game.paused ? 'inline' : 'none';
},

pausedToast.onclick = function (e) {
   pausedToast.style.display = 'none';
   togglePaused();
},

// AUTO PAUSE?........................

window.onblur = function windowOnBlur() {
   if (!gameOver && !game.paused) {
      togglePaused();
   }
},

window.onfocus = function windowOnFocus() {
   if (game.paused) {
      togglePaused();
   }
},

// SCROLLING BACKGROUND...................

scrollBackground = function () {
   translateOffset = (translateOffset + translateDelta) %
                     game.context.canvas.width;
   game.context.translate(-translateOffset,0);
},

// Paint methods.................
HIGH_SCORES_DISPLAYED = 10,

highScoreToast = document.getElementById('highScoreToast'),
highScoreParagraph = document.getElementById('highScoreParagraph'),
highScoreList = document.getElementById('highScoreList'),
nameInput = document.getElementById('addMyScoreButton'),
newGameButton = document.getElementById('newGameButton'),

previousHighScoresTitle = document.getElementById('previousHighScoresTitle'),

newGameFromHighScoresButton = document.getElementById('newGameFromHighScoresButton'),

clearHighScoresCheckbox = document.getElementById('clearHighScoresCheckbox'),

// Game over..........................

gameOverToast = document.getElementById('gameOverToast'),
gameOver = false,

over = function () {
   var highScore;
      highScores = game.getHighScores();

      if (highScores.length == 0 || score > highScores[0].score) {
         showHighScores();
      } else {
         gameOverToast.style.display = 'inline';
      }
      gameOver = true;
      lastScore = score;
      score = 0;
},

showHighScores = function () {
   highScoreParagraph.style.display = 'inline';
   highScoreParagraph.innerText = score;
   highScoreToast.style.display = 'inline';
   updateHighScoreList();
},

updateHighScoreList = function () {
   var el,
      highScores = game.getHighScores(),
      length = highScores.length,
      highScore,
      listParent = highScoreList.parentNode;

   listParent.removeChild(highScoreList);
   highScoreList = document.createElement('ol');
   highScoreList.id = 'highScoreList'; // So css takes effect
   listParent.appendChild(highScoreList);

   if (length > 0) {
      previousHighScoresTitle.style.display = 'block';

      length = length > 10 ? 10 : length;

      for (var i=0; i < length; ++i) {
         highScore = highScores[i];
         el = document.createElement.score + ' by ' + highScore.name;
         highScoreList.appendChild(el);
      }
   } else {
      previousHighScoresTitle.style.display = 'none';
   }
}

paintClouds = function (context) {
   paintFarCloud(game.context, 0, 20);
   paintNearCloud(game.context, game.context.canvas.width + 120, 20);
},

paintSun = function (context) {
   //
},

paintFarCloud = function (context, x, y) {
   context.save();
   scrollBackground();

   // paint far cloud with quadratic curves....

   context.restore();
},

paintNearCloud = function (context, x, y) {
   context.save();
   scrollBackground();
   scrollBackground();

   // Paint near clouds with quadratic curves...

   context.restore();
},

loadButton.onclick = function (e) {
   var interval,
      loadingPercentageComplete = 0;

   e.preventDefault();

   progressDiv.style.display = 'block';
   loadButton.style.display = 'none';

   loadingMessage.style.display = 'block';
   progressDiv.appendChild(progressbar.domElement);

   //game.queueImage('images/image1.png');

   interval = setInterval( function (e) {
      loadingPercentageComplete = game.loadImages();

      if (loadingPercentageComplete === 100) {
         clearInterval(interval);
         setTimeout( function (e) {
            loadingMessage.style.display = 'none';
            progressDiv.style.display = 'none';

            setTimeout( function (e) {
               loadingToastBlurb.style.display = 'none';
               loadingToastTitle.style.display = 'none';

               setTimeout( function (e) {
                  loadingToast.style.display = 'none';
                  loseLifeToast.style.display = 'block';
                  game.playSound('sounds/pop');

                  setTimeout( function (e) {
                     loading = false;
                     score = 10;
                     scoreToast.innerText = '10';
                     scoreToast.style.display = 'inline';
                     game.playSound('pop');
                  }, 1000);
               }, 500);
            }, 500);
         }, 500);
      }
      progressbar.draw(loadingPercentageComplete);
   }, 16);
};

game.paintUnderSprites = function () {
   paintNearCloud(game.context, 120, 20);
   paintNearCloud(game.context, game.context.canvas.width+120, 20);
};

game.paintUnderSprites = function () {
   if (!gameOver && livesLeft === 0) {
      over();
   } else {
      paintSun(game.context);
      paintFarCloud(game.context, 20, 20);
      paintFarCloud(game.context, game.context.canvas.width+20,20);

      if (!gameOver) {
         //updateScore();
      }

      //updateLivesDisplay();
   }
};

// PAUSE BUTTON......................

game.addKeyListener({
   key: 'p',
   listener: function () {
      game.togglePaused();
   }
});

game.start();