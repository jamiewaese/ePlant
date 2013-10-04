Clazz.declarePackage ("J.adapter.readers.pymol");
Clazz.load (["J.adapter.readers.cifpdb.PdbReader", "java.util.ArrayList", "$.Hashtable", "J.util.BS", "$.P3"], "J.adapter.readers.pymol.PyMOLReader", ["java.lang.Boolean", "J.adapter.readers.pymol.PickleReader", "$.PyMOL", "J.adapter.smarter.Bond", "$.Structure", "J.atomdata.RadiusData", "J.constant.EnumStructure", "$.EnumVdw", "J.modelset.MeasurementData", "$.ModelSettings", "J.util.BSUtil", "$.BoxInfo", "$.C", "$.ColorUtil", "$.Escape", "$.Logger", "$.Point3fi", "$.SB"], function () {
c$ = Clazz.decorateAsClass (function () {
this.settings = null;
this.atomCount0 = 0;
this.$atomCount = 0;
this.strucNo = 0;
this.isHidden = false;
this.pymolAtoms = null;
this.bsBonded = null;
this.bsHidden = null;
this.bsWater = null;
this.atomMap = null;
this.ssMap = null;
this.ssMapA = null;
this.colixList = null;
this.labels = null;
this.modelSettings = null;
this.colixes = null;
this.isStateScript = false;
this.width = 0;
this.height = 0;
this.valence = false;
this.xyzMin = null;
this.xyzMax = null;
this.nModels = 0;
this.reps = null;
this.cartoonTranslucency = 0;
this.movie = null;
this.isMovie = false;
this.pymol = null;
this.lstStates = null;
this.names = null;
this.lstTrajectories = null;
this.currentFrame = -1;
this.allStates = false;
this.totalAtomCount = 0;
this.branchName = null;
this.bsModelAtoms = null;
this.branchID = 0;
Clazz.instantialize (this, arguments);
}, J.adapter.readers.pymol, "PyMOLReader", J.adapter.readers.cifpdb.PdbReader);
Clazz.prepareFields (c$, function () {
this.bsBonded =  new J.util.BS ();
this.bsHidden =  new J.util.BS ();
this.bsWater =  new J.util.BS ();
this.ssMap =  new java.util.Hashtable ();
this.ssMapA =  new java.util.Hashtable ();
this.colixList =  new java.util.ArrayList ();
this.labels =  new java.util.ArrayList ();
this.modelSettings =  new java.util.ArrayList ();
this.xyzMin = J.util.P3.new3 (1e6, 1e6, 1e6);
this.xyzMax = J.util.P3.new3 (-1000000.0, -1000000.0, -1000000.0);
this.reps =  new Array (17);
this.pymol =  new java.util.Hashtable ();
this.lstStates =  new java.util.ArrayList ();
this.names =  new java.util.Hashtable ();
this.lstTrajectories =  new java.util.ArrayList ();
this.bsModelAtoms = J.util.BS.newN (1000);
});
Clazz.defineMethod (c$, "initializeReader", 
function () {
this.isBinary = true;
this.isStateScript = this.htParams.containsKey ("isStateScript");
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("noAutoBond", Boolean.TRUE);
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("shapes", this.modelSettings);
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("isPyMOL", Boolean.TRUE);
Clazz.superCall (this, J.adapter.readers.pymol.PyMOLReader, "initializeReader", []);
});
Clazz.overrideMethod (c$, "processBinaryDocument", 
function (doc) {
var reader =  new J.adapter.readers.pymol.PickleReader (doc, this.viewer);
var map = reader.getMap ();
reader = null;
this.process (map);
}, "J.api.JmolDocument");
Clazz.defineMethod (c$, "process", 
($fz = function (map) {
this.addColors (J.adapter.readers.pymol.PyMOLReader.getMapList (map, "colors"));
for (var i = 0; i < 17; i++) this.reps[i] = J.util.BS.newN (1000);

this.settings = J.adapter.readers.pymol.PyMOLReader.getMapList (map, "settings");
this.allStates = this.getBooleanSetting (49);
var mov = J.adapter.readers.pymol.PyMOLReader.getMapList (map, "movie");
if (mov != null && !this.allStates) {
var frameCount = J.adapter.readers.pymol.PyMOLReader.getInt (mov, 0);
if (frameCount > 0) {
this.currentFrame = Clazz.floatToInt (this.getFloatSetting (194));
this.isMovie = true;
this.movie =  new java.util.Hashtable ();
this.movie.put ("states", this.lstStates);
this.movie.put ("frameCount", Integer.$valueOf (frameCount));
this.movie.put ("frames", J.adapter.readers.pymol.PyMOLReader.getList (mov, 4));
this.movie.put ("currentFrame", Integer.$valueOf (this.currentFrame));
this.pymol.put ("movie", this.movie);
}}if (!this.isStateScript && this.filter != null && this.filter.indexOf ("DORESIZE") >= 0) try {
this.width = J.adapter.readers.pymol.PyMOLReader.getInt (J.adapter.readers.pymol.PyMOLReader.getMapList (map, "main"), 0);
this.height = J.adapter.readers.pymol.PyMOLReader.getInt (J.adapter.readers.pymol.PyMOLReader.getMapList (map, "main"), 1);
if (this.width > 0 && this.height > 0) {
this.atomSetCollection.setAtomSetCollectionAuxiliaryInfo ("perferredWidthHeight", [this.width, this.height]);
this.viewer.resizeInnerPanel (this.width, this.height);
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
this.valence = this.getBooleanSetting (64);
this.cartoonTranslucency = this.getFloatSetting (279);
var names = J.adapter.readers.pymol.PyMOLReader.getMapList (map, "names");
this.totalAtomCount = this.getTotalAtomCount (names);
J.util.Logger.info ("PyMOL total atom count = " + this.totalAtomCount);
for (var i = 1; i < names.size (); i++) this.processBranch (J.adapter.readers.pymol.PyMOLReader.getList (names, i));

if (this.isMovie) this.atomSetCollection.finalizeTrajectoryAs (this.lstTrajectories, null);
this.setDefinitions ();
this.setRendering (J.adapter.readers.pymol.PyMOLReader.getMapList (map, "view"));
}, $fz.isPrivate = true, $fz), "java.util.Map");
Clazz.defineMethod (c$, "setDefinitions", 
($fz = function () {
this.modelSettings.add ( new J.modelset.ModelSettings (1060866, null, this.names));
this.appendLoadNote (this.viewer.getAtomDefs (this.names));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getTotalAtomCount", 
($fz = function (names) {
var n = 0;
for (var i = 1; i < names.size (); i++) {
var branch = J.adapter.readers.pymol.PyMOLReader.getList (names, i);
if (this.checkBranch (branch) && J.adapter.readers.pymol.PyMOLReader.getBranchType (branch) == 1) n += J.adapter.readers.pymol.PyMOLReader.getBranchAoms (J.adapter.readers.pymol.PyMOLReader.getList (branch, 5)).size ();
}
return n;
}, $fz.isPrivate = true, $fz), "java.util.List");
Clazz.defineMethod (c$, "addColors", 
($fz = function (colors) {
if (colors == null || colors.size () == 0) return;
var pt =  new J.util.P3 ();
for (var i = colors.size (); --i >= 0; ) {
var c = J.adapter.readers.pymol.PyMOLReader.getList (colors, i);
J.adapter.readers.pymol.PyMOL.addColor (c.get (1), J.util.ColorUtil.colorPtToInt (this.getPoint (J.adapter.readers.pymol.PyMOLReader.getList (c, 2), 0, pt)));
}
}, $fz.isPrivate = true, $fz), "java.util.List");
c$.getString = Clazz.defineMethod (c$, "getString", 
($fz = function (list, i) {
var s = list.get (i);
return (s.length == 0 ? " " : s);
}, $fz.isPrivate = true, $fz), "java.util.List,~N");
c$.getInt = Clazz.defineMethod (c$, "getInt", 
($fz = function (list, i) {
return (list.get (i)).intValue ();
}, $fz.isPrivate = true, $fz), "java.util.List,~N");
c$.getFloat = Clazz.defineMethod (c$, "getFloat", 
($fz = function (list, i) {
var $private = Clazz.checkPrivateMethod (arguments);
if ($private != null) {
return $private.apply (this, arguments);
}
return (list == null ? 0 : (list.get (i)).floatValue ());
}, $fz.isPrivate = true, $fz), "java.util.List,~N");
Clazz.defineMethod (c$, "getPoint", 
($fz = function (list, i, pt) {
pt.set (J.adapter.readers.pymol.PyMOLReader.getFloat (list, i++), J.adapter.readers.pymol.PyMOLReader.getFloat (list, i++), J.adapter.readers.pymol.PyMOLReader.getFloat (list, i));
return pt;
}, $fz.isPrivate = true, $fz), "java.util.List,~N,J.util.P3");
c$.getList = Clazz.defineMethod (c$, "getList", 
($fz = function (list, i) {
if (list == null || list.size () <= i) return null;
var o = list.get (i);
return (Clazz.instanceOf (o, java.util.List) ? o : null);
}, $fz.isPrivate = true, $fz), "java.util.List,~N");
c$.getMapList = Clazz.defineMethod (c$, "getMapList", 
($fz = function (map, key) {
return map.get (key);
}, $fz.isPrivate = true, $fz), "java.util.Map,~S");
Clazz.defineMethod (c$, "getBooleanSetting", 
($fz = function (i) {
return (this.getFloatSetting (i) != 0);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "getFloatSetting", 
($fz = function (i) {
var v = (J.adapter.readers.pymol.PyMOLReader.getList (this.settings, i).get (2)).floatValue ();
J.util.Logger.info ("Pymol setting " + i + " = " + v);
return v;
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "processBranch", 
($fz = function (branch) {
if (!this.checkBranch (branch)) return;
J.util.Logger.info ("PyMOL model " + (this.nModels + 1) + " Branch " + this.branchName + (this.isHidden ? " (hidden)" : ""));
var type = J.adapter.readers.pymol.PyMOLReader.getBranchType (branch);
var deepBranch = J.adapter.readers.pymol.PyMOLReader.getList (branch, 5);
this.branchID = 0;
switch (type) {
case 1:
this.processBranchModels (deepBranch);
break;
case 4:
this.processBranchMeasure (deepBranch);
break;
case 2:
case 3:
case 6:
case 7:
case 12:
System.out.println ("Unprocessed branch type " + type);
break;
}
}, $fz.isPrivate = true, $fz), "java.util.List");
Clazz.defineMethod (c$, "checkBranch", 
($fz = function (branch) {
this.branchName = J.adapter.readers.pymol.PyMOLReader.getString (branch, 0);
if (this.branchName.indexOf ("_") == 0 || J.adapter.readers.pymol.PyMOLReader.getInt (branch, 1) != 0) return false;
this.isHidden = (J.adapter.readers.pymol.PyMOLReader.getInt (branch, 2) != 1);
return !this.isHidden;
}, $fz.isPrivate = true, $fz), "java.util.List");
Clazz.defineMethod (c$, "processBranchMeasure", 
($fz = function (deepBranch) {
if (this.isHidden || this.branchName.indexOf ("measure") < 0) return;
var measure = J.adapter.readers.pymol.PyMOLReader.getList (J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 2), 0);
var color = J.adapter.readers.pymol.PyMOLReader.getInt (J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 0), 2);
var pt;
var nCoord = (Clazz.instanceOf (measure.get (pt = 1), java.util.List) ? 2 : Clazz.instanceOf (measure.get (pt = 4), java.util.List) ? 3 : Clazz.instanceOf (measure.get (pt = 6), java.util.List) ? 4 : 0);
if (nCoord == 0) return;
var list = J.adapter.readers.pymol.PyMOLReader.getList (measure, pt);
var points =  new java.util.ArrayList ();
for (var i = 0, p = 0; i < nCoord; i++, p += 3) points.add (this.getPoint (list, p,  new J.util.Point3fi ()));

var bs = J.util.BSUtil.newAndSetBit (0);
var md =  new J.modelset.MeasurementData (this.viewer, points);
md.note = this.branchName;
var strFormat = "";
var nDigits = -1;
switch (nCoord) {
case 2:
nDigits = Clazz.floatToInt (this.getFloatSetting (530));
break;
case 3:
nDigits = Clazz.floatToInt (this.getFloatSetting (531));
break;
case 4:
nDigits = Clazz.floatToInt (this.getFloatSetting (532));
break;
}
if (nDigits >= 0) strFormat = nCoord + ":%0." + nDigits + "VALUE %UNITS";
md.strFormat = strFormat;
md.colix = J.util.C.getColix (J.adapter.readers.pymol.PyMOL.getRGB (color));
var ms =  new J.modelset.ModelSettings (6, bs, md);
this.modelSettings.add (ms);
}, $fz.isPrivate = true, $fz), "java.util.List");
Clazz.defineMethod (c$, "processBranchModels", 
($fz = function (deepBranch) {
if (!this.isMovie) this.processCryst (J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 10));
this.$atomCount = this.atomCount0 = this.atomSetCollection.getAtomCount ();
this.atomMap =  Clazz.newIntArray (J.adapter.readers.pymol.PyMOLReader.getInt (deepBranch, 3), 0);
var states = J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 4);
var bonds = J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 6);
this.pymolAtoms = J.adapter.readers.pymol.PyMOLReader.getBranchAoms (deepBranch);
var ns = states.size ();
var bsState = null;
var bsAtoms = J.util.BS.newN (this.atomCount0 + this.pymolAtoms.size ());
this.names.put (this.branchName.toLowerCase (), bsAtoms);
if (this.isMovie) {
if (this.nModels == 0) this.model (++this.nModels);
var n = this.pymolAtoms.size ();
bsState = J.util.BS.newN (n);
if (this.lstTrajectories.size () == 0) {
for (var i = ns; --i >= 0; ) {
this.lstTrajectories.add ( new Array (this.totalAtomCount));
this.lstStates.add ( new J.util.BS ());
}
}for (var i = ns; --i >= 0; ) {
var state = J.adapter.readers.pymol.PyMOLReader.getList (states, i);
var idxToAtm = J.adapter.readers.pymol.PyMOLReader.getList (state, 3);
for (var j = idxToAtm.size (); --j >= 0; ) bsState.set (j);

}
for (var i = bsState.nextSetBit (0); i >= 0; i = bsState.nextSetBit (i + 1)) if (!this.addAtom (this.pymolAtoms, i, -1, null, bsAtoms)) bsState.clear (i);

for (var i = 0; i < ns; i++) {
var state = J.adapter.readers.pymol.PyMOLReader.getList (states, i);
var coords = J.adapter.readers.pymol.PyMOLReader.getList (state, 2);
var idxToAtm = J.adapter.readers.pymol.PyMOLReader.getList (state, 3);
var trajectory = this.lstTrajectories.get (i);
var bs = this.lstStates.get (i);
for (var j = idxToAtm.size (); --j >= 0; ) {
var apt = J.adapter.readers.pymol.PyMOLReader.getInt (idxToAtm, j);
if (!bsState.get (apt)) continue;
var ia = this.atomMap[apt];
bs.set (ia);
var cpt = j * 3;
var x = J.adapter.readers.pymol.PyMOLReader.getFloat (coords, cpt);
var y = J.adapter.readers.pymol.PyMOLReader.getFloat (coords, ++cpt);
var z = J.adapter.readers.pymol.PyMOLReader.getFloat (coords, ++cpt);
trajectory[ia] = J.util.P3.new3 (x, y, z);
if (this.branchName.startsWith ("E20")) System.out.println (this.branchName + " " + ia + "  " + trajectory[ia]);
J.util.BoxInfo.addPointXYZ (x, y, z, this.xyzMin, this.xyzMax, 0);
}
}
} else {
for (var i = 0; i < ns; i++) {
var state = J.adapter.readers.pymol.PyMOLReader.getList (states, i);
var coords = J.adapter.readers.pymol.PyMOLReader.getList (state, 2);
var idxToAtm = J.adapter.readers.pymol.PyMOLReader.getList (state, 3);
var n = idxToAtm.size ();
var name = J.adapter.readers.pymol.PyMOLReader.getString (state, 5).trim ();
if (n == 0) continue;
this.branchID++;
if (name.length == 0) {
this.currentFrame = Clazz.floatToInt (this.getFloatSetting (194));
if (this.lstStates.size () < ns) for (var j = this.lstStates.size (); j < ns; j++) this.lstStates.add ( new J.util.BS ());

bsState = this.lstStates.get (i);
} else {
bsAtoms = J.util.BS.newN (this.atomCount0 + this.pymolAtoms.size ());
this.names.put (name, bsAtoms);
}this.processStructures ();
this.setSurface ();
this.model (++this.nModels);
for (var idx = 0; idx < n; idx++) this.addAtom (this.pymolAtoms, J.adapter.readers.pymol.PyMOLReader.getInt (idxToAtm, idx), idx, coords, bsState);

bsAtoms.or (bsState);
}
}J.util.Logger.info ("read " + (this.$atomCount - this.atomCount0) + " atoms");
this.processStructures ();
this.setSurface ();
this.processBonds (bonds);
}, $fz.isPrivate = true, $fz), "java.util.List");
c$.getBranchType = Clazz.defineMethod (c$, "getBranchType", 
($fz = function (branch) {
return J.adapter.readers.pymol.PyMOLReader.getInt (branch, 4);
}, $fz.isPrivate = true, $fz), "java.util.List");
c$.getBranchAoms = Clazz.defineMethod (c$, "getBranchAoms", 
($fz = function (deepBranch) {
return J.adapter.readers.pymol.PyMOLReader.getList (deepBranch, 7);
}, $fz.isPrivate = true, $fz), "java.util.List");
Clazz.defineMethod (c$, "model", 
function (modelNumber) {
this.bsModelAtoms.clearAll ();
Clazz.superCall (this, J.adapter.readers.pymol.PyMOLReader, "model", [modelNumber]);
}, "~N");
Clazz.defineMethod (c$, "addAtom", 
($fz = function (pymolAtoms, apt, icoord, coords, bsState) {
this.atomMap[apt] = -1;
var a = J.adapter.readers.pymol.PyMOLReader.getList (pymolAtoms, apt);
var seqNo = J.adapter.readers.pymol.PyMOLReader.getInt (a, 0);
var chainID = J.adapter.readers.pymol.PyMOLReader.getString (a, 1);
var altLoc = J.adapter.readers.pymol.PyMOLReader.getString (a, 2);
var insCode = " ";
var group3 = J.adapter.readers.pymol.PyMOLReader.getString (a, 5);
if (group3.length > 3) group3 = group3.substring (0, 3);
if (group3.equals (" ")) group3 = "UNK";
var name = J.adapter.readers.pymol.PyMOLReader.getString (a, 6);
var sym = J.adapter.readers.pymol.PyMOLReader.getString (a, 7);
if (sym.equals (" ")) sym = J.adapter.readers.pymol.PyMOLReader.getString (a, 7);
var atom = this.processAtom (name, altLoc.charAt (0), group3, chainID.charAt (0), seqNo, insCode.charAt (0), false, sym);
if (!this.filterPDBAtom (atom, this.fileAtomIndex++)) return false;
if (group3.equals ("HOH")) this.bsWater.set (this.$atomCount);
atom.bfactor = J.adapter.readers.pymol.PyMOLReader.getFloat (a, 14);
atom.occupancy = Clazz.floatToInt (J.adapter.readers.pymol.PyMOLReader.getFloat (a, 15) * 100);
if (bsState != null) bsState.set (this.$atomCount);
var ss = J.adapter.readers.pymol.PyMOLReader.getString (a, 10);
var bs = this.ssMap.get (ss);
if (bs == null) this.ssMap.put (ss, bs =  new J.util.BS ());
if (this.ssMapA.get (ss) == null) this.ssMapA.put (ss,  new J.util.BS ());
var list2 = J.adapter.readers.pymol.PyMOLReader.getList (a, 20);
for (var i = 0; i < 12; i++) if (J.adapter.readers.pymol.PyMOLReader.getInt (list2, i) == 1) this.reps[i].set (this.$atomCount);

if (this.reps[3].get (this.$atomCount)) {
var label = J.adapter.readers.pymol.PyMOLReader.getString (a, 9);
if (label.equals (" ")) this.reps[3].clear (this.$atomCount);
 else this.labels.add (label);
}this.bsHidden.setBitTo (this.$atomCount, this.isHidden);
this.bsModelAtoms.set (this.$atomCount);
this.atomMap[apt] = this.$atomCount++;
var serNo = J.adapter.readers.pymol.PyMOLReader.getInt (a, 22);
bs.set (seqNo);
var charge = J.adapter.readers.pymol.PyMOLReader.getInt (a, 18);
var cpt = icoord * 3;
var x = J.adapter.readers.pymol.PyMOLReader.getFloat (coords, cpt);
var y = J.adapter.readers.pymol.PyMOLReader.getFloat (coords, ++cpt);
var z = J.adapter.readers.pymol.PyMOLReader.getFloat (coords, ++cpt);
if (coords != null) J.util.BoxInfo.addPointXYZ (x, y, z, this.xyzMin, this.xyzMax, 0);
this.processAtom2 (atom, serNo, x, y, z, charge);
var color = J.adapter.readers.pymol.PyMOL.getRGB (J.adapter.readers.pymol.PyMOLReader.getInt (a, 21));
this.colixList.add (Integer.$valueOf (J.util.C.getColixO (Integer.$valueOf (color))));
return true;
}, $fz.isPrivate = true, $fz), "java.util.List,~N,~N,java.util.List,J.util.BS");
Clazz.overrideMethod (c$, "setAdditionalAtomParameters", 
function (atom) {
}, "J.adapter.smarter.Atom");
Clazz.defineMethod (c$, "processStructures", 
($fz = function () {
if (this.atomSetCollection.bsStructuredModels == null) this.atomSetCollection.bsStructuredModels =  new J.util.BS ();
this.atomSetCollection.bsStructuredModels.set (Math.max (this.atomSetCollection.getCurrentAtomSetIndex (), 0));
this.processSS (this.ssMap.get ("H"), this.ssMapA.get ("H"), J.constant.EnumStructure.HELIX, 0);
this.processSS (this.ssMap.get ("S"), this.ssMapA.get ("S"), J.constant.EnumStructure.SHEET, 1);
this.processSS (this.ssMap.get ("L"), this.ssMapA.get ("L"), J.constant.EnumStructure.TURN, 0);
this.ssMap =  new java.util.Hashtable ();
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "processSS", 
($fz = function (bs, bsAtomType, type, strandCount) {
if (bs == null) return;
var istart = -1;
var iend = -1;
var inew = -1;
var imodel = -1;
var thismodel = -1;
var atoms = this.atomSetCollection.getAtoms ();
for (var i = this.atomCount0; i < this.$atomCount; i++) {
var seqNo = atoms[i].sequenceNumber;
thismodel = atoms[i].atomSetIndex;
if (seqNo >= 0 && bs.get (seqNo)) {
if (istart >= 0) {
if (imodel == thismodel) {
iend = i;
continue;
}inew = i;
} else {
istart = iend = i;
imodel = thismodel;
continue;
}} else if (istart < 0) {
continue;
} else {
inew = -1;
}var structure =  new J.adapter.smarter.Structure (imodel, type, type, type.toString (), ++this.strucNo, strandCount);
var a = atoms[istart];
var b = atoms[iend];
bsAtomType.setBits (istart, iend + 1);
structure.set (a.chainID, a.sequenceNumber, a.insertionCode, b.chainID, b.sequenceNumber, b.insertionCode);
this.atomSetCollection.addStructure (structure);
istart = iend = inew;
}
}, $fz.isPrivate = true, $fz), "J.util.BS,J.util.BS,J.constant.EnumStructure,~N");
Clazz.defineMethod (c$, "processBonds", 
($fz = function (bonds) {
this.bsBonded.clear (this.$atomCount);
for (var i = 0; i < bonds.size (); i++) {
var b = J.adapter.readers.pymol.PyMOLReader.getList (bonds, i);
var order = (this.valence ? J.adapter.readers.pymol.PyMOLReader.getInt (b, 2) : 1);
if (order < 1 || order > 3) order = 1;
var ia = this.atomMap[J.adapter.readers.pymol.PyMOLReader.getInt (b, 0)];
var ib = this.atomMap[J.adapter.readers.pymol.PyMOLReader.getInt (b, 1)];
this.bsBonded.set (ia);
this.bsBonded.set (ib);
this.atomSetCollection.addBond ( new J.adapter.smarter.Bond (ia, ib, order));
}
}, $fz.isPrivate = true, $fz), "java.util.List");
Clazz.defineMethod (c$, "processCryst", 
($fz = function (cryst) {
if (cryst == null || cryst.size () == 0) return;
var l = J.adapter.readers.pymol.PyMOLReader.getList (J.adapter.readers.pymol.PyMOLReader.getList (cryst, 0), 0);
var a = J.adapter.readers.pymol.PyMOLReader.getList (J.adapter.readers.pymol.PyMOLReader.getList (cryst, 0), 1);
this.setUnitCell (J.adapter.readers.pymol.PyMOLReader.getFloat (l, 0), J.adapter.readers.pymol.PyMOLReader.getFloat (l, 1), J.adapter.readers.pymol.PyMOLReader.getFloat (l, 2), J.adapter.readers.pymol.PyMOLReader.getFloat (a, 0), J.adapter.readers.pymol.PyMOLReader.getFloat (a, 1), J.adapter.readers.pymol.PyMOLReader.getFloat (a, 2));
this.setSpaceGroupName (J.adapter.readers.pymol.PyMOLReader.getString (cryst, 1));
}, $fz.isPrivate = true, $fz), "java.util.List");
Clazz.defineMethod (c$, "setRendering", 
($fz = function (view) {
if (this.isStateScript) return;
this.setJmolDefaults ();
var sb =  new J.util.SB ();
this.setView (sb, view);
this.setColixes ();
this.setShapes ();
this.setFrame ();
this.addJmolScript (sb.toString ());
}, $fz.isPrivate = true, $fz), "java.util.List");
Clazz.defineMethod (c$, "setJmolDefaults", 
($fz = function () {
this.viewer.setBooleanProperty ("navigationMode", false);
this.viewer.setBooleanProperty ("zoomLarge", false);
this.viewer.setBooleanProperty ("ssBondsBackbone", false);
this.viewer.setStringProperty ("measurementUnits", "ANGSTROMS");
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setColixes", 
($fz = function () {
this.colixes =  Clazz.newShortArray (this.colixList.size (), 0);
for (var i = this.colixes.length; --i >= 0; ) this.colixes[i] = this.colixList.get (i).intValue ();

}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setShapes", 
($fz = function () {
var ms;
var bs = J.util.BSUtil.newBitSet2 (0, this.$atomCount);
ms =  new J.modelset.ModelSettings (0, bs, null);
ms.setSize (0);
ms.setColors (this.colixes, 0);
this.modelSettings.add (ms);
ms =  new J.modelset.ModelSettings (1, bs, null);
ms.setSize (0);
this.modelSettings.add (ms);
for (var i = 0; i < 12; i++) this.setShape (i);

if (!this.bsHidden.isEmpty ()) this.modelSettings.add ( new J.modelset.ModelSettings (3145770, this.bsHidden, null));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setShape", 
($fz = function (shapeID) {
var bs = this.reps[shapeID];
var f;
switch (shapeID) {
case 11:
case 4:
bs.andNot (this.bsBonded);
break;
case 7:
bs.andNot (this.reps[0]);
break;
}
if (bs.isEmpty ()) return;
var ss = null;
switch (shapeID) {
case 11:
f = this.getFloatSetting (65);
var bs1 =  new J.util.BS ();
bs1.or (bs);
bs1.andNot (this.bsWater);
if (!bs1.isEmpty ()) {
ss =  new J.modelset.ModelSettings (0, bs, null);
ss.rd =  new J.atomdata.RadiusData (null, f, J.atomdata.RadiusData.EnumType.FACTOR, J.constant.EnumVdw.AUTO);
ss.setColors (this.colixes, 0);
this.modelSettings.add (ss);
}bs1.clearAll ();
bs1.or (bs);
bs1.and (this.bsWater);
if (!bs1.isEmpty ()) {
ss =  new J.modelset.ModelSettings (7, bs, null);
ss.rd =  new J.atomdata.RadiusData (null, 0.25, J.atomdata.RadiusData.EnumType.ABSOLUTE, J.constant.EnumVdw.AUTO);
ss.setColors (this.colixes, 0);
this.modelSettings.add (ss);
}break;
case 4:
case 1:
f = (shapeID == 4 ? 1 : this.getFloatSetting (155));
ss =  new J.modelset.ModelSettings (0, bs, null);
ss.rd =  new J.atomdata.RadiusData (null, f, J.atomdata.RadiusData.EnumType.FACTOR, J.constant.EnumVdw.AUTO);
ss.setColors (this.colixes, 0);
this.modelSettings.add (ss);
break;
case 0:
f = this.getFloatSetting (21) * 2;
ss =  new J.modelset.ModelSettings (1, bs, null);
ss.setSize (f);
this.modelSettings.add (ss);
break;
case 7:
f = this.getFloatSetting (44) * 8 / 1000;
ss =  new J.modelset.ModelSettings (1, bs, null);
ss.setSize (f);
this.modelSettings.add (ss);
break;
case 5:
this.setCartoon ("H", 100, 2);
this.setCartoon ("S", 96, 2);
this.setCartoon ("L", 92, 2);
break;
case 2:
break;
case 3:
ss =  new J.modelset.ModelSettings (5, bs, this.labels);
this.modelSettings.add (ss);
break;
case 6:
case 8:
case 9:
case 10:
default:
System.out.println ("Unprocessed representation type " + shapeID);
}
}, $fz.isPrivate = true, $fz), "~N");
Clazz.defineMethod (c$, "setSurface", 
($fz = function () {
var bs = this.reps[2];
if (this.isStateScript || this.bsModelAtoms.isEmpty () || bs.isEmpty ()) return;
var ss =  new J.modelset.ModelSettings (23, bs, this.branchName + "_" + this.branchID);
ss.setSize (this.getFloatSetting (4));
ss.translucency = this.getFloatSetting (138);
this.setColixes ();
ss.setColors (this.colixes, 0);
this.modelSettings.add (ss);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setCartoon", 
($fz = function (key, sizeID, factor) {
var bs = this.ssMapA.get (key);
if (bs == null) return;
bs.and (this.reps[5]);
if (bs.isEmpty ()) return;
var ss =  new J.modelset.ModelSettings (11, bs, null);
ss.setColors (this.colixes, this.cartoonTranslucency);
ss.setSize (this.getFloatSetting (sizeID) * factor);
this.modelSettings.add (ss);
}, $fz.isPrivate = true, $fz), "~S,~N,~N");
Clazz.defineMethod (c$, "setFrame", 
($fz = function () {
var bs = J.util.BSUtil.newAndSetBit (0);
if (!this.allStates && this.pymol.containsKey ("movie")) {
this.modelSettings.add ( new J.modelset.ModelSettings (1073742032, bs, this.pymol.get ("movie")));
} else {
this.modelSettings.add ( new J.modelset.ModelSettings (4115, bs, Integer.$valueOf (this.currentFrame)));
}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setView", 
($fz = function (sb, view) {
var modelWidth = 2 * this.getRotationRadius ();
var fov = this.getFloatSetting (152);
var tan = Math.tan (fov / 2 * 3.141592653589793 / 180);
var jmolCameraDepth = (0.5 / tan - 0.5);
var pymolCameraToCenter = -J.adapter.readers.pymol.PyMOLReader.getFloat (view, 18) / modelWidth;
var zoom = (jmolCameraDepth + 0.5) / pymolCameraToCenter * 100;
sb.append ("set cameraDepth " + jmolCameraDepth + ";");
sb.append ("zoom " + zoom + ";");
J.util.Logger.info ("set cameraDepth " + jmolCameraDepth);
J.util.Logger.info ("zoom " + zoom);
var center = this.getPoint (view, 19,  new J.util.P3 ());
sb.append ("center ").append (J.util.Escape.eP (center)).append (";");
sb.append ("rotate @{quaternion({").appendF (J.adapter.readers.pymol.PyMOLReader.getFloat (view, 0)).append (" ").appendF (J.adapter.readers.pymol.PyMOLReader.getFloat (view, 1)).append (" ").appendF (J.adapter.readers.pymol.PyMOLReader.getFloat (view, 2)).append ("}{").appendF (J.adapter.readers.pymol.PyMOLReader.getFloat (view, 4)).append (" ").appendF (J.adapter.readers.pymol.PyMOLReader.getFloat (view, 5)).append (" ").appendF (J.adapter.readers.pymol.PyMOLReader.getFloat (view, 6)).append ("})};");
sb.append ("translate X ").appendF (J.adapter.readers.pymol.PyMOLReader.getFloat (view, 16)).append (" angstroms;");
sb.append ("translate Y ").appendF (-J.adapter.readers.pymol.PyMOLReader.getFloat (view, 17)).append (" angstroms;");
var depthCue = this.getBooleanSetting (84);
var fog = this.getBooleanSetting (88);
sb.append ("set zShade " + (depthCue && fog) + ";");
if (depthCue && fog) {
var fog_start = this.getFloatSetting (192);
sb.append ("set zshadePower 2;set zslab " + (fog_start * 100) + "; set zdepth 0;");
}sb.append ("set perspectiveDepth " + (!this.getBooleanSetting (23)) + ";");
sb.append ("set traceAlpha " + this.getBooleanSetting (111) + ";");
sb.append ("set cartoonRockets " + this.getBooleanSetting (180) + ";");
sb.append ("set ribbonBorder " + this.getBooleanSetting (118) + ";");
sb.append ("set cartoonFancy " + !this.getBooleanSetting (118) + ";");
sb.append ("background " + J.adapter.readers.pymol.PyMOLReader.getList (this.settings, 6).get (2) + ";");
if (this.isMovie) sb.append ("animation mode loop;");
}, $fz.isPrivate = true, $fz), "J.util.SB,java.util.List");
Clazz.defineMethod (c$, "getRotationRadius", 
($fz = function () {
var center = J.util.P3.new3 ((this.xyzMax.x + this.xyzMin.x) / 2, (this.xyzMax.y + this.xyzMin.y) / 2, (this.xyzMax.z + this.xyzMin.z) / 2);
var d2max = 0;
var atoms = this.atomSetCollection.getAtoms ();
if (this.isMovie) for (var i = this.lstTrajectories.size (); --i >= 0; ) {
var pts = this.lstTrajectories.get (i);
for (var j = pts.length; --j >= 0; ) {
var pt = pts[j];
if (pt != null) d2max = J.adapter.readers.pymol.PyMOLReader.maxRadius (d2max, pt.x, pt.y, pt.z, center);
}
}
 else for (var i = 0; i < this.$atomCount; i++) {
var a = atoms[i];
d2max = J.adapter.readers.pymol.PyMOLReader.maxRadius (d2max, a.x, a.y, a.z, center);
}
return Math.pow (d2max, 0.5) + 1;
}, $fz.isPrivate = true, $fz));
c$.maxRadius = Clazz.defineMethod (c$, "maxRadius", 
($fz = function (d2max, x, y, z, center) {
var dx = (x - center.x);
var dy = (y - center.y);
var dz = (z - center.z);
var d2 = dx * dx + dy * dy + dz * dz;
if (d2 > d2max) d2max = d2;
return d2max;
}, $fz.isPrivate = true, $fz), "~N,~N,~N,~N,J.util.P3");
Clazz.defineStatics (c$,
"BRANCH_MOLECULE", 1,
"BRANCH_MAPSURFACE", 2,
"BRANCH_MAPMESH", 3,
"BRANCH_MEASURE", 4,
"BRANCH_CGO", 6,
"BRANCH_SURFACE", 7,
"BRANCH_GROUP", 12,
"REP_STICKS", 0,
"REP_SPHERES", 1,
"REP_NBSPHERES", 4,
"REP_CARTOON", 5,
"REP_LINES", 7,
"REP_NONBONDED", 11,
"REP_MAX", 12,
"REP_SURFACE", 2,
"REP_LABELS", 3,
"REP_BACKBONE", 6,
"REP_MESH", 8,
"REP_DOTS", 9,
"REP_DASHES", 10);
});
