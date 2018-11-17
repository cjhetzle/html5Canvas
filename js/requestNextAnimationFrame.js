requestNextAnimationFrame = 
   (function() {
      return requestAnimationFrame ||
      webkitRequestAnimationFrame  ||
      mozRequestAnimationFrame     ||
      msRequestAnimationFrame      ||

      function (callback, element) {
         var self = this,
         start,
         finish;

         window.setTimeout( function () {
            start = +new Date();
            callback(start);
            finish = +new Date();

            self.timeout = 1000/60 - (finish - start);
         }, self.setTimeout);
      };
   })();