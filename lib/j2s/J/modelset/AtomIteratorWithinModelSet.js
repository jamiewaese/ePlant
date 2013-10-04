Clazz.declarePackage ("J.modelset");
Clazz.load (["J.modelset.AtomIteratorWithinModel"], "J.modelset.AtomIteratorWithinModelSet", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.bsModels = null;
this.center = null;
this.distance = 0;
Clazz.instantialize (this, arguments);
}, J.modelset, "AtomIteratorWithinModelSet", J.modelset.AtomIteratorWithinModel);
Clazz.makeConstructor (c$, 
function (bsModels) {
Clazz.superConstructor (this, J.modelset.AtomIteratorWithinModelSet, []);
this.bsModels = bsModels;
}, "J.util.BS");
Clazz.defineMethod (c$, "setCenter", 
function (center, distance) {
this.center = center;
this.distance = distance;
this.set (0);
}, "J.util.P3,~N");
Clazz.defineMethod (c$, "set", 
($fz = function (iModel) {
if ((this.modelIndex = this.bsModels.nextSetBit (iModel)) < 0 || (this.cubeIterator = this.bspf.getCubeIterator (this.modelIndex)) == null) return false;
Clazz.superCall (this, J.modelset.AtomIteratorWithinModelSet, "setCenter", [this.center, this.distance]);
return true;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "hasNext", 
function () {
if (Clazz.superCall (this, J.modelset.AtomIteratorWithinModelSet, "hasNext", [])) return true;
if (!this.set (this.modelIndex + 1)) return false;
return this.hasNext ();
});
});
