Clazz.declarePackage ("J.modelset");
Clazz.load (["J.util.BS", "$.JmolEdge", "J.viewer.JC"], "J.modelset.Bond", ["J.util.BSUtil", "$.C"], function () {
c$ = Clazz.decorateAsClass (function () {
this.atom1 = null;
this.atom2 = null;
this.mad = 0;
this.colix = 0;
this.shapeVisibilityFlags = 0;
Clazz.instantialize (this, arguments);
}, J.modelset, "Bond", J.util.JmolEdge);
Clazz.makeConstructor (c$, 
function (atom1, atom2, order, mad, colix) {
Clazz.superConstructor (this, J.modelset.Bond, []);
this.atom1 = atom1;
this.atom2 = atom2;
this.colix = colix;
this.setOrder (order);
this.setMad (mad);
}, "J.modelset.Atom,J.modelset.Atom,~N,~N,~N");
Clazz.defineMethod (c$, "setMad", 
function (mad) {
this.mad = mad;
this.setShapeVisibility (mad != 0);
}, "~N");
Clazz.defineMethod (c$, "setShapeVisibilityFlags", 
function (shapeVisibilityFlags) {
this.shapeVisibilityFlags = shapeVisibilityFlags;
}, "~N");
Clazz.defineMethod (c$, "getShapeVisibilityFlags", 
function () {
return this.shapeVisibilityFlags;
});
Clazz.defineMethod (c$, "setShapeVisibility", 
function (isVisible) {
var wasVisible = ((this.shapeVisibilityFlags & J.modelset.Bond.myVisibilityFlag) != 0);
if (wasVisible == isVisible) return;
this.atom1.addDisplayedBond (J.modelset.Bond.myVisibilityFlag, isVisible);
this.atom2.addDisplayedBond (J.modelset.Bond.myVisibilityFlag, isVisible);
if (isVisible) this.shapeVisibilityFlags |= J.modelset.Bond.myVisibilityFlag;
 else this.shapeVisibilityFlags &= ~J.modelset.Bond.myVisibilityFlag;
}, "~B");
Clazz.defineMethod (c$, "getIdentity", 
function () {
return (this.index + 1) + " " + this.getOrderNumberAsString () + " " + this.atom1.getInfo () + " -- " + this.atom2.getInfo () + " " + this.atom1.distance (this.atom2);
});
Clazz.overrideMethod (c$, "isCovalent", 
function () {
return (this.order & 1023) != 0;
});
Clazz.defineMethod (c$, "isHydrogen", 
function () {
return J.modelset.Bond.isHydrogen (this.order);
});
c$.isHydrogen = Clazz.defineMethod (c$, "isHydrogen", 
function (order) {
return (order & 30720) != 0;
}, "~N");
Clazz.defineMethod (c$, "isStereo", 
function () {
return (this.order & 1024) != 0;
});
Clazz.defineMethod (c$, "isPartial", 
function () {
return (this.order & 224) != 0;
});
Clazz.defineMethod (c$, "isAromatic", 
function () {
return (this.order & 512) != 0;
});
Clazz.defineMethod (c$, "setPaletteID", 
function (pid) {
}, "~N");
Clazz.defineMethod (c$, "getEnergy", 
function () {
return 0;
});
Clazz.defineMethod (c$, "getValence", 
function () {
return (!this.isCovalent () ? 0 : this.isPartial () || this.is (515) ? 1 : this.order & 7);
});
Clazz.defineMethod (c$, "deleteAtomReferences", 
function () {
if (this.atom1 != null) this.atom1.deleteBond (this);
if (this.atom2 != null) this.atom2.deleteBond (this);
this.atom1 = this.atom2 = null;
});
Clazz.defineMethod (c$, "setColix", 
function (colix) {
this.colix = colix;
}, "~N");
Clazz.defineMethod (c$, "setTranslucent", 
function (isTranslucent, translucentLevel) {
this.colix = J.util.C.getColixTranslucent3 (this.colix, isTranslucent, translucentLevel);
}, "~B,~N");
Clazz.defineMethod (c$, "isTranslucent", 
function () {
return J.util.C.isColixTranslucent (this.colix);
});
Clazz.defineMethod (c$, "setOrder", 
function (order) {
if (this.atom1.getElementNumber () == 16 && this.atom2.getElementNumber () == 16) order |= 256;
if (order == 512) order = 515;
this.order = order | (this.order & 131072);
}, "~N");
Clazz.defineMethod (c$, "getAtom1", 
function () {
return this.atom1;
});
Clazz.defineMethod (c$, "getAtom2", 
function () {
return this.atom2;
});
Clazz.overrideMethod (c$, "getAtomIndex1", 
function () {
return this.atom1.index;
});
Clazz.overrideMethod (c$, "getAtomIndex2", 
function () {
return this.atom2.index;
});
Clazz.defineMethod (c$, "getRadius", 
function () {
return this.mad / 2000;
});
Clazz.overrideMethod (c$, "getCovalentOrder", 
function () {
return J.util.JmolEdge.getCovalentBondOrder (this.order);
});
Clazz.defineMethod (c$, "getOrderName", 
function () {
return J.util.JmolEdge.getBondOrderNameFromOrder (this.order);
});
Clazz.defineMethod (c$, "getOrderNumberAsString", 
function () {
return J.util.JmolEdge.getBondOrderNumberFromOrder (this.order);
});
Clazz.defineMethod (c$, "getColix1", 
function () {
return J.util.C.getColixInherited (this.colix, this.atom1.colixAtom);
});
Clazz.defineMethod (c$, "getColix2", 
function () {
return J.util.C.getColixInherited (this.colix, this.atom2.colixAtom);
});
Clazz.defineMethod (c$, "getOtherAtom", 
function (thisAtom) {
return (this.atom1 === thisAtom ? this.atom2 : this.atom2 === thisAtom ? this.atom1 : null);
}, "J.modelset.Atom");
Clazz.defineMethod (c$, "setIndex", 
function (i) {
this.index = i;
}, "~N");
Clazz.defineMethod (c$, "is", 
function (bondType) {
return (this.order & -131073) == bondType;
}, "~N");
Clazz.overrideMethod (c$, "getOtherAtomNode", 
function (thisAtom) {
return (this.atom1 === thisAtom ? this.atom2 : this.atom2 === thisAtom ? this.atom1 : null);
}, "J.util.JmolNode");
Clazz.overrideMethod (c$, "toString", 
function () {
return this.atom1 + " - " + this.atom2;
});
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
this.associatedAtoms = null;
Clazz.instantialize (this, arguments);
}, J.modelset.Bond, "BondSet", J.util.BS);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.modelset.Bond.BondSet, []);
});
Clazz.defineMethod (c$, "getAssociatedAtoms", 
function () {
return this.associatedAtoms;
});
Clazz.makeConstructor (c$, 
function (a) {
Clazz.superConstructor (this, J.modelset.Bond.BondSet, []);
J.util.BSUtil.copy2 (a, this);
}, "J.util.BS");
Clazz.makeConstructor (c$, 
function (a, b) {
this.construct (a);
this.associatedAtoms = b;
}, "J.util.BS,~A");
c$ = Clazz.p0p ();
c$.myVisibilityFlag = c$.prototype.myVisibilityFlag = J.viewer.JC.getShapeVisibilityFlag (1);
});
