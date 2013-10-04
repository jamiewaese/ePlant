Clazz.declarePackage ("J.i18n");
Clazz.load (null, "J.i18n.Language", ["J.i18n.GT"], function () {
c$ = Clazz.decorateAsClass (function () {
this.code = null;
this.language = null;
this.nativeLanguage = null;
this.display = false;
Clazz.instantialize (this, arguments);
}, J.i18n, "Language");
c$.getLanguageList = Clazz.defineMethod (c$, "getLanguageList", 
function () {
return [ new J.i18n.Language ("ar", J.i18n.GT._ ("Arabic"), "Ø§ÙØ¹Ø±Ø¨ÙØ©", false),  new J.i18n.Language ("ast", J.i18n.GT._ ("Asturian"), "Asturian", false),  new J.i18n.Language ("az", J.i18n.GT._ ("Azerbaijani"), "azÉrbaycan dili", false),  new J.i18n.Language ("bs", J.i18n.GT._ ("Bosnian"), "bosanski jezik", false),  new J.i18n.Language ("ca", J.i18n.GT._ ("Catalan"), "CatalÃ ", true),  new J.i18n.Language ("cs", J.i18n.GT._ ("Czech"), "ÄeÅ¡tina", true),  new J.i18n.Language ("da", J.i18n.GT._ ("Danish"), "Dansk", true),  new J.i18n.Language ("de", J.i18n.GT._ ("German"), "Deutsch", true),  new J.i18n.Language ("el", J.i18n.GT._ ("Greek"), "ÎÎ»Î»Î·Î½Î¹ÎºÎ¬", false),  new J.i18n.Language ("en_AU", J.i18n.GT._ ("Australian English"), "Australian English", false),  new J.i18n.Language ("en_GB", J.i18n.GT._ ("British English"), "British English", true),  new J.i18n.Language ("en_US", J.i18n.GT._ ("American English"), "American English", true),  new J.i18n.Language ("es", J.i18n.GT._ ("Spanish"), "EspaÃ±ol", true),  new J.i18n.Language ("et", J.i18n.GT._ ("Estonian"), "Eesti", false),  new J.i18n.Language ("eu", J.i18n.GT._ ("Basque"), "Euskara", true),  new J.i18n.Language ("fi", J.i18n.GT._ ("Finnish"), "Suomi", true),  new J.i18n.Language ("fo", J.i18n.GT._ ("Faroese"), "FÃ¸royskt", false),  new J.i18n.Language ("fr", J.i18n.GT._ ("French"), "FranÃ§ais", true),  new J.i18n.Language ("fy", J.i18n.GT._ ("Frisian"), "Frysk", false),  new J.i18n.Language ("gl", J.i18n.GT._ ("Galician"), "Galego", false),  new J.i18n.Language ("hr", J.i18n.GT._ ("Croatian"), "Hrvatski", false),  new J.i18n.Language ("hu", J.i18n.GT._ ("Hungarian"), "Magyar", true),  new J.i18n.Language ("hy", J.i18n.GT._ ("Armenian"), "ÕÕ¡ÕµÕ¥ÖÕ¥Õ¶", false),  new J.i18n.Language ("id", J.i18n.GT._ ("Indonesian"), "Indonesia", true),  new J.i18n.Language ("it", J.i18n.GT._ ("Italian"), "Italiano", true),  new J.i18n.Language ("ja", J.i18n.GT._ ("Japanese"), "æ¥æ¬èª", true),  new J.i18n.Language ("jv", J.i18n.GT._ ("Javanese"), "Basa Jawa", false),  new J.i18n.Language ("ko", J.i18n.GT._ ("Korean"), "íêµ­ì´", true),  new J.i18n.Language ("ms", J.i18n.GT._ ("Malay"), "Bahasa Melayu", true),  new J.i18n.Language ("nb", J.i18n.GT._ ("Norwegian Bokmal"), "Norsk BokmÃ¥l", false),  new J.i18n.Language ("nl", J.i18n.GT._ ("Dutch"), "Nederlands", true),  new J.i18n.Language ("oc", J.i18n.GT._ ("Occitan"), "Occitan", false),  new J.i18n.Language ("pl", J.i18n.GT._ ("Polish"), "Polski", false),  new J.i18n.Language ("pt", J.i18n.GT._ ("Portuguese"), "PortuguÃªs", false),  new J.i18n.Language ("pt_BR", J.i18n.GT._ ("Brazilian Portuguese"), "PortuguÃªs brasileiro", true),  new J.i18n.Language ("ru", J.i18n.GT._ ("Russian"), "Ð ÑÑÑÐºÐ¸Ð¹", false),  new J.i18n.Language ("sl", J.i18n.GT._ ("Slovenian"), "SlovenÅ¡Äina", false),  new J.i18n.Language ("sr", J.i18n.GT._ ("Serbian"), "ÑÑÐ¿ÑÐºÐ¸ ÑÐµÐ·Ð¸Ðº", false),  new J.i18n.Language ("sv", J.i18n.GT._ ("Swedish"), "Svenska", true),  new J.i18n.Language ("ta", J.i18n.GT._ ("Tamil"), "à®¤à®®à®¿à®´à¯", false),  new J.i18n.Language ("te", J.i18n.GT._ ("Telugu"), "à°¤à±à°²à±à°à±", false),  new J.i18n.Language ("tr", J.i18n.GT._ ("Turkish"), "TÃ¼rkÃ§e", true),  new J.i18n.Language ("ug", J.i18n.GT._ ("Uyghur"), "UyÆ£urqÉ", false),  new J.i18n.Language ("uk", J.i18n.GT._ ("Ukrainian"), "Ð£ÐºÑÐ°ÑÐ½ÑÑÐºÐ°", true),  new J.i18n.Language ("uz", J.i18n.GT._ ("Uzbek"), "O'zbek", false),  new J.i18n.Language ("zh_CN", J.i18n.GT._ ("Simplified Chinese"), "ç®ä½ä¸­æ", true),  new J.i18n.Language ("zh_TW", J.i18n.GT._ ("Traditional Chinese"), "ç¹é«ä¸­æ", true)];
});
Clazz.makeConstructor (c$, 
($fz = function (code, language, nativeLanguage, display) {
this.code = code;
this.language = language;
this.nativeLanguage = nativeLanguage;
this.display = display;
}, $fz.isPrivate = true, $fz), "~S,~S,~S,~B");
c$.getSupported = Clazz.defineMethod (c$, "getSupported", 
function (list, code) {
for (var i = list.length; --i >= 0; ) if (list[i].code.equalsIgnoreCase (code)) return list[i].code;

for (var i = list.length; --i >= 0; ) if (list[i].code.startsWith (code)) return list[i].code;

return null;
}, "~A,~S");
});
