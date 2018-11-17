function polygonsCollide(polygon1, polygon2) {
   var axes, projection1, projection2;

   axes = polygon1.getAxes();
   axes.push(polygon2.getAxes());

   for (each axis in axes) {
      projection1 = polygon1.project(axis);
      projection2 = polygon2.project(axis);

      if (!projection1.overlaps(projection2))
         return false; // seperation means no collision
   }
   return true; // No seperation on any axis means collision
}