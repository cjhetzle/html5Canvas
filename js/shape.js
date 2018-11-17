// Constructor...............
var Vector = function(x, y) {
   this.x = x;
   this.y = y;
};

// Prototype.................
Vector.prototype = {
   getMagnitude: function () {
      return Math.sqrt(Math.pow(this.x, 2) +
                       Math.pow(this.y, 2));
   },

   add: function (vector) {
      var v = new Vector();
      v.x = this.x - vector.x;
      v.y = this.y + vector.y;
      return v;
   },

   subtract: function (vector) {
      var v = new Vector();
      v.x = this.x - vector.x;
      v.y = this.y - vector.y;
      return v;
   },

   dotProduct: function (vector) {
      return this.x * vector.x +
             this.y * vector.y;
   },

   edge: function (vector) {
      return this.subtract(vector);
   },

   perpendicular: function () {
      var v = new Vector();
      v.x = this.y;
      v.y = 0-this.x;
      return v;
   },

   normalize: function () {
      var v = new Vector(0, 0),
          m = this.getMagnitude();

      if (m != 0) {
         v.x = this.x / m;
         v.y = this.y / m;
      }
      return v;
   },

   normal: function () {
      var p = this.perpendicular();
      return p.normalize();
   }
};


// Constructor..........
var Shape = function () {
   this.x = undefined;
   this.y = undefined;
   this.strokeStyle = 'rgba(255,253,208,0.9)';
   this.fillStyle = 'rgba(147,197,114,0.8)';
};

// Prototype...........
Shape.prototype = {

   collidesWith: function (shape) {
      var axes = this.getAxes().concat(shape.getAxes());
      return !this.seperationOnAxes(axes, shape);
   },

   seperationOnAxes: function (axes, shape) {
      for (var i=0; i < axes.length; ++i) {
         axis = axes[i];
         projection1 = shape.project(axis);
         projection2 = this.project(axis);

         if (!projection1.overlaps(projection2)) {
            return true;
         }
      }
      return false;
   },

   project: function (axis) {

   },

   getAxes: function () {

   },

   move: function (dx, dy) {

   },

   // drawing.............

   createPath: function (context) {

   },

   fill: function (context) {
      context.save();
      context.fillStyle = this.fillStyle;
      this.createPath(context);
      context.fill();
      context.restore();
   },

   stroke: function (context) {
      context.save();
      context.strokeStyle = this.strokeStyle;
      this.createPath(context);
      context.stroke();
      context.restore();
   },

   isPointInPath: function (context, x, y) {
      this.createPath(context);
      return context.isPointInPath(x, y);
   },
}

var Point = function (x, y) {
   this.x = x;
   this.y = y;
};

var Polygon = function () {
   this.points = [];
   this.strokeStyle = 'blue';
   this.fillStyle = 'white';
};

Polygon.prototype = new Shape();

Polygon.prototype.getAxes = function () {
   var v1 = new Vector(),
      v2 = new Vector(),
      axes = [];

   for (var i=0; i < this.points.length-1; i++) {
      v1.x = this.points[i].x;
      v1.y = this.points[i].y;

      v2.x = this.points[i+1].x;
      v2.y = this.points[i+1].y;

      axes.push(v1.edge(v2).normal());
   }

   v1.x = this.points[this.points.length-1].x;
   v1.y = this.points[this.points.length-1].y;

   v2.x = this.points[0].x;
   v2.y = this.points[0].y;

   axes.push(v1.edge(v2).normal());

   return axes;
};

Polygon.prototype.project = function (axis) {
   var scalars = [],
      v = new Vector();

   this.points.forEach( function (point) {
      v.x = point.x;
      v.y = point.y;
      scalars.push(v.dotProduct(axis));
   });

   return new Projection(Math.min.apply(Math, scalars),
                        Math.max.apply(Math, scalars));
};

Polygon.prototype.addPoint = function (x, y) {
   this.points.push(new Point(x, y));
};

Polygon.prototype.createPath = function (context) {
   if (this.points.length === 0)
      return;

   context.beginPath();
   context.moveTo(this.points[0].x,
                  this.points[0].y);

   for (var i=0; i < this.points.length; ++i) {
      context.lineTo(this.points[i].x,
                     this.points[i].y);
   }

   context.closePath();
};

Polygon.prototype.move = function (dx, dy) {
   for (var i=0, point; i < this.points.length; ++i) {
      point = this.points[i];
      point.x += dx;
      point.y += dy;
   }
};

Polygon.prototype.collidesWith = function (shape) {
   var axes = shape.getAxes();

   if (axes === undefined) {
      return polygonCollidesWithCircle(this, shape);
   } else { 
      axes.concat(this.getAxes());
      return !this.seperationOnAxes(axes, shape);
   }
};

var Circle = function (x, y, radius) {
   this.x = x;
   this.y = y;
   this.radius = radius;
   this.strokeStyle = 'rgba(255, 253, 208, 0.9)';
   this.fillStyle = 'rgba(147, 197, 144, 0.8)';
};

// Prototype

Circle.prototype = new Shape();

Circle.prototype.collidesWith = function (shape) {
   var point, length, min=10000, v1, v2,
      edge, perpendicular, normal,
      axes = shape.getAxes(), distance;

   if (axes === undefined) { // circle
      distance = Math.sqrt(Math.pow(shape.x - this.x, 2) +
                           Math.pow(shape.y - this.y, 2));

      return distance < Math.abs(this.radius + shape.radius);
   } else { // polygon
      return polygonCollidesWithCircle(shape, this);
   }
};

Circle.prototype.project = function (axis) {
   var scalars = [],
      point = new Point(this.x, this.y),
      dotProduct = new Vector(point.x, point.y).dotProduct(axis);

   scalars.push(dotProduct);
   scalars.push(dotProduct + this.radius);
   scalars.push(dotProduct - this.radius);

   return new Projection(Math.min.apply(Math, scalars),
                        Math.max.apply(Math, scalars));
};

Circle.prototype.move = function (dx, dy) {
   this.x += dx;
   this.y += dy;
};

Circle.prototype.createPath = function (context) {
   context.beginPath();
   context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
};

function getPolygonPointClosetToCircle(polygon, circle) {
   var min = 10000,
      length,
      testPoint,
      closestPoint;

   for (var i=0; i < polygon.points.length; ++i) {
      testPoint = polygon.points[i];
      length = Math.sqrt(Math.pow(testPoint.x - circle.x, 2),
                        Math.pow(testPoint.y - circle.y, 2));

      if (length < min) {
         min = length;
         closestPoint = testPoint;
      }
   }

   return closestPoint;
};

function polygonCollidesWithCircle (polygon, circle) {
   var min=10000, v1, v2,
      edge, perpendicular, normal,
      axes = polygon.getAxes(),
      closestPoint = getPolygonPointClosetToCircle(polygon, circle);

   v1 = new Vector(circle.x, circle.y);
   v2 = new Vector(closestPoint.x, closestPoint.y);

   axes.push(v1.subtract(v2).normalize());

   return !polygon.seperationOnAxes(axes, circle);
}

function polygonsCollide(polygon1, polygon2) {
   var axes, projection1, projection2;

   axes = polygon1.getAxes();
   axes.push(polygon2.getAxes());

   axes.forEach( function(axis) {
      projection1 = polygon1.project(axis);
      projection2 = polygon2.project(axis);

      if (!projection1.overlaps(projection2))
         return false; // seperation means no collision
   });
   return true; // No seperation on any axis means collision
}

var Projection = function (min, max) {
   this.min = min;
   this.max = max;
};

Projection.prototype = {
   overlaps: function (projection) {
      return this.max > projection.min && projection.max > this.min;
   },
};

var ImageShape = function(imageUrl, x, y, w, h) {
   var self = this;

   this.image = new Image();
   this.imageLoaded = false;
   this.points = [ new Point(x,y) ];
   this.x = x;
   this.y = y;

   this.image.src = imageUrl;

   this.image.addEventListener('load', function (e) {
      self.setPolygonPoints();
      self.imageLoaded = true;
   }, false);
}

// prototype

ImageShape.prototype = new Polygon();

ImageShape.prototype.fill = function (context) {};

ImageShape.prototype.setPolygonPoints = function() {
   this.points.push(new Point(this.x + this.image.width, this.y));
   this.points.push(new Point(this.x + this.image.width,
                              this.y + this.image.height));
   this.points.push(new Point(this.x, this.y + this.image.height));
};

ImageShape.prototype.drawImage = function (context) {
   context.drawImage(this.image, this.points[0].x, points[0].y);
};

ImageShape.prototype.stroke = function (context) {
   var self = this;

   if (this.imageLoaded) {
      context.drawImage(this.image,
                        this.points[0].x, this.points[0].y);
   } else {
      this.image.addEventListener('load', function (e) {
         self.drawImage(context);
      }, false);
   }
};

var SpriteShape = function (sprite, x, y) {
   this.sprite = sprite;
   this.x = x;
   this.y = y;
   sprite.left = x;
   sprite.top = y;
   this.setPolygonPoints();
};

var Sprite = function (number, painter, behaviors) {
   if (name !== undefined)      this.name = name;
   if (painter !== undefined)   this.painter = painter;

   this.top = 0;
   this.left = 0;
   this.width = 10;
   this.height = 10;
   this.velocityX = 0;
   this.velocityY = 0;
   this.visible = true;
   this.animating = false;
   this.behaviors = behaviors || [];

   return this;
};

Sprite.prototype = {
   paint: function (context) {
      if (this.painter !== undefined && this.visible) {
         this.painter.paint(this, context);
      }
   },

   update: function (context, time) {
      for (var i = 0; i < this.behaviors.length; ++i) {
         this.behaviors[i].execute(this,context,time);
      }
   }
};

SpriteShape.prototype = new Polygon();

SpriteShape.prototype.move = function (dx, dy) {
   var point, x;
   for (var i = 0; i < this.points.length; ++i) {
      point = this.points[i];
      point.x += dx;
      point.y += dy;
   }
   this.sprite.left = this.points[0].x;
   this.sprite.top = this.points[0].y;
};

SpriteShape.prototype.fill = function (context) { };

SpriteShape.prototype.setPolygonPoints = function() {
   this.points.push(new Point(this.x, this.y));
   this.points.push(new Point(this.x + this.sprite.width, this.y));
   this.points.push(new Point(this.x + this.sprite.width,
                              this.y + this.sprite.height));
   this.points.push(new Point(this.x, this.y + this.sprite.height));
};

SpriteShape.prototype.stroke = function (context) {
   this.sprite.paint(context);
};