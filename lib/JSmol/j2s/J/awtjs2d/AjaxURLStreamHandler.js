Clazz.declarePackage ("J.awtjs2d");
Clazz.load (["java.net.URLStreamHandler"], "J.awtjs2d.AjaxURLStreamHandler", ["J.awtjs2d.JmolURLConnection"], function () {
c$ = Clazz.decorateAsClass (function () {
this.protocol = null;
Clazz.instantialize (this, arguments);
}, J.awtjs2d, "AjaxURLStreamHandler", java.net.URLStreamHandler);
Clazz.makeConstructor (c$, 
function (protocol) {
Clazz.superConstructor (this, J.awtjs2d.AjaxURLStreamHandler, []);
this.protocol = protocol;
}, "~S");
Clazz.overrideMethod (c$, "openConnection", 
function (url) {
return  new J.awtjs2d.JmolURLConnection (url);
}, "java.net.URL");
});
