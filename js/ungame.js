var game = new Game('ungame', 'gameCanvas');

// Scrolling background.......................

var gameOver = false,
   score = 0,
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

// Paint methods

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