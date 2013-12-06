Clazz.declarePackage ("J.util");
Clazz.load (["J.util.Tuple3i"], "J.util.Point3i", null, function () {
c$ = Clazz.declareType (J.util, "Point3i", J.util.Tuple3i);
c$.new3 = Clazz.defineMethod (c$, "new3", 
function (x, y, z) {
var pt =  new J.util.Point3i ();
pt.x = x;
pt.y = y;
pt.z = z;
return pt;
}, "~N,~N,~N");
});
