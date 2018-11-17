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