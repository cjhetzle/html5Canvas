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
