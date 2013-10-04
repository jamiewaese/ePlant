Clazz.declarePackage ("J.io");
Clazz.load (null, "J.io.XmlUtil", ["J.util.TextFormat"], function () {
c$ = Clazz.declareType (J.io, "XmlUtil");
c$.openDocument = Clazz.defineMethod (c$, "openDocument", 
function (data) {
data.append ("<?xml version=\"1.0\"?>\n");
}, "J.util.SB");
c$.openTag = Clazz.defineMethod (c$, "openTag", 
function (sb, name) {
sb.append ("<").append (name).append (">\n");
}, "J.util.SB,~S");
c$.openTagAttr = Clazz.defineMethod (c$, "openTagAttr", 
function (sb, name, attributes) {
J.io.XmlUtil.appendTagAll (sb, name, attributes, null, false, false);
sb.append ("\n");
}, "J.util.SB,~S,~A");
c$.closeTag = Clazz.defineMethod (c$, "closeTag", 
function (sb, name) {
sb.append ("</").append (name).append (">\n");
}, "J.util.SB,~S");
c$.appendTagAll = Clazz.defineMethod (c$, "appendTagAll", 
function (sb, name, attributes, data, isCdata, doClose) {
var closer = ">";
if (name.endsWith ("/")) {
name = name.substring (0, name.length - 1);
if (data == null) {
closer = "/>\n";
doClose = false;
}}sb.append ("<").append (name);
if (attributes != null) for (var i = 0; i < attributes.length; i++) {
var o = attributes[i];
if (o == null) continue;
if (Clazz.instanceOf (o, Array)) for (var j = 0; j < (o).length; j += 2) J.io.XmlUtil.appendAttrib (sb, (o)[j], (o)[j + 1]);

 else J.io.XmlUtil.appendAttrib (sb, o, attributes[++i]);
}
sb.append (closer);
if (data != null) {
if (isCdata) data = J.io.XmlUtil.wrapCdata (data);
sb.appendO (data);
}if (doClose) J.io.XmlUtil.closeTag (sb, name);
}, "J.util.SB,~S,~A,~O,~B,~B");
c$.wrapCdata = Clazz.defineMethod (c$, "wrapCdata", 
function (data) {
var s = "" + data;
return (s.indexOf ("&") < 0 && s.indexOf ("<") < 0 ? (s.startsWith ("\n") ? "" : "\n") + s : "<![CDATA[" + J.util.TextFormat.simpleReplace (s, "]]>", "]]]]><![CDATA[>") + "]]>");
}, "~O");
c$.unwrapCdata = Clazz.defineMethod (c$, "unwrapCdata", 
function (s) {
return (s.startsWith ("<![CDATA[") && s.endsWith ("]]>") ? s.substring (9, s.length - 3).$replace ("]]]]><![CDATA[>", "]]>") : s);
}, "~S");
c$.appendTagObj = Clazz.defineMethod (c$, "appendTagObj", 
function (sb, name, attributes, data) {
J.io.XmlUtil.appendTagAll (sb, name, attributes, data, false, true);
}, "J.util.SB,~S,~A,~O");
c$.appendTag = Clazz.defineMethod (c$, "appendTag", 
function (sb, name, data) {
if (Clazz.instanceOf (data, Array)) J.io.XmlUtil.appendTagAll (sb, name, data, null, false, true);
 else J.io.XmlUtil.appendTagAll (sb, name, null, data, false, true);
}, "J.util.SB,~S,~O");
c$.appendCdata = Clazz.defineMethod (c$, "appendCdata", 
function (sb, name, attributes, data) {
J.io.XmlUtil.appendTagAll (sb, name, attributes, data, true, true);
}, "J.util.SB,~S,~A,~S");
c$.appendAttrib = Clazz.defineMethod (c$, "appendAttrib", 
function (sb, name, value) {
if (value == null) return;
sb.append (" ").appendO (name).append ("=\"").appendO (value).append ("\"");
}, "J.util.SB,~O,~O");
});
