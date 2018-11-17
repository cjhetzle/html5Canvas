var paused = true,
discs = [
   {
      x: 150,
      y: 250,
      lastX: 150,
      lastY: 250,
      velocityX: -3.2,
      velocityY: 3.5,
      radius: 25,
      innerColor: 'rgba(255,255,0,1)',
      middleColor: 'rgba(255,255,0,0.7)',
      outerColor: 'rgba(255,255,0,0.5)',
      strokeStyle: 'gray'
   },
   {
      x: 250,
      y: 250,
      lastX: 250,
      lastY: 250,
      velocityX: -2.2,
      velocityY: 4.5,
      radius: 25,
      innerColor: 'rgba(255,255,0,1)',
      middleColor: 'rgba(255,255,0,0.7)',
      outerColor: 'rgba(255,255,0,0.5)',
      strokeStyle: 'gray'
   },
],
numDiscs = discs.length,
lastTime = 0, deltaX = 0, deltaY = 0,
animateButton = document.getElementById('animateButton');

var fish = new Image();

// Functions



function update() {
   var disc = null;

   for (var i=0; i < numDiscs; ++i) {
      disc = discs[i];

      if (disc.x + disc.velocityX + disc.radius >
            context.canvas.width ||
            disc.x + disc.velocityX - disc.radius < 0)
         disc.velocityX = -disc.velocityX;

      if (disc.y + disc.velocityY + disc.radius >
            context.canvas.height ||
            disc.y + disc.velocityY - disc.radius < 0)
         disc.velocityY = -disc.velocityY;

      disc.lastX = disc.x;
      disc.lastY = disc.y;

      disc.x += disc.velocityX;
      disc.y += disc.velocityY;
   }
}

function updateTimebased(time) {
   var disc = null,
      elapsedTime = time - lastTime;

   for (var i=0; i< numDiscs; ++i) {
      disc = discs[i];

      deltaX = disc.velocityX * (elapsedTime / 1000);
      deltaY = disc.velocityY * (elapsedTime / 1000);
   
      if (disc.x + deltaX + disc.radius >
            context.canvas.width ||
            disc.x + deltaX - disc.radius < 0) {
         disc.velocityX = -disc.velocityX;
         deltaX = -deltaX;
      }
         
   
      if (disc.y + deltaY + disc.radius >
            context.canvas.height ||
            disc.y + deltaY - disc.radius < 0) {
         disc.velocityY = -disc.velocityY;
      deltaY = -deltaY;
      }
        
   
      disc.lastX = disc.x;
      disc.lastY = disc.y;
   
      disc.x += deltaX;
      disc.y += deltaY;
      lastTime = time;
   }
}

function draw() {
   var disc = null;
   for (var i=0; i < numDiscs; ++i) {
      drawDiscBackground(discs[i]);
   }

   context.drawImage(fish, 0, 0);

   for (var i=0; i < numDiscs; ++i) {
      drawDisc(discs[i]);
   }
}

function animate(time) {
   if (!paused) {
      //eraseBackground();
      //drawBackground();
      update();
      draw();

      context.fillStyle = 'cornflowerblue';
      context.fillText(calculateFps().toFixed() + ' fps', 20, 60);

      window.requestNextAnimationFrame(animate);
   }
}

animateButton.onclick = function (e) {
   paused = paused ? false : true;
   if (paused) {
      animateButton.value = 'Animate';
   } else {
      window.requestNextAnimationFrame(animate);
      animateButton.value = 'Pause';
   }
};

canvas.width = 750;
canvas.height = 500;
context.font = '48px Helvetica';
fish.src = 'fish.png';



function flashText() {
   var oElem = document.getElementById('my_box');
   oElem.style.color = oElem.style.color == 'red' ? 'blue' : 'red';
   // oElem.style.color == 'red' ? 'blue' : 'red' is a ternary operator.
   requestNextAnimationFrame(flashText);
}
requestNextAnimationFrame(flashText);

function stopTextColor() {
  cancelAnimationFrame(handle);
}

