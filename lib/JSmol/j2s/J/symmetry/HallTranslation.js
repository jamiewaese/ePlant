Clazz.declarePackage ("J.symmetry");
Clazz.load (["J.util.P3i"], "J.symmetry.HallTranslation", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.translationCode = '\0';
this.rotationOrder = 0;
this.rotationShift12ths = 0;
this.vectorShift12ths = null;
Clazz.instantialize (this, arguments);
}, J.symmetry, "HallTranslation");
Clazz.prepareFields (c$, function () {
this.vectorShift12ths =  new J.util.P3i ();
});
Clazz.makeConstructor (c$, 
function () {
});
Clazz.makeConstructor (c$, 
function (translationCode, order) {
for (var i = 0; i < J.symmetry.HallTranslation.hallTranslationTerms.length; i++) {
var h = J.symmetry.HallTranslation.hallTranslationTerms[i];
if (h.translationCode == translationCode) {
if (h.rotationOrder == 0 || h.rotationOrder == order) {
this.translationCode = translationCode;
this.rotationShift12ths = h.rotationShift12ths;
this.vectorShift12ths = h.vectorShift12ths;
return;
}}}
}, "~S,~N");
Clazz.makeConstructor (c$, 
($fz = function (translationCode, vectorShift12ths) {
this.translationCode = translationCode;
this.rotationOrder = 0;
this.rotationShift12ths = 0;
this.vectorShift12ths = vectorShift12ths;
}, $fz.isPrivate = true, $fz), "~S,J.util.P3i");
Clazz.makeConstructor (c$, 
($fz = function (translationCode, order, rotationShift12ths) {
this.translationCode = translationCode;
this.rotationOrder = order;
this.rotationShift12ths = rotationShift12ths;
this.vectorShift12ths =  new J.util.P3i ();
}, $fz.isPrivate = true, $fz), "~S,~N,~N");
c$.getHallLatticeEquivalent = Clazz.defineMethod (c$, "getHallLatticeEquivalent", 
function (latticeParameter) {
var latticeCode = J.symmetry.HallTranslation.getLatticeCode (latticeParameter);
var isCentrosymmetric = (latticeParameter > 0);
return (isCentrosymmetric ? "-" : "") + latticeCode + " 1";
}, "~N");
c$.getLatticeIndex = Clazz.defineMethod (c$, "getLatticeIndex", 
function (latt) {
for (var i = 1, ipt = 3; i <= J.symmetry.HallTranslation.nLatticeTypes; i++, ipt += 3) if (J.symmetry.HallTranslation.latticeTranslationData[ipt].charAt (0) == latt) return i;

return 0;
}, "~S");
c$.getLatticeCode = Clazz.defineMethod (c$, "getLatticeCode", 
function (latt) {
if (latt < 0) latt = -latt;
return (latt == 0 ? '\0' : latt > J.symmetry.HallTranslation.nLatticeTypes ? J.symmetry.HallTranslation.getLatticeCode (J.symmetry.HallTranslation.getLatticeIndex (String.fromCharCode (latt))) : J.symmetry.HallTranslation.latticeTranslationData[latt * 3].charAt (0));
}, "~N");
c$.getLatticeDesignation = Clazz.defineMethod (c$, "getLatticeDesignation", 
function (latt) {
var isCentrosymmetric = (latt > 0);
var str = (isCentrosymmetric ? "-" : "");
if (latt < 0) latt = -latt;
if (latt == 0 || latt > J.symmetry.HallTranslation.nLatticeTypes) return "";
return str + J.symmetry.HallTranslation.getLatticeCode (latt) + ": " + (isCentrosymmetric ? "centrosymmetric " : "") + J.symmetry.HallTranslation.latticeTranslationData[latt * 3 + 1];
}, "~N");
c$.getLatticeDesignation = Clazz.defineMethod (c$, "getLatticeDesignation", 
function (latticeCode, isCentrosymmetric) {
var latt = J.symmetry.HallTranslation.getLatticeIndex (latticeCode);
if (!isCentrosymmetric) latt = -latt;
return J.symmetry.HallTranslation.getLatticeDesignation (latt);
}, "~S,~B");
c$.getLatticeExtension = Clazz.defineMethod (c$, "getLatticeExtension", 
function (latt, isCentrosymmetric) {
for (var i = 1, ipt = 3; i <= J.symmetry.HallTranslation.nLatticeTypes; i++, ipt += 3) if (J.symmetry.HallTranslation.latticeTranslationData[ipt].charAt (0) == latt) return J.symmetry.HallTranslation.latticeTranslationData[ipt + 2] + (isCentrosymmetric ? " -1" : "");

return "";
}, "~S,~B");
Clazz.defineStatics (c$,
"latticeTranslationData", ["\0", "unknown", "", "P", "primitive", "", "I", "body-centered", " 1n", "R", "rhombohedral", " 1r 1r", "F", "face-centered", " 1ab 1bc 1ac", "A", "A-centered", " 1bc", "B", "B-centered", " 1ac", "C", "C-centered", " 1ab", "S", "rhombohedral(S)", " 1s 1s", "T", "rhombohedral(T)", " 1t 1t"]);
c$.nLatticeTypes = c$.prototype.nLatticeTypes = Clazz.doubleToInt (J.symmetry.HallTranslation.latticeTranslationData.length / 3) - 1;
c$.hallTranslationTerms = c$.prototype.hallTranslationTerms = [ new J.symmetry.HallTranslation ('a', J.util.P3i.new3 (6, 0, 0)),  new J.symmetry.HallTranslation ('b', J.util.P3i.new3 (0, 6, 0)),  new J.symmetry.HallTranslation ('c', J.util.P3i.new3 (0, 0, 6)),  new J.symmetry.HallTranslation ('n', J.util.P3i.new3 (6, 6, 6)),  new J.symmetry.HallTranslation ('u', J.util.P3i.new3 (3, 0, 0)),  new J.symmetry.HallTranslation ('v', J.util.P3i.new3 (0, 3, 0)),  new J.symmetry.HallTranslation ('w', J.util.P3i.new3 (0, 0, 3)),  new J.symmetry.HallTranslation ('d', J.util.P3i.new3 (3, 3, 3)),  new J.symmetry.HallTranslation ('1', 2, 6),  new J.symmetry.HallTranslation ('1', 3, 4),  new J.symmetry.HallTranslation ('2', 3, 8),  new J.symmetry.HallTranslation ('1', 4, 3),  new J.symmetry.HallTranslation ('3', 4, 9),  new J.symmetry.HallTranslation ('1', 6, 2),  new J.symmetry.HallTranslation ('2', 6, 4),  new J.symmetry.HallTranslation ('4', 6, 8),  new J.symmetry.HallTranslation ('5', 6, 10),  new J.symmetry.HallTranslation ('r', J.util.P3i.new3 (4, 8, 8)),  new J.symmetry.HallTranslation ('s', J.util.P3i.new3 (8, 8, 4)),  new J.symmetry.HallTranslation ('t', J.util.P3i.new3 (8, 4, 8))];
});
