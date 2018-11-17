var getTimeNow = function () {
   return +new Date();
};

var Game = function (gameName, canvasId) {
   var canvas = document.getElementById(canvasId),
      self = this;

   this.context = canvas.getContext('2d');
   this.sprites = [];
   //...

   // Image loading
   this.imageLoadingProgressCallback;
   this.images = {};
   this.imageUrls = [];
   this.imagesLoaded = 0;
   this.imagesFailedToLoad = 0;
   this.imagesIndex = 0;

   this.soundOn = true;
   this.soundChannels = [];
   this.audio = new Audio();
   this.NUM_SOUND_CHANNELS = 10;

   for (var i=0; i < this.NUM_SOUND_CHANNELS; ++i) {
      var audio = new Audio();
      this.soundChannels.push(audio);
   }

   this.keyListeners = [];

   this.HIGH_SCORES_SUFFIX = '_highscores';

   this.startTime = 0;
   this.lastTime = 0;
   this.gameTime = 0;
   this.fps = 0;
   this.STARTING_FPS = 60;

   this.paused = false;
   this.startedPauseAt = 0;
   this.PAUSE_TIMEOUT = 100;
   // ...

   return this;
};

Game.prototype = {
   //...

   canPlayOggVorbis: function () {
      return "" != this.audio.canPlayType('audio/ogg; codecs="vorbis"');
   },

   canPlayMp4: function () {
      return "" != this.audio.canPlayType('audio/mp4');
   },

   getAvailableSoundChannel: function () {
      var audio;

      for (var i=0; i < this.NUM_SOUND_CHANNELS; ++i) {
         audio = this.soundChannels[i];
         if (audio.played && audio.played.length > 0) {
            if (audio.ended)
               return audio;
         } else {
            if (!audio.ended)
               return audio;
         }
      }
      return undefined; // all tracks in use
   },

   playSound: function (id) {
      var track = this.getAvailableSoundChannel(),
         element = document.getElementById(id);

      if (track && element) {
         track.src = element.src === '' ?
                     element.currentSrc : element.src;

         track.load();
         track.play();
      }
   },

   getImage: function (imageUrl) {
      return this.images[imageUrl];
   },

   imageLoadedCallback: function (e) {
      this.imagesLoaded++;
   },

   imageLoadErrorCallback: function (e) {
      this.imagesFailedToLoad++;
   },

   loadImage: function (imageUrl) {
      var image = new Image(),
         self = this;

      image.src = imageUrl;

      image.addEventListener('load',
         function (e) {
            self.imageLoadedCallback(e);
         });

      image.addEventListener('error',
         function (e) {
            self.imageLoadErrorCallback(e);
         });

      this.images[imageUrl] = image;
   },

   start: function () {
      var self = this;
      this.startTime = getTimeNow();

      requestNextAnimationFrame(
         function (time) {
            self.animate.call(self, time);
         });
   },

   loadImages: function () {

      if (this.imagesIndex < this.imageUrls.length) {
         this.loadImage(this.imageUrls[this.imagesIndex]);
         this.imagesIndex++;
      }

      return (this.imagesLoaded + this.imagesFailedToLoad) /
               this.imageUrls.length * 100;
   },

   queueImage: function (imageUrl) {
      this.imageUrls.push(imageUrl);
   },

   animate: function (time) {
      var self = this;

      if (this.paused) {
         // in pause_timeout call this method again to see if the game is still paused, there's no need to check more frequently
         setTimeout( function () {
            self.animate.call(self, time);
         }, this.PAUSE_TIMEOUT);
      } else {
         this.tick(time);
         this.clearScreen();

         this.startAnimate(time);
         this.paintUnderSprites();

         this.updateSprites(time);
         this.paintSprites(time);

         this.paintOverSprites();
         this.endAnimate();

         requestNextAnimationFrame(
            function (time) {
               self.animate.call(self, time);
            });
      }
   },

   togglePaused: function () {
      var now = getTimeNow();

      this.paused = !this.paused;

      if (this.paused) {
         this.startedPauseAt = now;
      } else {
         this.startTime = this.startTime + now - this.startedPauseAt;
         this.lastTime = now;
      }
   },

   tick: function (time) {
      this.updateFrameRate(time);
      this.gameTime = (getTimeNow()) - this.startTime;
      this.lastTime = time;
   },

   updateFrameRate: function (time) {
      if (this.lastTime === 0)
         this.fps = this.STARTING_FPS;
      else
         this.fps = 1000 / (time - this.lastTime);
   },

   clearScreen: function () {
      this.context.clearRect(0, 0,
            this.context.canvas.width, this.context.canvas.height);
   },

   updateSprites: function (time) {
      for (var i=0; i < this.sprites.length; ++i) {
         var sprite = this.sprites[i];
         sprite.update(this.context, time);
      };
   },

   paintSprites: function (time) {
      for (var i=0; i < this.sprites.length; ++i) {
         var sprite = this.sprites[i];
         if (sprite.visible)
            sprite.paint(this.context);
      };
   },

   pixelsPerFrame: function (time, velocity) {
      return velocity / game.fps;
   },

   // Key listeners

   addKeyListener: function (keyAndListener) {
      game.keyListeners.push(keyAndListener);
   },

   findKeyListener: function (key) {
      var listener = undefined;

      game.keyListeners.forEach(function (keyAndListener) {
         var currentKey = keyAndListener.key;
         if (currentKey === key) {
            listener = keyAndListener.listener;
         }
      });
      return listener;
   },

   keyPressed: function (e) {
      var listener = undefined,
            key = undefined;

      switch (e.keyCode) {
         case 32: key = 'space'; break;
         case 83: key = 's';     break;
         case 80: key = 'p';     break;
         case 37: key = 'left arrow';  break;
         case 39: key = 'right arrow'; break;
         case 38: key = 'up arrow';    break;
         case 40: key = 'down arrow';  break;
      }

      listener = game.findKeyListener(key);
      if (listener) {
         listener();
      }
   },

   getHighScores: function () {
      var key = game.gameName + game.HIGH_SCORES_SUFFIX,
               highScoresString = localStorage[key];

      if (highScoresString == undefined) {
         localStorage[key] = JSON.stringify([]);
      }
      return JSON.parse(localStorage[key]);
   },

   setHighScore: function (highScore) {
      var key = game.gameName + game.HIGH_SCORES_SUFFIX,
            highScoresString = localStorage[key];

      highScores.unshift(highScore);
      localStorage[key] = JSON.stringify(highScores);
   },

   clearHighScores: function () {
      localStorage[game.gameName + game.HIGH_SCORES_SUFFIX] =
            JSON.stringify([]);
   },

   startAnimate: function (time) { },
   paintUnderSprites: function () { },
   paintOverSprites: function () { },
   endAnimate: function () { }
};