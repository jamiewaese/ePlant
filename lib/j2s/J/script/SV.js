Clazz.declarePackage ("J.script");
Clazz.load (["J.script.T", "J.util.P3"], "J.script.SV", ["java.lang.Boolean", "$.Float", "java.util.ArrayList", "$.Arrays", "$.Collections", "$.Hashtable", "J.modelset.Bond", "J.util.BS", "$.BSUtil", "$.Escape", "$.Measure", "$.Parser", "$.SB", "$.TextFormat"], function () {
c$ = Clazz.decorateAsClass (function () {
this.index = 2147483647;
this.flags = 2;
this.myName = null;
if (!Clazz.isClassDefined ("J.script.SV.Sort")) {
J.script.SV.$SV$Sort$ ();
}
Clazz.instantialize (this, arguments);
}, J.script, "SV", J.script.T);
c$.newVariable = Clazz.defineMethod (c$, "newVariable", 
function (tok, value) {
var sv =  new J.script.SV (tok);
sv.value = value;
return sv;
}, "~N,~O");
c$.newScriptVariableBs = Clazz.defineMethod (c$, "newScriptVariableBs", 
function (bs, index) {
var sv =  new J.script.SV (10);
sv.value = bs;
if (index >= 0) sv.index = index;
return sv;
}, "J.util.BS,~N");
c$.newScriptVariableToken = Clazz.defineMethod (c$, "newScriptVariableToken", 
function (x) {
var sv =  new J.script.SV (x.tok);
sv.intValue = x.intValue;
sv.value = x.value;
return sv;
}, "J.script.T");
c$.newScriptVariableIntValue = Clazz.defineMethod (c$, "newScriptVariableIntValue", 
function (tok, intValue, value) {
var sv =  new J.script.SV (tok);
sv.intValue = intValue;
sv.value = value;
return sv;
}, "~N,~N,~O");
c$.sizeOf = Clazz.defineMethod (c$, "sizeOf", 
function (x) {
switch (x == null ? 0 : x.tok) {
case 10:
return J.util.BSUtil.cardinalityOf (J.script.SV.bsSelectToken (x));
case 1048589:
case 1048588:
return -1;
case 2:
return -2;
case 3:
return -4;
case 8:
return -8;
case 9:
return -16;
case 11:
return -32;
case 12:
return -64;
case 4:
return (x.value).length;
case 7:
return x.intValue == 2147483647 ? (x).getList ().size () : J.script.SV.sizeOf (J.script.SV.selectItemTok (x));
case 6:
return (x.value).size ();
default:
return 0;
}
}, "J.script.T");
c$.isVariableType = Clazz.defineMethod (c$, "isVariableType", 
function (x) {
return (Clazz.instanceOf (x, J.script.SV) || Clazz.instanceOf (x, J.util.BS) || Clazz.instanceOf (x, Boolean) || Clazz.instanceOf (x, Float) || Clazz.instanceOf (x, Integer) || Clazz.instanceOf (x, J.util.P3) || Clazz.instanceOf (x, J.util.V3) || Clazz.instanceOf (x, J.util.Point4f) || Clazz.instanceOf (x, J.util.Quaternion) || Clazz.instanceOf (x, String) || Clazz.instanceOf (x, java.util.Map) || Clazz.instanceOf (x, java.util.List) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array) || Clazz.instanceOf (x, Array));
}, "~O");
c$.getVariable = Clazz.defineMethod (c$, "getVariable", 
function (x) {
if (x == null) return J.script.SV.newVariable (4, "");
if (Clazz.instanceOf (x, J.script.SV)) return x;
if (Clazz.instanceOf (x, Boolean)) return J.script.SV.getBoolean ((x).booleanValue ());
if (Clazz.instanceOf (x, Integer)) return  new J.script.ScriptVariableInt ((x).intValue ());
if (Clazz.instanceOf (x, Float)) return J.script.SV.newVariable (3, x);
if (Clazz.instanceOf (x, String)) {
x = J.script.SV.unescapePointOrBitsetAsVariable (x);
if (Clazz.instanceOf (x, J.script.SV)) return x;
return J.script.SV.newVariable (4, x);
}if (Clazz.instanceOf (x, J.util.P3)) return J.script.SV.newVariable (8, x);
if (Clazz.instanceOf (x, J.util.V3)) return J.script.SV.newVariable (8, J.util.P3.newP (x));
if (Clazz.instanceOf (x, J.util.BS)) return J.script.SV.newVariable (10, x);
if (Clazz.instanceOf (x, J.util.Point4f)) return J.script.SV.newVariable (9, x);
if (Clazz.instanceOf (x, J.util.Quaternion)) return J.script.SV.newVariable (9, (x).toPoint4f ());
if (Clazz.instanceOf (x, J.util.Matrix3f)) return J.script.SV.newVariable (11, x);
if (Clazz.instanceOf (x, J.util.Matrix4f)) return J.script.SV.newVariable (12, x);
if (J.util.Escape.isAFloat (x)) return J.script.SV.newVariable (13, x);
if (Clazz.instanceOf (x, java.util.Map)) return J.script.SV.getVariableMap (x);
if (Clazz.instanceOf (x, java.util.List)) return J.script.SV.getVariableList (x);
if (J.util.Escape.isAI (x)) return J.script.SV.getVariableAI (x);
if (J.util.Escape.isAF (x)) return J.script.SV.getVariableAF (x);
if (J.util.Escape.isAD (x)) return J.script.SV.getVariableAD (x);
if (J.util.Escape.isAII (x)) return J.script.SV.getVariableAII (x);
if (J.util.Escape.isAFF (x)) return J.script.SV.getVariableAFF (x);
if (J.util.Escape.isAS (x)) return J.script.SV.getVariableAS (x);
if (J.util.Escape.isAV (x)) return J.script.SV.getVariableAV (x);
if (J.util.Escape.isAP (x)) return J.script.SV.getVariableAP (x);
return J.script.SV.newVariable (4, J.util.Escape.toReadable (null, x));
}, "~O");
c$.getVariableMap = Clazz.defineMethod (c$, "getVariableMap", 
function (x) {
var ht = x;
var e = ht.keySet ().iterator ();
while (e.hasNext ()) {
if (!(Clazz.instanceOf (ht.get (e.next ()), J.script.SV))) {
var x2 =  new java.util.Hashtable ();
for (var entry, $entry = ht.entrySet ().iterator (); $entry.hasNext () && ((entry = $entry.next ()) || true);) {
var key = entry.getKey ();
var o = entry.getValue ();
if (J.script.SV.isVariableType (o)) x2.put (key, J.script.SV.getVariable (o));
 else x2.put (key, J.script.SV.newVariable (4, J.util.Escape.toReadable (null, o)));
}
x = x2;
}break;
}
return J.script.SV.newVariable (6, x);
}, "~O");
c$.getVariableList = Clazz.defineMethod (c$, "getVariableList", 
function (v) {
var len = v.size ();
if (len > 0 && Clazz.instanceOf (v.get (0), J.script.SV)) return J.script.SV.newVariable (7, v);
var objects =  new java.util.ArrayList ();
for (var i = 0; i < len; i++) objects.add (J.script.SV.getVariable (v.get (i)));

return J.script.SV.newVariable (7, objects);
}, "java.util.List");
c$.getVariableAV = Clazz.defineMethod (c$, "getVariableAV", 
function (v) {
var objects =  new java.util.ArrayList ();
for (var i = 0; i < v.length; i++) objects.add (v[i]);

return J.script.SV.newVariable (7, objects);
}, "~A");
c$.getVariableAD = Clazz.defineMethod (c$, "getVariableAD", 
function (f) {
var objects =  new java.util.ArrayList ();
for (var i = 0; i < f.length; i++) objects.add (J.script.SV.newVariable (3, Float.$valueOf (f[i])));

return J.script.SV.newVariable (7, objects);
}, "~A");
c$.getVariableAS = Clazz.defineMethod (c$, "getVariableAS", 
function (s) {
var objects =  new java.util.ArrayList ();
for (var i = 0; i < s.length; i++) objects.add (J.script.SV.newVariable (4, s[i]));

return J.script.SV.newVariable (7, objects);
}, "~A");
c$.getVariableAP = Clazz.defineMethod (c$, "getVariableAP", 
function (p) {
var objects =  new java.util.ArrayList ();
for (var i = 0; i < p.length; i++) objects.add (J.script.SV.newVariable (8, p[i]));

return J.script.SV.newVariable (7, objects);
}, "~A");
c$.getVariableAFF = Clazz.defineMethod (c$, "getVariableAFF", 
function (fx) {
var objects =  new java.util.ArrayList ();
for (var i = 0; i < fx.length; i++) objects.add (J.script.SV.getVariableAF (fx[i]));

return J.script.SV.newVariable (7, objects);
}, "~A");
c$.getVariableAII = Clazz.defineMethod (c$, "getVariableAII", 
function (ix) {
var objects =  new java.util.ArrayList ();
for (var i = 0; i < ix.length; i++) objects.add (J.script.SV.getVariableAI (ix[i]));

return J.script.SV.newVariable (7, objects);
}, "~A");
c$.getVariableAF = Clazz.defineMethod (c$, "getVariableAF", 
function (f) {
var objects =  new java.util.ArrayList ();
for (var i = 0; i < f.length; i++) objects.add (J.script.SV.newVariable (3, Float.$valueOf (f[i])));

return J.script.SV.newVariable (7, objects);
}, "~A");
c$.getVariableAI = Clazz.defineMethod (c$, "getVariableAI", 
function (ix) {
var objects =  new java.util.ArrayList ();
for (var i = 0; i < ix.length; i++) objects.add (J.script.SV.newVariable (2, Integer.$valueOf (ix[i])));

return J.script.SV.newVariable (7, objects);
}, "~A");
Clazz.defineMethod (c$, "set", 
function (v, asCopy) {
this.index = v.index;
this.intValue = v.intValue;
this.tok = v.tok;
this.value = v.value;
if (asCopy) {
switch (this.tok) {
case 6:
this.value =  new java.util.Hashtable (v.value);
break;
case 7:
var o2 =  new java.util.ArrayList ();
var o1 = v.getList ();
for (var i = 0; i < o1.size (); i++) o2.add (o1.get (i));

this.value = o2;
break;
}
}return this;
}, "J.script.SV,~B");
Clazz.defineMethod (c$, "setName", 
function (name) {
this.myName = name;
this.flags |= 1;
return this;
}, "~S");
Clazz.defineMethod (c$, "setGlobal", 
function () {
this.flags &= -3;
return this;
});
Clazz.defineMethod (c$, "canIncrement", 
function () {
return J.script.T.tokAttr (this.flags, 1);
});
Clazz.defineMethod (c$, "increment", 
function (n) {
if (!this.canIncrement ()) return false;
switch (this.tok) {
case 2:
this.intValue += n;
break;
case 3:
this.value =  new Float ((this.value).floatValue () + n);
break;
default:
this.value = J.script.SV.nValue (this);
if (Clazz.instanceOf (this.value, Integer)) {
this.tok = 2;
this.intValue = (this.value).intValue ();
} else {
this.tok = 3;
}}
return true;
}, "~N");
Clazz.defineMethod (c$, "asBoolean", 
function () {
return J.script.SV.bValue (this);
});
Clazz.defineMethod (c$, "asInt", 
function () {
return J.script.SV.iValue (this);
});
Clazz.defineMethod (c$, "asFloat", 
function () {
return J.script.SV.fValue (this);
});
Clazz.defineMethod (c$, "asString", 
function () {
return J.script.SV.sValue (this);
});
c$.oValue = Clazz.defineMethod (c$, "oValue", 
function (x) {
switch (x == null ? 0 : x.tok) {
case 1048589:
return Boolean.TRUE;
case 0:
case 1048588:
return Boolean.FALSE;
case 2:
return Integer.$valueOf (x.intValue);
case 10:
case 135266306:
return J.script.SV.selectItemVar (x).value;
default:
return x.value;
}
}, "J.script.SV");
c$.nValue = Clazz.defineMethod (c$, "nValue", 
function (x) {
var iValue;
switch (x == null ? 0 : x.tok) {
case 3:
return x.value;
case 2:
iValue = x.intValue;
break;
case 4:
if ((x.value).indexOf (".") >= 0) return  new Float (J.script.SV.toFloat (x.value));
iValue = Clazz.floatToInt (J.script.SV.toFloat (x.value));
break;
default:
iValue = 0;
}
return Integer.$valueOf (iValue);
}, "J.script.T");
c$.bValue = Clazz.defineMethod (c$, "bValue", 
($fz = function (x) {
switch (x == null ? 0 : x.tok) {
case 1048589:
case 6:
return true;
case 1048588:
return false;
case 2:
return x.intValue != 0;
case 3:
case 4:
case 7:
return J.script.SV.fValue (x) != 0;
case 10:
return J.script.SV.iValue (x) != 0;
case 8:
case 9:
case 11:
case 12:
return Math.abs (J.script.SV.fValue (x)) > 0.0001;
default:
return false;
}
}, $fz.isPrivate = true, $fz), "J.script.T");
c$.iValue = Clazz.defineMethod (c$, "iValue", 
function (x) {
switch (x == null ? 0 : x.tok) {
case 1048589:
return 1;
case 1048588:
return 0;
case 2:
return x.intValue;
case 3:
case 7:
case 4:
case 8:
case 9:
case 11:
case 12:
return Clazz.floatToInt (J.script.SV.fValue (x));
case 10:
return J.util.BSUtil.cardinalityOf (J.script.SV.bsSelectToken (x));
default:
return 0;
}
}, "J.script.T");
c$.fValue = Clazz.defineMethod (c$, "fValue", 
function (x) {
switch (x == null ? 0 : x.tok) {
case 1048589:
return 1;
case 1048588:
return 0;
case 2:
return x.intValue;
case 3:
return (x.value).floatValue ();
case 7:
var i = x.intValue;
if (i == 2147483647) return (x).getList ().size ();
case 4:
return J.script.SV.toFloat (J.script.SV.sValue (x));
case 10:
return J.script.SV.iValue (x);
case 8:
return (x.value).distance (J.script.SV.pt0);
case 9:
return J.util.Measure.distanceToPlane (x.value, J.script.SV.pt0);
case 11:
var pt =  new J.util.P3 ();
(x.value).transform (pt);
return pt.distance (J.script.SV.pt0);
case 12:
var pt1 =  new J.util.P3 ();
(x.value).transform (pt1);
return pt1.distance (J.script.SV.pt0);
default:
return 0;
}
}, "J.script.T");
c$.sValue = Clazz.defineMethod (c$, "sValue", 
function (x) {
if (x == null) return "";
var i;
var sb;
var map;
switch (x.tok) {
case 1048589:
return "true";
case 1048588:
return "false";
case 2:
return "" + x.intValue;
case 10:
return J.util.Escape.eB (J.script.SV.bsSelectToken (x), !(Clazz.instanceOf (x.value, J.modelset.Bond.BondSet)));
case 7:
var sv = (x).getList ();
i = x.intValue;
if (i <= 0) i = sv.size () - i;
if (i != 2147483647) return (i < 1 || i > sv.size () ? "" : J.script.SV.sValue (sv.get (i - 1)));
case 6:
sb =  new J.util.SB ();
map =  new java.util.Hashtable ();
J.script.SV.sValueArray (sb, x, map, 0, false);
return sb.toString ();
case 4:
var s = x.value;
i = x.intValue;
if (i <= 0) i = s.length - i;
if (i == 2147483647) return s;
if (i < 1 || i > s.length) return "";
return "" + s.charAt (i - 1);
case 8:
case 9:
case 11:
case 12:
return J.util.Escape.e (x.value);
default:
return x.value.toString ();
}
}, "J.script.T");
c$.sValueArray = Clazz.defineMethod (c$, "sValueArray", 
($fz = function (sb, vx, map, level, isEscaped) {
switch (vx.tok) {
case 6:
if (map.containsKey (vx)) {
sb.append (isEscaped ? "{}" : vx.myName == null ? "<circular reference>" : "<" + vx.myName + ">");
break;
}map.put (vx, Boolean.TRUE);
var ht = vx.value;
var keys = ht.keySet ().toArray ();
java.util.Arrays.sort (keys);
if (isEscaped) {
sb.append ("{ ");
var sep = "";
for (var i = 0; i < keys.length; i++) {
var key = keys[i];
sb.append (sep).append (J.util.Escape.eS (key)).appendC (':');
J.script.SV.sValueArray (sb, ht.get (key), map, level + 1, true);
sep = ", ";
}
sb.append (" }");
break;
}for (var i = 0; i < keys.length; i++) {
sb.append (keys[i]).append ("\t:");
var v = ht.get (keys[i]);
var sb2 =  new J.util.SB ();
J.script.SV.sValueArray (sb2, v, map, level + 1, isEscaped);
var value = sb2.toString ();
sb.append (value.indexOf ("\n") >= 0 ? "\n" : "\t");
sb.append (value).append ("\n");
}
break;
case 7:
if (map.containsKey (vx)) {
sb.append (isEscaped ? "[]" : vx.myName == null ? "<circular reference>" : "<" + vx.myName + ">");
break;
}map.put (vx, Boolean.TRUE);
if (isEscaped) sb.append ("[");
var sx = vx.getList ();
for (var i = 0; i < sx.size (); i++) {
if (isEscaped && i > 0) sb.append (",");
var sv = sx.get (i);
J.script.SV.sValueArray (sb, sv, map, level + 1, isEscaped);
if (!isEscaped) sb.append ("\n");
}
if (isEscaped) sb.append ("]");
break;
default:
if (!isEscaped) for (var j = 0; j < level - 1; j++) sb.append ("\t");

sb.append (isEscaped ? vx.escape () : J.script.SV.sValue (vx));
}
}, $fz.isPrivate = true, $fz), "J.util.SB,J.script.SV,java.util.Map,~N,~B");
c$.ptValue = Clazz.defineMethod (c$, "ptValue", 
function (x) {
switch (x.tok) {
case 8:
return x.value;
case 4:
var o = J.util.Escape.uP (x.value);
if (Clazz.instanceOf (o, J.util.P3)) return o;
}
return null;
}, "J.script.SV");
c$.pt4Value = Clazz.defineMethod (c$, "pt4Value", 
function (x) {
switch (x.tok) {
case 9:
return x.value;
case 4:
var o = J.util.Escape.uP (x.value);
if (!(Clazz.instanceOf (o, J.util.Point4f))) break;
return o;
}
return null;
}, "J.script.SV");
c$.toFloat = Clazz.defineMethod (c$, "toFloat", 
($fz = function (s) {
if (s.equalsIgnoreCase ("true")) return 1;
if (s.equalsIgnoreCase ("false") || s.length == 0) return 0;
return J.util.Parser.parseFloatStrict (s);
}, $fz.isPrivate = true, $fz), "~S");
c$.concatList = Clazz.defineMethod (c$, "concatList", 
function (x1, x2, asNew) {
var v1 = x1.getList ();
var v2 = x2.getList ();
if (!asNew) {
if (v2 == null) v1.add (J.script.SV.newScriptVariableToken (x2));
 else for (var i = 0; i < v2.size (); i++) v1.add (v2.get (i));

return x1;
}var vlist =  new java.util.ArrayList ((v1 == null ? 1 : v1.size ()) + (v2 == null ? 1 : v2.size ()));
if (v1 == null) vlist.add (x1);
 else for (var i = 0; i < v1.size (); i++) vlist.add (v1.get (i));

if (v2 == null) vlist.add (x2);
 else for (var i = 0; i < v2.size (); i++) vlist.add (v2.get (i));

return J.script.SV.getVariableList (vlist);
}, "J.script.SV,J.script.SV,~B");
c$.bsSelectToken = Clazz.defineMethod (c$, "bsSelectToken", 
function (x) {
x = J.script.SV.selectItemTok (x, -2147483648);
return x.value;
}, "J.script.T");
c$.bsSelectVar = Clazz.defineMethod (c$, "bsSelectVar", 
function ($var) {
if ($var.index == 2147483647) $var = J.script.SV.selectItemVar ($var);
return $var.value;
}, "J.script.SV");
c$.bsSelectRange = Clazz.defineMethod (c$, "bsSelectRange", 
function (x, n) {
x = J.script.SV.selectItemTok (x);
x = J.script.SV.selectItemTok (x, (n <= 0 ? n : 1));
x = J.script.SV.selectItemTok (x, (n <= 0 ? 2147483646 : n));
return x.value;
}, "J.script.T,~N");
c$.selectItemVar = Clazz.defineMethod (c$, "selectItemVar", 
function ($var) {
if ($var.index != 2147483647 || $var.tok == 7 && $var.intValue == 2147483647) return $var;
return J.script.SV.selectItemVar2 ($var, -2147483648);
}, "J.script.SV");
c$.selectItemTok = Clazz.defineMethod (c$, "selectItemTok", 
function ($var) {
return J.script.SV.selectItemTok ($var, -2147483648);
}, "J.script.T");
c$.selectItemVar2 = Clazz.defineMethod (c$, "selectItemVar2", 
function ($var, i2) {
return J.script.SV.selectItemTok ($var, i2);
}, "J.script.SV,~N");
c$.selectItemTok = Clazz.defineMethod (c$, "selectItemTok", 
function (tokenIn, i2) {
switch (tokenIn.tok) {
case 11:
case 12:
case 10:
case 7:
case 4:
break;
default:
return tokenIn;
}
var bs = null;
var s = null;
var i1 = tokenIn.intValue;
if (i1 == 2147483647) {
if (i2 == -2147483648) i2 = i1;
var v = J.script.SV.newScriptVariableIntValue (tokenIn.tok, i2, tokenIn.value);
return v;
}var len = 0;
var isInputSelected = (Clazz.instanceOf (tokenIn, J.script.SV) && (tokenIn).index != 2147483647);
var tokenOut = J.script.SV.newScriptVariableIntValue (tokenIn.tok, 2147483647, null);
switch (tokenIn.tok) {
case 10:
if (Clazz.instanceOf (tokenIn.value, J.modelset.Bond.BondSet)) {
bs =  new J.modelset.Bond.BondSet (tokenIn.value, (tokenIn.value).getAssociatedAtoms ());
len = J.util.BSUtil.cardinalityOf (bs);
} else {
bs = J.util.BSUtil.copy (tokenIn.value);
len = (isInputSelected ? 1 : J.util.BSUtil.cardinalityOf (bs));
}break;
case 7:
len = (tokenIn).getList ().size ();
break;
case 4:
s = tokenIn.value;
len = s.length;
break;
case 11:
len = -3;
break;
case 12:
len = -4;
break;
}
if (len < 0) {
len = -len;
if (i1 > 0 && Math.abs (i1) > len) {
var col = i1 % 10;
var row = Clazz.doubleToInt ((i1 - col) / 10);
if (col > 0 && col <= len && row <= len) {
if (tokenIn.tok == 11) return J.script.SV.newVariable (3,  new Float ((tokenIn.value).getElement (row - 1, col - 1)));
return J.script.SV.newVariable (3,  new Float ((tokenIn.value).getElement (row - 1, col - 1)));
}return J.script.SV.newVariable (4, "");
}if (Math.abs (i1) > len) return J.script.SV.newVariable (4, "");
var data =  Clazz.newFloatArray (len, 0);
if (len == 3) {
if (i1 < 0) (tokenIn.value).getColumn (-1 - i1, data);
 else (tokenIn.value).getRow (i1 - 1, data);
} else {
if (i1 < 0) (tokenIn.value).getColumn (-1 - i1, data);
 else (tokenIn.value).getRow (i1 - 1, data);
}if (i2 == -2147483648) return J.script.SV.getVariableAF (data);
if (i2 < 1 || i2 > len) return J.script.SV.newVariable (4, "");
return J.script.SV.newVariable (3,  new Float (data[i2 - 1]));
}if (i1 <= 0) i1 = len + i1;
if (i1 < 1) i1 = 1;
if (i2 == 0) i2 = len;
 else if (i2 < 0) i2 = len + i2;
if (i2 > len) i2 = len;
 else if (i2 < i1) i2 = i1;
switch (tokenIn.tok) {
case 10:
tokenOut.value = bs;
if (isInputSelected) {
if (i1 > 1) bs.clearAll ();
break;
}var n = 0;
for (var j = bs.nextSetBit (0); j >= 0; j = bs.nextSetBit (j + 1)) if (++n < i1 || n > i2) bs.clear (j);

break;
case 4:
if (i1 < 1 || i1 > len) tokenOut.value = "";
 else tokenOut.value = s.substring (i1 - 1, i2);
break;
case 7:
if (i1 < 1 || i1 > len || i2 > len) return J.script.SV.newVariable (4, "");
if (i2 == i1) return (tokenIn).getList ().get (i1 - 1);
var o2 =  new java.util.ArrayList ();
var o1 = (tokenIn).getList ();
n = i2 - i1 + 1;
for (var i = 0; i < n; i++) o2.add (J.script.SV.newScriptVariableToken (o1.get (i + i1 - 1)));

tokenOut.value = o2;
break;
}
return tokenOut;
}, "J.script.T,~N");
Clazz.defineMethod (c$, "setSelectedValue", 
function (selector, $var) {
if (selector == 2147483647) return false;
var len;
switch (this.tok) {
case 11:
case 12:
len = (this.tok == 11 ? 3 : 4);
if (selector > 10) {
var col = selector % 10;
var row = Clazz.doubleToInt ((selector - col) / 10);
if (col > 0 && col <= len && row <= len) {
if (this.tok == 11) (this.value).setElement (row - 1, col - 1, J.script.SV.fValue ($var));
 else (this.value).setElement (row - 1, col - 1, J.script.SV.fValue ($var));
return true;
}}if (selector != 0 && Math.abs (selector) <= len && $var.tok == 7) {
var sv = $var.getList ();
if (sv.size () == len) {
var data =  Clazz.newFloatArray (len, 0);
for (var i = 0; i < len; i++) data[i] = J.script.SV.fValue (sv.get (i));

if (selector > 0) {
if (this.tok == 11) (this.value).setRowA (selector - 1, data);
 else (this.value).setRow (selector - 1, data);
} else {
if (this.tok == 11) (this.value).setColumnA (-1 - selector, data);
 else (this.value).setColumn (-1 - selector, data);
}return true;
}}return false;
case 4:
var str = this.value;
var pt = str.length;
if (selector <= 0) selector = pt + selector;
if (--selector < 0) selector = 0;
while (selector >= str.length) str += " ";

this.value = str.substring (0, selector) + J.script.SV.sValue ($var) + str.substring (selector + 1);
return true;
case 7:
len = this.getList ().size ();
if (selector <= 0) selector = len + selector;
if (--selector < 0) selector = 0;
if (len <= selector) {
for (var i = len; i <= selector; i++) this.getList ().add (J.script.SV.newVariable (4, ""));

}this.getList ().set (selector, $var);
return true;
}
return false;
}, "~N,J.script.SV");
Clazz.defineMethod (c$, "escape", 
function () {
switch (this.tok) {
case 4:
return J.util.Escape.e (this.value);
case 7:
case 6:
var sb =  new J.util.SB ();
var map =  new java.util.Hashtable ();
J.script.SV.sValueArray (sb, this, map, 0, true);
return sb.toString ();
default:
return J.script.SV.sValue (this);
}
});
c$.unescapePointOrBitsetAsVariable = Clazz.defineMethod (c$, "unescapePointOrBitsetAsVariable", 
function (o) {
if (o == null) return o;
var v = null;
var s = null;
if (Clazz.instanceOf (o, J.script.SV)) {
var sv = o;
switch (sv.tok) {
case 8:
case 9:
case 11:
case 12:
case 10:
v = sv.value;
break;
case 4:
s = sv.value;
break;
default:
s = J.script.SV.sValue (sv);
break;
}
} else if (Clazz.instanceOf (o, String)) {
s = o;
}if (s != null && s.length == 0) return s;
if (v == null) v = J.util.Escape.unescapePointOrBitsetOrMatrixOrArray (s);
if (Clazz.instanceOf (v, J.util.P3)) return (J.script.SV.newVariable (8, v));
if (Clazz.instanceOf (v, J.util.Point4f)) return J.script.SV.newVariable (9, v);
if (Clazz.instanceOf (v, J.util.BS)) {
if (s != null && s.indexOf ("[{") == 0) v =  new J.modelset.Bond.BondSet (v);
return J.script.SV.newVariable (10, v);
}if (Clazz.instanceOf (v, J.util.Matrix3f)) return (J.script.SV.newVariable (11, v));
if (Clazz.instanceOf (v, J.util.Matrix4f)) return J.script.SV.newVariable (12, v);
return o;
}, "~O");
c$.getBoolean = Clazz.defineMethod (c$, "getBoolean", 
function (value) {
return J.script.SV.newScriptVariableToken (value ? J.script.SV.vT : J.script.SV.vF);
}, "~B");
c$.sprintf = Clazz.defineMethod (c$, "sprintf", 
function (strFormat, $var) {
if ($var == null) return strFormat;
var vd = (strFormat.indexOf ("d") >= 0 || strFormat.indexOf ("i") >= 0 ?  Clazz.newIntArray (1, 0) : null);
var vf = (strFormat.indexOf ("f") >= 0 ?  Clazz.newFloatArray (1, 0) : null);
var ve = (strFormat.indexOf ("e") >= 0 ?  Clazz.newDoubleArray (1, 0) : null);
var getS = (strFormat.indexOf ("s") >= 0);
var getP = (strFormat.indexOf ("p") >= 0 && $var.tok == 8);
var getQ = (strFormat.indexOf ("q") >= 0 && $var.tok == 9);
var of = [vd, vf, ve, null, null, null];
if ($var.tok != 7) return J.script.SV.sprintf (strFormat, $var, of, vd, vf, ve, getS, getP, getQ);
var sv = $var.getList ();
var list2 =  new Array (sv.size ());
for (var i = 0; i < list2.length; i++) list2[i] = J.script.SV.sprintf (strFormat, sv.get (i), of, vd, vf, ve, getS, getP, getQ);

return list2;
}, "~S,J.script.SV");
c$.sprintf = Clazz.defineMethod (c$, "sprintf", 
($fz = function (strFormat, $var, of, vd, vf, ve, getS, getP, getQ) {
if (vd != null) vd[0] = J.script.SV.iValue ($var);
if (vf != null) vf[0] = J.script.SV.fValue ($var);
if (ve != null) ve[0] = J.script.SV.fValue ($var);
if (getS) of[3] = J.script.SV.sValue ($var);
if (getP) of[4] = $var.value;
if (getQ) of[5] = $var.value;
return J.util.TextFormat.sprintf (strFormat, "IFDspq", of);
}, $fz.isPrivate = true, $fz), "~S,J.script.SV,~A,~A,~A,~A,~B,~B,~B");
c$.sprintfArray = Clazz.defineMethod (c$, "sprintfArray", 
function (args) {
switch (args.length) {
case 0:
return "";
case 1:
return J.script.SV.sValue (args[0]);
}
var format = J.util.TextFormat.split (J.util.TextFormat.simpleReplace (J.script.SV.sValue (args[0]), "%%", "\1"), '%');
var sb =  new J.util.SB ();
sb.append (format[0]);
for (var i = 1; i < format.length; i++) {
var ret = J.script.SV.sprintf (J.util.TextFormat.formatCheck ("%" + format[i]), (i < args.length ? args[i] : null));
if (J.util.Escape.isAS (ret)) {
var list = ret;
for (var j = 0; j < list.length; j++) sb.append (list[j]).append ("\n");

continue;
}sb.append (ret);
}
return sb.toString ();
}, "~A");
Clazz.defineMethod (c$, "toString", 
function () {
return Clazz.superCall (this, J.script.SV, "toString", []) + "[" + this.myName + " index =" + this.index + " intValue=" + this.intValue + "]";
});
c$.getBitSet = Clazz.defineMethod (c$, "getBitSet", 
function (x, allowNull) {
switch (x.tok) {
case 10:
return J.script.SV.bsSelectVar (x);
case 7:
var bs =  new J.util.BS ();
var sv = x.value;
for (var i = 0; i < sv.size (); i++) if (!sv.get (i).unEscapeBitSetArray (bs) && allowNull) return null;

return bs;
}
return (allowNull ? null :  new J.util.BS ());
}, "J.script.SV,~B");
c$.areEqual = Clazz.defineMethod (c$, "areEqual", 
function (x1, x2) {
if (x1 == null || x2 == null) return false;
if (x1.tok == 4 && x2.tok == 4) return J.script.SV.sValue (x1).equalsIgnoreCase (J.script.SV.sValue (x2));
if (x1.tok == 8 && x2.tok == 8) return ((x1.value).distance (x2.value) < 0.000001);
if (x1.tok == 9 && x2.tok == 9) return ((x1.value).distance (x2.value) < 0.000001);
return (Math.abs (J.script.SV.fValue (x1) - J.script.SV.fValue (x2)) < 0.000001);
}, "J.script.SV,J.script.SV");
Clazz.defineMethod (c$, "sortOrReverse", 
function (arrayPt) {
var x = this.getList ();
if (x == null || x.size () < 2) return this;
if (arrayPt == -2147483648) {
var n = x.size ();
for (var i = 0; i < n; i++) {
var v = x.get (i);
x.set (i, x.get (--n));
x.set (n, v);
}
} else {
java.util.Collections.sort (this.getList (), Clazz.innerTypeInstance (J.script.SV.Sort, this, null, --arrayPt));
}return this;
}, "~N");
Clazz.defineMethod (c$, "unEscapeBitSetArray", 
function (bs) {
switch (this.tok) {
case 4:
var bs1 = J.util.Escape.uB (this.value);
if (bs1 == null) return false;
bs.or (bs1);
return true;
case 10:
bs.or (this.value);
return true;
}
return false;
}, "J.util.BS");
c$.unEscapeBitSetArray = Clazz.defineMethod (c$, "unEscapeBitSetArray", 
function (x, allowNull) {
var bs =  new J.util.BS ();
for (var i = 0; i < x.size (); i++) if (!x.get (i).unEscapeBitSetArray (bs) && allowNull) return null;

return bs;
}, "java.util.ArrayList,~B");
c$.listValue = Clazz.defineMethod (c$, "listValue", 
function (x) {
if (x.tok != 7) return [J.script.SV.sValue (x)];
var sv = (x).getList ();
var list =  new Array (sv.size ());
for (var i = sv.size (); --i >= 0; ) list[i] = J.script.SV.sValue (sv.get (i));

return list;
}, "J.script.T");
c$.flistValue = Clazz.defineMethod (c$, "flistValue", 
function (x, nMin) {
if (x.tok != 7) return [J.script.SV.fValue (x)];
var sv = (x).getList ();
var list;
list =  Clazz.newFloatArray (Math.max (nMin, sv.size ()), 0);
if (nMin == 0) nMin = list.length;
for (var i = Math.min (sv.size (), nMin); --i >= 0; ) list[i] = J.script.SV.fValue (sv.get (i));

return list;
}, "J.script.T,~N");
Clazz.defineMethod (c$, "toArray", 
function () {
var dim;
var m3 = null;
var m4 = null;
switch (this.tok) {
case 11:
m3 = this.value;
dim = 3;
break;
case 12:
m4 = this.value;
dim = 4;
break;
default:
return;
}
this.tok = 7;
var o2 =  new java.util.ArrayList (dim);
for (var i = 0; i < dim; i++) {
var a =  Clazz.newFloatArray (dim, 0);
if (m3 == null) m4.getRow (i, a);
 else m3.getRow (i, a);
o2.set (i, J.script.SV.getVariableAF (a));
}
this.value = o2;
});
Clazz.defineMethod (c$, "mapValue", 
function (key) {
return (this.tok == 6 ? (this.value).get (key) : null);
}, "~S");
Clazz.defineMethod (c$, "getList", 
function () {
return (this.tok == 7 ? this.value : null);
});
c$.$SV$Sort$ = function () {
Clazz.pu$h ();
c$ = Clazz.decorateAsClass (function () {
Clazz.prepareCallback (this, arguments);
this.arrayPt = 0;
Clazz.instantialize (this, arguments);
}, J.script.SV, "Sort", null, java.util.Comparator);
Clazz.makeConstructor (c$, 
function (a) {
this.arrayPt = a;
}, "~N");
Clazz.overrideMethod (c$, "compare", 
function (a, b) {
if (a.tok != b.tok) {
if (a.tok == 3 || a.tok == 2 || b.tok == 3 || b.tok == 2) {
var c = J.script.SV.fValue (a);
var d = J.script.SV.fValue (b);
return (c < d ? -1 : c > d ? 1 : 0);
}if (a.tok == 4 || b.tok == 4) return J.script.SV.sValue (a).compareTo (J.script.SV.sValue (b));
}switch (a.tok) {
case 4:
return J.script.SV.sValue (a).compareTo (J.script.SV.sValue (b));
case 7:
var c = a.getList ();
var d = b.getList ();
if (c.size () != d.size ()) return (c.size () < d.size () ? -1 : 1);
var e = this.arrayPt;
if (e < 0) e += c.size ();
if (e < 0 || e >= c.size ()) return 0;
return this.compare (c.get (e), d.get (e));
default:
var f = J.script.SV.fValue (a);
var g = J.script.SV.fValue (b);
return (f < g ? -1 : f > g ? 1 : 0);
}
}, "J.script.SV,J.script.SV");
c$ = Clazz.p0p ();
};
c$.vT = c$.prototype.vT = J.script.SV.newScriptVariableIntValue (1048589, 1, "true");
c$.vF = c$.prototype.vF = J.script.SV.newScriptVariableIntValue (1048588, 0, "false");
Clazz.defineStatics (c$,
"FLAG_CANINCREMENT", 1,
"FLAG_LOCALVAR", 2);
c$.pt0 = c$.prototype.pt0 =  new J.util.P3 ();
});
