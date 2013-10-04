Clazz.declarePackage ("J.i18n");
Clazz.load (null, "J.i18n.GT", ["java.text.MessageFormat"], function () {
c$ = Clazz.decorateAsClass (function () {
this.doTranslate = true;
Clazz.instantialize (this, arguments);
}, J.i18n, "GT");
Clazz.makeConstructor (c$, 
function (la) {
}, "~S");
c$.getLanguage = Clazz.defineMethod (c$, "getLanguage", 
function () {
return "en_US";
});
c$.getTextWrapper = Clazz.defineMethod (c$, "getTextWrapper", 
($fz = function () {
return (J.i18n.GT.$getTextWrapper == null ? ($t$ = J.i18n.GT.$getTextWrapper =  new J.i18n.GT (null), J.i18n.GT.prototype.$getTextWrapper = J.i18n.GT.$getTextWrapper, $t$) : J.i18n.GT.$getTextWrapper);
}, $fz.isPrivate = true, $fz));
c$.getLanguageList = Clazz.defineMethod (c$, "getLanguageList", 
function (gt) {
if (J.i18n.GT.languageList == null) {
if (gt == null) gt = J.i18n.GT.getTextWrapper ();
gt.createLanguageList ();
}return J.i18n.GT.languageList;
}, "J.i18n.GT");
Clazz.defineMethod (c$, "createLanguageList", 
($fz = function () {
var wasTranslating = this.doTranslate;
this.doTranslate = false;
($t$ = J.i18n.GT.languageList = [], J.i18n.GT.prototype.languageList = J.i18n.GT.languageList, $t$);
this.doTranslate = wasTranslating;
}, $fz.isPrivate = true, $fz));
c$.ignoreApplicationBundle = Clazz.defineMethod (c$, "ignoreApplicationBundle", 
function () {
});
c$.setDoTranslate = Clazz.defineMethod (c$, "setDoTranslate", 
function (TF) {
return false;
}, "~B");
c$.getDoTranslate = Clazz.defineMethod (c$, "getDoTranslate", 
function () {
return false;
});
c$._ = Clazz.defineMethod (c$, "_", 
function (string) {
return string;
}, "~S");
c$._ = Clazz.defineMethod (c$, "_", 
function (string, item) {
return J.i18n.GT.getString (string, [item]);
}, "~S,~S");
c$._ = Clazz.defineMethod (c$, "_", 
function (string, item) {
return J.i18n.GT.getString (string, [Integer.$valueOf (item)]);
}, "~S,~N");
c$._ = Clazz.defineMethod (c$, "_", 
function (string, objects) {
return J.i18n.GT.getString (string, objects);
}, "~S,~A");
c$._ = Clazz.defineMethod (c$, "_", 
function (string, t) {
return string;
}, "~S,~B");
c$._ = Clazz.defineMethod (c$, "_", 
function (string, item, t) {
return J.i18n.GT.getString (string, [item]);
}, "~S,~S,~B");
c$._ = Clazz.defineMethod (c$, "_", 
function (string, item, t) {
return J.i18n.GT.getString (string, [Integer.$valueOf (item)]);
}, "~S,~N,~B");
c$._ = Clazz.defineMethod (c$, "_", 
function (string, objects, t) {
return (objects == null ? string : J.i18n.GT.getString (string, objects));
}, "~S,~A,~B");
c$.getString = Clazz.defineMethod (c$, "getString", 
($fz = function (string, objects) {
return java.text.MessageFormat.format (string, objects);
}, $fz.isPrivate = true, $fz), "~S,~A");
Clazz.defineStatics (c$,
"$getTextWrapper", null,
"languageList", null);
});
