Clazz.declarePackage ("J.util");
Clazz.load (["J.util.BS"], "J.util.BSUtil", null, function () {
c$ = Clazz.declareType (J.util, "BSUtil");
c$.newAndSetBit = Clazz.defineMethod (c$, "newAndSetBit", 
function (i) {
var bs = J.util.BSUtil.newBitSet (i + 1);
bs.set (i);
return bs;
}, "~N");
c$.areEqual = Clazz.defineMethod (c$, "areEqual", 
function (a, b) {
return (a == null || b == null ? a == null && b == null : a.equals (b));
}, "J.util.BS,J.util.BS");
c$.haveCommon = Clazz.defineMethod (c$, "haveCommon", 
function (a, b) {
return (a == null || b == null ? false : a.intersects (b));
}, "J.util.BS,J.util.BS");
c$.cardinalityOf = Clazz.defineMethod (c$, "cardinalityOf", 
function (bs) {
return (bs == null ? 0 : bs.cardinality ());
}, "J.util.BS");
c$.newBitSet2 = Clazz.defineMethod (c$, "newBitSet2", 
function (i0, i1) {
var bs = J.util.BSUtil.newBitSet (i1);
bs.setBits (i0, i1);
return bs;
}, "~N,~N");
c$.setAll = Clazz.defineMethod (c$, "setAll", 
function (n) {
var bs = J.util.BSUtil.newBitSet (n);
bs.setBits (0, n);
return bs;
}, "~N");
c$.andNot = Clazz.defineMethod (c$, "andNot", 
function (a, b) {
if (b != null && a != null) a.andNot (b);
return a;
}, "J.util.BS,J.util.BS");
c$.copy = Clazz.defineMethod (c$, "copy", 
function (bs) {
return bs == null ? null : bs.clone ();
}, "J.util.BS");
c$.copy2 = Clazz.defineMethod (c$, "copy2", 
function (a, b) {
if (a == null || b == null) return null;
b.clearAll ();
b.or (a);
return b;
}, "J.util.BS,J.util.BS");
c$.copyInvert = Clazz.defineMethod (c$, "copyInvert", 
function (bs, n) {
return (bs == null ? null : J.util.BSUtil.andNot (J.util.BSUtil.setAll (n), bs));
}, "J.util.BS,~N");
c$.invertInPlace = Clazz.defineMethod (c$, "invertInPlace", 
function (bs, n) {
return J.util.BSUtil.copy2 (J.util.BSUtil.copyInvert (bs, n), bs);
}, "J.util.BS,~N");
c$.toggleInPlace = Clazz.defineMethod (c$, "toggleInPlace", 
function (a, b) {
if (a.equals (b)) {
a.clearAll ();
} else if (J.util.BSUtil.andNot (J.util.BSUtil.copy (b), a).length () == 0) {
J.util.BSUtil.andNot (a, b);
} else {
a.or (b);
}return a;
}, "J.util.BS,J.util.BS");
c$.deleteBits = Clazz.defineMethod (c$, "deleteBits", 
function (bs, bsDelete) {
if (bs == null || bsDelete == null) return bs;
var ipt = bsDelete.nextSetBit (0);
if (ipt < 0) return bs;
var len = bs.length ();
var lend = Math.min (len, bsDelete.length ());
var i;
for (i = bsDelete.nextClearBit (ipt); i < lend && i >= 0; i = bsDelete.nextClearBit (i + 1)) bs.setBitTo (ipt++, bs.get (i));

for (i = lend; i < len; i++) bs.setBitTo (ipt++, bs.get (i));

if (ipt < len) bs.clearBits (ipt, len);
return bs;
}, "J.util.BS,J.util.BS");
c$.newBitSet = Clazz.defineMethod (c$, "newBitSet", 
function (nFree) {
return J.util.BS.newN (nFree);
}, "~N");
c$.offset = Clazz.defineMethod (c$, "offset", 
function (bs0, pos, offset) {
if (bs0 == null) return;
var bsTemp = J.util.BS.newN (bs0.length () + offset);
for (var i = bs0.nextSetBit (0); i >= pos; i = bs0.nextSetBit (i + 1)) bsTemp.set (i + offset);

J.util.BSUtil.copy2 (bsTemp, bs0);
}, "J.util.BS,~N,~N");
c$.setMapBitSet = Clazz.defineMethod (c$, "setMapBitSet", 
function (ht, i1, i2, key) {
var bs;
if (ht.containsKey (key)) bs = ht.get (key);
 else ht.put (key, bs =  new J.util.BS ());
bs.setBits (i1, i2 + 1);
}, "java.util.Map,~N,~N,~S");
c$.emptySet = c$.prototype.emptySet =  new J.util.BS ();
});
