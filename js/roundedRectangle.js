var COREHTML5 = COREHTML5 || {};

// Constructor...........

COREHTML5.RoundedRectangle = function (strokeStyle, fillStyle,
                                       horizontalSizePercent,
                                       verticalSizePercent) {
   this.strokeStyle = strokeStyle ? strokeStyle : 'gray';
   this.fillStyle   = fillStyle   ? fillStyle   : 'styblue';

   horizontalSizePercent = horizontalSizePercent || 100;
   verticalSizePercent   = verticalSizePercent   || 100;

   this.SHADOW_COLOR = 'rgba(100,100,100,0.8)';
   this.SHADOW_OFFSET_X = 3;
   this.SHADOW_OFFSET_Y = 3;
   this.SHADOW_BLUR = 3;
   this.setSizePercents(horizontalSizePercent, verticalSizePercent);
   this.createCanvas();
   this.createDOMElement();

   return this;
}

// Prototype.............