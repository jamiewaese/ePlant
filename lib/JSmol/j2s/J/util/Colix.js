Clazz.declarePackage ("J.util");
Clazz.load (["J.util.ArrayUtil", "$.Int2IntHash"], "J.util.Colix", ["java.lang.Float", "$.IndexOutOfBoundsException", "J.constant.EnumPalette", "J.util.ColorUtil", "$.Escape", "$.Logger", "$.Parser", "$.Shader", "$.StringXBuilder"], function () {
c$ = Clazz.declareType (J.util, "Colix");
Clazz.makeConstructor (c$, 
function () {
});
c$.getColix = Clazz.defineMethod (c$, "getColix", 
function (argb) {
if (argb == 0) return 0;
var translucentFlag = 0;
if ((argb & 0xFF000000) != (-16777216)) {
argb |= 0xFF000000;
translucentFlag = 8192;
}var c = J.util.Colix.colixHash.get (argb);
if ((c & 3) == 3) translucentFlag = 0;
return (c > 0 ? (c | translucentFlag) : (J.util.Colix.allocateColix (argb) | translucentFlag));
}, "~N");
c$.allocateColix = Clazz.defineMethod (c$, "allocateColix", 
function (argb) {
if ((argb & 0xFF000000) != (-16777216)) throw  new IndexOutOfBoundsException ();
for (var i = J.util.Colix.colixMax; --i >= 4; ) if (argb == J.util.Colix.argbs[i]) return i;

if (J.util.Colix.colixMax == J.util.Colix.argbs.length) {
var oldSize = J.util.Colix.colixMax;
var newSize = oldSize * 2;
if (newSize > 2048) newSize = 2048;
($t$ = J.util.Colix.argbs = J.util.ArrayUtil.arrayCopyI (J.util.Colix.argbs, newSize), J.util.Colix.prototype.argbs = J.util.Colix.argbs, $t$);
if (J.util.Colix.argbsGreyscale != null) ($t$ = J.util.Colix.argbsGreyscale = J.util.ArrayUtil.arrayCopyI (J.util.Colix.argbsGreyscale, newSize), J.util.Colix.prototype.argbsGreyscale = J.util.Colix.argbsGreyscale, $t$);
($t$ = J.util.Colix.ashades = J.util.ArrayUtil.arrayCopyII (J.util.Colix.ashades, newSize), J.util.Colix.prototype.ashades = J.util.Colix.ashades, $t$);
if (J.util.Colix.ashadesGreyscale != null) ($t$ = J.util.Colix.ashadesGreyscale = J.util.ArrayUtil.arrayCopyII (J.util.Colix.ashadesGreyscale, newSize), J.util.Colix.prototype.ashadesGreyscale = J.util.Colix.ashadesGreyscale, $t$);
}J.util.Colix.argbs[J.util.Colix.colixMax] = argb;
if (J.util.Colix.argbsGreyscale != null) J.util.Colix.argbsGreyscale[J.util.Colix.colixMax] = J.util.ColorUtil.calcGreyscaleRgbFromRgb (argb);
J.util.Colix.colixHash.put (argb, J.util.Colix.colixMax);
return (J.util.Colix.colixMax < 2047 ? ($t$ = J.util.Colix.colixMax ++, J.util.Colix.prototype.colixMax = J.util.Colix.colixMax, $t$) : J.util.Colix.colixMax);
}, "~N");
c$.calcArgbsGreyscale = Clazz.defineMethod (c$, "calcArgbsGreyscale", 
($fz = function () {
if (J.util.Colix.argbsGreyscale != null) return;
var a =  Clazz.newIntArray (J.util.Colix.argbs.length, 0);
for (var i = J.util.Colix.argbs.length; --i >= 4; ) a[i] = J.util.ColorUtil.calcGreyscaleRgbFromRgb (J.util.Colix.argbs[i]);

($t$ = J.util.Colix.argbsGreyscale = a, J.util.Colix.prototype.argbsGreyscale = J.util.Colix.argbsGreyscale, $t$);
}, $fz.isPrivate = true, $fz));
c$.getArgbGreyscale = Clazz.defineMethod (c$, "getArgbGreyscale", 
function (colix) {
if (J.util.Colix.argbsGreyscale == null) J.util.Colix.calcArgbsGreyscale ();
return J.util.Colix.argbsGreyscale[colix & -30721];
}, "~N");
c$.getShadesArgb = Clazz.defineMethod (c$, "getShadesArgb", 
function (argb, asGrey) {
if (asGrey) {
if (J.util.Colix.argbsGreyscale == null) J.util.Colix.calcArgbsGreyscale ();
J.util.Colix.argbsGreyscale[2047] = J.util.ColorUtil.calcGreyscaleRgbFromRgb (argb);
}return J.util.Colix.ashades[2047] = J.util.Shader.getShades ([argb, false]);
}, "~N,~B");
c$.getShades = Clazz.defineMethod (c$, "getShades", 
function (colix) {
colix &= -30721;
var shades = J.util.Colix.ashades[colix];
if (shades == null) shades = J.util.Colix.ashades[colix] = J.util.Shader.getShades ([J.util.Colix.argbs[colix], false]);
return shades;
}, "~N");
c$.getShadesGreyscale = Clazz.defineMethod (c$, "getShadesGreyscale", 
function (colix) {
colix &= -30721;
if (J.util.Colix.ashadesGreyscale == null) ($t$ = J.util.Colix.ashadesGreyscale = J.util.ArrayUtil.newInt2 (J.util.Colix.ashades.length), J.util.Colix.prototype.ashadesGreyscale = J.util.Colix.ashadesGreyscale, $t$);
var shadesGreyscale = J.util.Colix.ashadesGreyscale[colix];
if (shadesGreyscale == null) shadesGreyscale = J.util.Colix.ashadesGreyscale[colix] = J.util.Shader.getShades ([J.util.Colix.argbs[colix], true]);
return shadesGreyscale;
}, "~N");
c$.flushShades = Clazz.defineMethod (c$, "flushShades", 
function () {
for (var i = J.util.Colix.colixMax; --i >= 0; ) J.util.Colix.ashades[i] = null;

J.util.Shader.sphereShadingCalculated = false;
});
c$.getColixO = Clazz.defineMethod (c$, "getColixO", 
function (obj) {
if (obj == null) return 0;
if (Clazz.instanceOf (obj, J.constant.EnumPalette)) return ((obj) === J.constant.EnumPalette.NONE ? 0 : 2);
if (Clazz.instanceOf (obj, Integer)) return J.util.Colix.getColix ((obj).intValue ());
if (Clazz.instanceOf (obj, String)) return J.util.Colix.getColixS (obj);
if (Clazz.instanceOf (obj, Byte)) return ((obj).byteValue () == 0 ? 0 : 2);
if (J.util.Logger.debugging) {
J.util.Logger.debug ("?? getColix(" + obj + ")");
}return 22;
}, "~O");
c$.applyColorTranslucencyLevel = Clazz.defineMethod (c$, "applyColorTranslucencyLevel", 
function (colix, translucentLevel) {
if (translucentLevel == 0) return (colix & -30721);
if (translucentLevel < 0) return (colix & -30721 | 30720);
if (Float.isNaN (translucentLevel) || translucentLevel >= 255 || translucentLevel == 1.0) return ((colix & -30721) | 16384);
var iLevel = Clazz.doubleToInt (Math.floor (translucentLevel < 1 ? translucentLevel * 256 : translucentLevel <= 9 ? (Clazz.doubleToInt (Math.floor (translucentLevel - 1))) << 5 : translucentLevel < 15 ? 256 : translucentLevel));
iLevel = (iLevel >> 5) % 16;
return (colix & -30721 | (iLevel << 11));
}, "~N,~N");
c$.isColixLastAvailable = Clazz.defineMethod (c$, "isColixLastAvailable", 
function (colix) {
return (colix > 0 && (colix & 2047) == 2047);
}, "~N");
c$.getArgb = Clazz.defineMethod (c$, "getArgb", 
function (colix) {
return J.util.Colix.argbs[colix & -30721];
}, "~N");
c$.isColixColorInherited = Clazz.defineMethod (c$, "isColixColorInherited", 
function (colix) {
switch (colix) {
case 0:
case 1:
return true;
default:
return (colix & -30721) == 1;
}
}, "~N");
c$.getColixInherited = Clazz.defineMethod (c$, "getColixInherited", 
function (myColix, parentColix) {
switch (myColix) {
case 0:
return parentColix;
case 1:
return (parentColix & -30721);
default:
return ((myColix & -30721) == 1 ? (parentColix & -30721 | myColix & 30720) : myColix);
}
}, "~N,~N");
c$.isColixTranslucent = Clazz.defineMethod (c$, "isColixTranslucent", 
function (colix) {
return ((colix & 30720) != 0);
}, "~N");
c$.getChangeableColixIndex = Clazz.defineMethod (c$, "getChangeableColixIndex", 
function (colix) {
return (colix >= 0 ? -1 : (colix & 2047));
}, "~N");
c$.getColixTranslucent3 = Clazz.defineMethod (c$, "getColixTranslucent3", 
function (colix, isTranslucent, translucentLevel) {
if (colix == 0) colix = 1;
colix &= -30721;
return (isTranslucent ? J.util.Colix.applyColorTranslucencyLevel (colix, translucentLevel) : colix);
}, "~N,~B,~N");
c$.copyColixTranslucency = Clazz.defineMethod (c$, "copyColixTranslucency", 
function (colixFrom, colixTo) {
return J.util.Colix.getColixTranslucent3 (colixTo, J.util.Colix.isColixTranslucent (colixFrom), J.util.Colix.getColixTranslucencyLevel (colixFrom));
}, "~N,~N");
c$.getColixTranslucencyFractional = Clazz.defineMethod (c$, "getColixTranslucencyFractional", 
function (colix) {
var translevel = J.util.Colix.getColixTranslucencyLevel (colix);
return (translevel == -1 ? 0.5 : translevel == 0 ? 0 : translevel == 255 ? 1 : translevel / 256);
}, "~N");
c$.getColixTranslucencyLevel = Clazz.defineMethod (c$, "getColixTranslucencyLevel", 
function (colix) {
var logAlpha = (colix >> 11) & 0xF;
switch (logAlpha) {
case 0:
return 0;
case 1:
case 2:
case 3:
case 4:
case 5:
case 6:
case 7:
return logAlpha << 5;
case 15:
return -1;
default:
return 255;
}
}, "~N");
c$.getColixS = Clazz.defineMethod (c$, "getColixS", 
function (colorName) {
var argb = J.util.ColorUtil.getArgbFromString (colorName);
if (argb != 0) return J.util.Colix.getColix (argb);
if ("none".equalsIgnoreCase (colorName)) return 0;
if ("opaque".equalsIgnoreCase (colorName)) return 1;
return 2;
}, "~S");
c$.getColixArray = Clazz.defineMethod (c$, "getColixArray", 
function (colorNames) {
if (colorNames == null || colorNames.length == 0) return null;
var colors = J.util.Parser.getTokens (colorNames);
var colixes =  Clazz.newShortArray (colors.length, 0);
for (var j = 0; j < colors.length; j++) {
colixes[j] = J.util.Colix.getColix (J.util.ColorUtil.getArgbFromString (colors[j]));
if (colixes[j] == 0) return null;
}
return colixes;
}, "~S");
c$.getHexCode = Clazz.defineMethod (c$, "getHexCode", 
function (colix) {
return J.util.Escape.escapeColor (J.util.Colix.getArgb (colix));
}, "~N");
c$.getHexCodes = Clazz.defineMethod (c$, "getHexCodes", 
function (colixes) {
if (colixes == null) return null;
var s =  new J.util.StringXBuilder ();
for (var i = 0; i < colixes.length; i++) s.append (i == 0 ? "" : " ").append (J.util.Colix.getHexCode (colixes[i]));

return s.toString ();
}, "~A");
c$.getColixTranslucent = Clazz.defineMethod (c$, "getColixTranslucent", 
function (argb) {
var a = (argb >> 24) & 0xFF;
if (a == 0xFF) return J.util.Colix.getColix (argb);
return J.util.Colix.getColixTranslucent3 (J.util.Colix.getColix (argb), true, a / 255);
}, "~N");
Clazz.defineStatics (c$,
"INHERIT_ALL", 0,
"INHERIT_COLOR", 1,
"USE_PALETTE", 2,
"RAW_RGB", 3,
"SPECIAL_COLIX_MAX", 4,
"colixMax", 4,
"argbs",  Clazz.newIntArray (128, 0),
"argbsGreyscale", null);
c$.ashades = c$.prototype.ashades = J.util.ArrayUtil.newInt2 (128);
Clazz.defineStatics (c$,
"ashadesGreyscale", null);
c$.colixHash = c$.prototype.colixHash =  new J.util.Int2IntHash (256);
Clazz.defineStatics (c$,
"RAW_RGB_INT", 3,
"UNMASK_CHANGEABLE_TRANSLUCENT", 0x07FF,
"CHANGEABLE_MASK", 0x8000,
"LAST_AVAILABLE_COLIX", 2047,
"TRANSLUCENT_SHIFT", 11,
"ALPHA_SHIFT", 13,
"TRANSLUCENT_MASK", 30720,
"TRANSLUCENT_SCREENED", 30720,
"TRANSPARENT", 16384,
"TRANSLUCENT_50", 8192,
"OPAQUE_MASK", -30721,
"BLACK", 4,
"ORANGE", 5,
"PINK", 6,
"BLUE", 7,
"WHITE", 8,
"CYAN", 9,
"RED", 10,
"GREEN", 11,
"GRAY", 12,
"SILVER", 13,
"LIME", 14,
"MAROON", 15,
"NAVY", 16,
"OLIVE", 17,
"PURPLE", 18,
"TEAL", 19,
"MAGENTA", 20,
"YELLOW", 21,
"HOTPINK", 22,
"GOLD", 23,
"predefinedArgbs", [0xFF000000, 0xFFFFA500, 0xFFFFC0CB, 0xFF0000FF, 0xFFFFFFFF, 0xFF00FFFF, 0xFFFF0000, 0xFF008000, 0xFF808080, 0xFFC0C0C0, 0xFF00FF00, 0xFF800000, 0xFF000080, 0xFF808000, 0xFF800080, 0xFF008080, 0xFFFF00FF, 0xFFFFFF00, 0xFFFF69B4, 0xFFFFD700]);
{
for (var i = 0; i < J.util.Colix.predefinedArgbs.length; ++i) J.util.Colix.getColix (J.util.Colix.predefinedArgbs[i]);

}});
