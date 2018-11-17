var context =  document.getElementById('canvas').getContext('2d'),
   RADIUS = 75,
   ball = new Sprite('ball',
   {
      paint: function(sprite, context) {
         context.beginPath();
         context.arc(sprite.left + sprite.width/2,
                     sprite.top + sprite.height/2,
                     RADIUS, 0, Math.PI*2, false);
         context.clip();

         context.shadowColor = 'rgb(0,0,0)';
         context.shadowOffsetX = -4;
         context.shadowOffsetY = -4;
         context.shadowBlur = 8;

         context.lineWidth = 2;
         context.strokeStyle = 'rgba(100,100,100,195)';
         context.fillStyle = 'rgba(30,144,255,0.15)';
         context.fill();
         context.stroke();
      }
   });

var ImagePainter = function (imageUrl) {
   this.image = new Image();
   this.image.src = imageUrl;
};

ImagePainter.prototype = {
   paint: function (sprite, context) {
      if (this.image.complete) {
         context.drawImage(this.image, sprite.left, sprite.top,
                           sprite.width, sprite.height);
      }
   }
};

var fish = new Sprite('fish', new ImagePainter('fish.png'));
fish.left = 220;
fish.top = 80;
fish.width = 280;
fish.height = 180;

function drawGrid(color, stepx, stepy) {

}

function animate() {
   context.clearRect(0,0,canvas.width,canvas.height);
   fish.paint(context);
   requestNextAnimationFrame(animate);
}

drawGrid('lightgray', 10, 10);

canvas.width = 1280;
canvas.height = 720;
ball.left = 320;
ball.top = 160;
//ball.paint(context);

requestNextAnimationFrame(animate);