Clazz.declarePackage ("J.viewer");
Clazz.load (["J.util.BS"], "J.viewer.SelectionManager", ["J.i18n.GT", "J.util.ArrayUtil", "$.BSUtil"], function () {
c$ = Clazz.decorateAsClass (function () {
this.viewer = null;
this.listeners = null;
this.bsHidden = null;
this.bsSelection = null;
this.bsFixed = null;
this.bsSubset = null;
this.bsDeleted = null;
this.empty = 1;
this.hideNotSelected = false;
this.bsTemp = null;
Clazz.instantialize (this, arguments);
}, J.viewer, "SelectionManager");
Clazz.prepareFields (c$, function () {
this.listeners =  new Array (0);
this.bsHidden =  new J.util.BS ();
this.bsSelection =  new J.util.BS ();
this.bsFixed =  new J.util.BS ();
this.bsTemp =  new J.util.BS ();
});
Clazz.makeConstructor (c$, 
function (viewer) {
this.viewer = viewer;
}, "J.viewer.Viewer");
Clazz.defineMethod (c$, "deleteModelAtoms", 
function (bsDeleted) {
J.util.BSUtil.deleteBits (this.bsHidden, bsDeleted);
J.util.BSUtil.deleteBits (this.bsSelection, bsDeleted);
J.util.BSUtil.deleteBits (this.bsSubset, bsDeleted);
J.util.BSUtil.deleteBits (this.bsFixed, bsDeleted);
J.util.BSUtil.deleteBits (this.bsDeleted, bsDeleted);
}, "J.util.BS");
Clazz.defineMethod (c$, "clear", 
function () {
this.clearSelection (true);
this.hide (null, null, null, true);
this.setSelectionSubset (null);
this.bsDeleted = null;
this.setMotionFixedAtoms (null);
});
Clazz.defineMethod (c$, "hide", 
function (modelSet, bs, addRemove, isQuiet) {
if (bs == null) {
this.bsHidden.clearAll ();
} else if (addRemove == null) {
this.bsHidden.clearAll ();
this.bsHidden.or (bs);
} else if (addRemove.booleanValue ()) {
this.bsHidden.or (bs);
} else {
this.bsHidden.andNot (bs);
}if (modelSet != null) modelSet.setBsHidden (this.bsHidden);
if (!isQuiet) this.viewer.reportSelection (J.i18n.GT._ ("{0} atoms hidden", "" + this.bsHidden.cardinality ()));
}, "J.modelset.ModelSet,J.util.BS,Boolean,~B");
Clazz.defineMethod (c$, "display", 
function (modelSet, bs, addRemove, isQuiet) {
var bsAll = modelSet.getModelAtomBitSetIncludingDeleted (-1, false);
if (bs == null) {
this.bsHidden.clearAll ();
} else if (addRemove == null) {
this.bsHidden.or (bsAll);
this.bsHidden.andNot (bs);
} else if (addRemove.booleanValue ()) {
this.bsHidden.andNot (bs);
} else {
this.bsHidden.or (bs);
}J.util.BSUtil.andNot (this.bsHidden, this.bsDeleted);
modelSet.setBsHidden (this.bsHidden);
if (!isQuiet) this.viewer.reportSelection (J.i18n.GT._ ("{0} atoms hidden", "" + this.bsHidden.cardinality ()));
}, "J.modelset.ModelSet,J.util.BS,Boolean,~B");
Clazz.defineMethod (c$, "getHiddenSet", 
function () {
return this.bsHidden;
});
Clazz.defineMethod (c$, "getHideNotSelected", 
function () {
return this.hideNotSelected;
});
Clazz.defineMethod (c$, "setHideNotSelected", 
function (TF) {
this.hideNotSelected = TF;
if (TF) this.selectionChanged (false);
}, "~B");
Clazz.defineMethod (c$, "isSelected", 
function (atomIndex) {
return (atomIndex >= 0 && this.bsSelection.get (atomIndex));
}, "~N");
Clazz.defineMethod (c$, "select", 
function (bs, addRemove, isQuiet) {
if (bs == null) {
this.selectAll (true);
if (!this.viewer.getRasmolSetting (1613758476)) this.excludeSelectionSet (this.viewer.getAtomBits (1613758476, null));
if (!this.viewer.getRasmolSetting (1613758470)) this.excludeSelectionSet (this.viewer.getAtomBits (1613758470, null));
this.selectionChanged (false);
} else {
this.setSelectionSet (bs, addRemove);
}var reportChime = this.viewer.getMessageStyleChime ();
if (!reportChime && isQuiet) return;
var n = this.getSelectionCount ();
if (reportChime) this.viewer.reportSelection ((n == 0 ? "No atoms" : n == 1 ? "1 atom" : n + " atoms") + " selected!");
 else if (!isQuiet) this.viewer.reportSelection (J.i18n.GT._ ("{0} atoms selected", n));
}, "J.util.BS,Boolean,~B");
Clazz.defineMethod (c$, "selectAll", 
function (isQuiet) {
var count = this.viewer.getAtomCount ();
this.empty = (count == 0) ? 1 : 0;
for (var i = count; --i >= 0; ) this.bsSelection.set (i);

J.util.BSUtil.andNot (this.bsSelection, this.bsDeleted);
this.selectionChanged (isQuiet);
}, "~B");
Clazz.defineMethod (c$, "clearSelection", 
function (isQuiet) {
this.setHideNotSelected (false);
this.bsSelection.clearAll ();
this.empty = 1;
this.selectionChanged (isQuiet);
}, "~B");
Clazz.defineMethod (c$, "isAtomSelected", 
function (atomIndex) {
return ((this.bsSubset == null || this.bsSubset.get (atomIndex)) && this.bsDeleted == null || !this.bsDeleted.get (atomIndex)) && this.bsSelection.get (atomIndex);
}, "~N");
Clazz.defineMethod (c$, "setSelectedAtom", 
function (atomIndex, TF) {
if (atomIndex < 0) {
this.selectionChanged (true);
return;
}if (this.bsSubset != null && !this.bsSubset.get (atomIndex) || this.bsDeleted != null && this.bsDeleted.get (atomIndex)) return;
this.bsSelection.setBitTo (atomIndex, TF);
if (TF) this.empty = 0;
 else this.empty = -1;
}, "~N,~B");
Clazz.defineMethod (c$, "setSelectionSet", 
function (set, addRemove) {
if (set == null) {
this.bsSelection.clearAll ();
} else if (addRemove == null) {
this.bsSelection.clearAll ();
this.bsSelection.or (set);
} else if (addRemove.booleanValue ()) {
this.bsSelection.or (set);
} else {
this.bsSelection.andNot (set);
}this.empty = -1;
this.selectionChanged (false);
}, "J.util.BS,Boolean");
Clazz.defineMethod (c$, "setSelectionSubset", 
function (bs) {
this.bsSubset = bs;
}, "J.util.BS");
Clazz.defineMethod (c$, "isInSelectionSubset", 
function (atomIndex) {
return (atomIndex < 0 || this.bsSubset == null || this.bsSubset.get (atomIndex));
}, "~N");
Clazz.defineMethod (c$, "invertSelection", 
function () {
J.util.BSUtil.invertInPlace (this.bsSelection, this.viewer.getAtomCount ());
this.empty = (this.bsSelection.length () > 0 ? 0 : 1);
this.selectionChanged (false);
});
Clazz.defineMethod (c$, "excludeSelectionSet", 
($fz = function (setExclude) {
if (setExclude == null || this.empty == 1) return;
this.bsSelection.andNot (setExclude);
this.empty = -1;
}, $fz.isPrivate = true, $fz), "J.util.BS");
Clazz.defineMethod (c$, "getSelectionCount", 
function () {
if (this.empty == 1) return 0;
this.empty = 1;
var bs;
if (this.bsSubset != null) {
this.bsTemp.clearAll ();
this.bsTemp.or (this.bsSubset);
this.bsTemp.and (this.bsSelection);
bs = this.bsTemp;
} else {
bs = this.bsSelection;
}var count = bs.cardinality ();
if (count > 0) this.empty = 0;
return count;
});
Clazz.defineMethod (c$, "addListener", 
function (listener) {
for (var i = this.listeners.length; --i >= 0; ) if (this.listeners[i] === listener) {
this.listeners[i] = null;
break;
}
var len = this.listeners.length;
for (var i = len; --i >= 0; ) if (this.listeners[i] == null) {
this.listeners[i] = listener;
return;
}
if (this.listeners.length == 0) this.listeners =  new Array (1);
 else this.listeners = J.util.ArrayUtil.doubleLength (this.listeners);
this.listeners[len] = listener;
}, "J.api.JmolSelectionListener");
Clazz.defineMethod (c$, "selectionChanged", 
($fz = function (isQuiet) {
if (this.hideNotSelected) this.hide (this.viewer.getModelSet (), J.util.BSUtil.copyInvert (this.bsSelection, this.viewer.getAtomCount ()), null, isQuiet);
if (isQuiet || this.listeners.length == 0) return;
for (var i = this.listeners.length; --i >= 0; ) if (this.listeners[i] != null) this.listeners[i].selectionChanged (this.bsSelection);

}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "deleteAtoms", 
function (bs) {
var bsNew = J.util.BSUtil.copy (bs);
if (this.bsDeleted == null) {
this.bsDeleted = bsNew;
} else {
bsNew.andNot (this.bsDeleted);
this.bsDeleted.or (bs);
}this.bsHidden.andNot (this.bsDeleted);
this.bsSelection.andNot (this.bsDeleted);
return bsNew.cardinality ();
}, "J.util.BS");
Clazz.defineMethod (c$, "getDeletedAtoms", 
function () {
return this.bsDeleted;
});
Clazz.defineMethod (c$, "getSelectionSet", 
function (includeDeleted) {
if (includeDeleted || this.bsDeleted == null && this.bsSubset == null) return this.bsSelection;
var bs =  new J.util.BS ();
bs.or (this.bsSelection);
this.excludeAtoms (bs, false);
return bs;
}, "~B");
Clazz.defineMethod (c$, "getSelectionSubset", 
function () {
return this.bsSubset;
});
Clazz.defineMethod (c$, "excludeAtoms", 
function (bs, ignoreSubset) {
if (this.bsDeleted != null) bs.andNot (this.bsDeleted);
if (!ignoreSubset && this.bsSubset != null) bs.and (this.bsSubset);
}, "J.util.BS,~B");
Clazz.defineMethod (c$, "processDeletedModelAtoms", 
function (bsAtoms) {
if (this.bsDeleted != null) J.util.BSUtil.deleteBits (this.bsDeleted, bsAtoms);
if (this.bsSubset != null) J.util.BSUtil.deleteBits (this.bsSubset, bsAtoms);
J.util.BSUtil.deleteBits (this.bsFixed, bsAtoms);
J.util.BSUtil.deleteBits (this.bsHidden, bsAtoms);
var bs = J.util.BSUtil.copy (this.bsSelection);
J.util.BSUtil.deleteBits (bs, bsAtoms);
this.setSelectionSet (bs, null);
}, "J.util.BS");
Clazz.defineMethod (c$, "setMotionFixedAtoms", 
function (bs) {
this.bsFixed.clearAll ();
if (bs != null) this.bsFixed.or (bs);
}, "J.util.BS");
Clazz.defineMethod (c$, "getMotionFixedAtoms", 
function () {
return this.bsFixed;
});
Clazz.defineStatics (c$,
"TRUE", 1,
"FALSE", 0,
"UNKNOWN", -1);
});
