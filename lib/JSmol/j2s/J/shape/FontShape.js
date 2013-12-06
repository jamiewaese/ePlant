Clazz.declarePackage ("J.shape");
Clazz.load (["J.shape.Shape"], "J.shape.FontShape", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.font3d = null;
this.myType = null;
Clazz.instantialize (this, arguments);
}, J.shape, "FontShape", J.shape.Shape);
Clazz.overrideMethod (c$, "initShape", 
function () {
this.translucentAllowed = false;
});
Clazz.overrideMethod (c$, "setProperty", 
function (propertyName, value, bs) {
if ("font" === propertyName) {
this.font3d = value;
return;
}}, "~S,~O,J.util.BS");
});
