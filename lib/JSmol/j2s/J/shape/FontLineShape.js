Clazz.declarePackage ("J.shape");
Clazz.load (["J.shape.FontShape"], "J.shape.FontLineShape", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.tickInfos = null;
Clazz.instantialize (this, arguments);
}, J.shape, "FontLineShape", J.shape.FontShape);
Clazz.prepareFields (c$, function () {
this.tickInfos =  new Array (4);
});
Clazz.defineMethod (c$, "setProperty", 
function (propertyName, value, bs) {
if ("tickInfo" === propertyName) {
var t = value;
if (t.ticks == null) {
if (t.type.equals (" ")) this.tickInfos[0] = this.tickInfos[1] = this.tickInfos[2] = this.tickInfos[3] = null;
 else this.tickInfos["xyz".indexOf (t.type) + 1] = null;
return;
}this.tickInfos["xyz".indexOf (t.type) + 1] = t;
return;
}Clazz.superCall (this, J.shape.FontLineShape, "setProperty", [propertyName, value, bs]);
}, "~S,~O,J.util.BS");
Clazz.overrideMethod (c$, "getShapeState", 
function () {
var s = this.viewer.getFontState (this.myType, this.font3d);
return (this.tickInfos == null ? s : this.viewer.getFontLineShapeState (s, this.myType, this.tickInfos));
});
});
