var lastFpsUpdateTime = -1,
   lastFpsUpdate = 0,
   lastTime = 0;

function calculateFps() {
   var now = (+new Date),
   fps = 1000 / (now - lastTime);

   if (now - lastFpsUpdateTime > 100) {
      lastFpsUpdateTime = now;
      lastFpsUpdate = fps;
   }  

   lastTime = now;

   return lastFpsUpdate;
}