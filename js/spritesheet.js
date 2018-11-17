SpriteSheetPainter = function (cells) {
   this.cells = cells || [];
   this.cellIndex = 0;
};

SpriteSheetPainter.prototype = {
   advance: function () {
      if (this.cellIndex == this.cells.length-1) {
         this.cellIndex = 0;
      } else {
         this.cellIndex++;
      }
   },

   paint: function (sprite, context) {
      var cell = this.cells[this.cellIndex];
      context.drawImage(spritesheet, cell.x, cell.y, cell.w, cell.h,
                        sprite.left, sprite.top, cell.w, cell.h);
   }
};

var canvas = document.getElementById('canvas'),
context = canvas.getContext('2d'),
animateButton = document.getElementById('animateButton'),
spritesheet = new Image(),
runnerCells = [
   { x:  0,  y: 70,  w: 60,  h: 60 },
   { x: 60,  y: 70,  w: 60,  h: 60 },
   { x:120,  y: 70,  w: 60,  h: 60 },
   { x:180,  y: 70,  w: 60,  h: 60 },
   { x:240,  y: 70,  w: 60,  h: 60 },
   { x:300,  y: 70,  w: 60,  h: 60 },
   { x:360,  y: 70,  w: 60,  h: 60 },
   { x:420,  y: 70,  w: 60,  h: 60 },
   { x:480,  y: 70,  w: 60,  h: 60 },
   { x:530,  y: 70,  w: 60,  h: 60 },
],
sprite = new Sprite('runner', new SpriteSheetPainter(runnerCells)),
interval,
lastAdvance = 0,
paused = false,
PAGEFLIP_INTERVAL = 100;

// ---------------



function drawBackground() {
   var STEP_Y = 12,
      i = context.canvas.height;

   while(i<STEP_Y*4) {
      context.beginPath();
      context.moveTo(0,i);
      context.lineTo(context.canvas.width,i);
      context.stroke();
      i -= STEP_Y;
   }
}

function pauseAnimation() {
   animateButton.value = 'Animate';
   paused = true;
}

function startAnimation() {
   animateButton.value = 'Pause';
   paused = false;
   //lastAdvance = +new Date();
   requestNextAnimationFrame(animate);
}

// ---------------------

animateButton.onclick = function (e) {
   if (animateButton.value === 'Animate') startAnimation();
   else                                   pauseAnimation();
};

// ------------------

function animate(time) {
   if (!paused) {
      context.clearRect(0,0, canvas.width, canvas.height);
      //drawBackground();
      //context.drawImage(spritesheet, 0,0);

      sprite.paint(context);

      if (time - lastAdvance > PAGEFLIP_INTERVAL) {
         sprite.painter.advance();
         lastAdvance = time;
      }
      requestNextAnimationFrame(animate);
   }
}

// -------------------

spritesheet.src = 'kirby_sheet.png';
//spritesheet.onload = function(e) {
//   context.drawImage(spritesheet, 0, 0);
//};

sprite.left = 200;
sprite.top = 100;

context.strokeStyle = 'lightgray';
context.lineWidth = 0.5;

drawBackground();