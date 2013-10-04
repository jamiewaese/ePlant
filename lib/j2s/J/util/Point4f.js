Clazz.declarePackage ("J.util");
Clazz.load (["J.util.Tuple4f"], "J.util.Point4f", null, function () {
c$ = Clazz.declareType (J.util, "Point4f", J.util.Tuple4f);
c$.new4 = Clazz.defineMethod (c$, "new4", 
function (x, y, z, w) {
var pt =  new J.util.Point4f ();
pt.set (x, y, z, w);
return pt;
}, "~N,~N,~N,~N");
c$.newPt = Clazz.defineMethod (c$, "newPt", 
function (value) {
var pt =  new J.util.Point4f ();
pt.set (value.x, value.y, value.z, value.w);
return pt;
}, "J.util.Point4f");
Clazz.defineMethod (c$, "distance", 
function (p1) {
var dx = this.x - p1.x;
var dy = this.y - p1.y;
var dz = this.z - p1.z;
var dw = this.w - p1.w;
return Math.sqrt (dx * dx + dy * dy + dz * dz + dw * dw);
}, "J.util.Point4f");
});
