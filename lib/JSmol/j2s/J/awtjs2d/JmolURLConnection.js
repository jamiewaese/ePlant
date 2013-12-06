Clazz.declarePackage ("J.awtjs2d");
Clazz.load (["java.net.URLConnection"], "J.awtjs2d.JmolURLConnection", null, function () {
c$ = Clazz.decorateAsClass (function () {
this.bytesOut = null;
this.postOut = "";
Clazz.instantialize (this, arguments);
}, J.awtjs2d, "JmolURLConnection", java.net.URLConnection);
Clazz.defineMethod (c$, "doAjax", 
($fz = function () {
{
return Jmol._doAjax(this.url, this.postOut, this.bytesOut);
}}, $fz.isPrivate = true, $fz));
Clazz.overrideMethod (c$, "connect", 
function () {
});
Clazz.defineMethod (c$, "outputBytes", 
function (bytes) {
this.bytesOut = bytes;
}, "~A");
Clazz.defineMethod (c$, "outputString", 
function (post) {
this.postOut = post;
}, "~S");
Clazz.defineMethod (c$, "getStringXBuilder", 
function () {
return this.doAjax ();
});
});
