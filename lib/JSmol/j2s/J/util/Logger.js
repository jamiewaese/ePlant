Clazz.declarePackage ("J.util");
Clazz.load (["java.util.Hashtable", "J.util.DefaultLogger"], "J.util.Logger", ["java.lang.Long", "$.Runtime"], function () {
c$ = Clazz.declareType (J.util, "Logger");
c$.getProperty = Clazz.defineMethod (c$, "getProperty", 
($fz = function (level, defaultValue) {
try {
var property = System.getProperty ("jmol.logger." + level, null);
if (property != null) {
return (property.equalsIgnoreCase ("true"));
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
return defaultValue;
}, $fz.isPrivate = true, $fz), "~S,~B");
c$.setLogger = Clazz.defineMethod (c$, "setLogger", 
function (logger) {
($t$ = J.util.Logger._logger = logger, J.util.Logger.prototype._logger = J.util.Logger._logger, $t$);
($t$ = J.util.Logger.debugging = J.util.Logger.isActiveLevel (5) || J.util.Logger.isActiveLevel (6), J.util.Logger.prototype.debugging = J.util.Logger.debugging, $t$);
}, "J.util.LoggerInterface");
c$.isActiveLevel = Clazz.defineMethod (c$, "isActiveLevel", 
function (level) {
return J.util.Logger._logger != null && level >= 0 && level < 7 && J.util.Logger._activeLevels[level];
}, "~N");
c$.setActiveLevel = Clazz.defineMethod (c$, "setActiveLevel", 
function (level, active) {
if (level < 0) level = 0;
if (level >= 7) level = 6;
J.util.Logger._activeLevels[level] = active;
($t$ = J.util.Logger.debugging = J.util.Logger.isActiveLevel (5) || J.util.Logger.isActiveLevel (6), J.util.Logger.prototype.debugging = J.util.Logger.debugging, $t$);
}, "~N,~B");
c$.setLogLevel = Clazz.defineMethod (c$, "setLogLevel", 
function (level) {
for (var i = 7; --i >= 0; ) J.util.Logger.setActiveLevel (i, i <= level);

}, "~N");
c$.getLevel = Clazz.defineMethod (c$, "getLevel", 
function (level) {
switch (level) {
case 6:
return "DEBUGHIGH";
case 5:
return "DEBUG";
case 4:
return "INFO";
case 3:
return "WARN";
case 2:
return "ERROR";
case 1:
return "FATAL";
}
return "????";
}, "~N");
c$.logLevel = Clazz.defineMethod (c$, "logLevel", 
function () {
return J.util.Logger._logLevel;
});
c$.doLogLevel = Clazz.defineMethod (c$, "doLogLevel", 
function (log) {
($t$ = J.util.Logger._logLevel = log, J.util.Logger.prototype._logLevel = J.util.Logger._logLevel, $t$);
}, "~B");
c$.debug = Clazz.defineMethod (c$, "debug", 
function (txt) {
if (!J.util.Logger.debugging) return;
try {
J.util.Logger._logger.debug (txt);
} catch (t) {
}
}, "~S");
c$.info = Clazz.defineMethod (c$, "info", 
function (txt) {
try {
if (J.util.Logger.isActiveLevel (4)) {
J.util.Logger._logger.info (txt);
}} catch (t) {
}
}, "~S");
c$.warn = Clazz.defineMethod (c$, "warn", 
function (txt) {
try {
if (J.util.Logger.isActiveLevel (3)) {
J.util.Logger._logger.warn (txt);
}} catch (t) {
}
}, "~S");
c$.warnEx = Clazz.defineMethod (c$, "warnEx", 
function (txt, e) {
try {
if (J.util.Logger.isActiveLevel (3)) {
J.util.Logger._logger.warnEx (txt, e);
}} catch (t) {
}
}, "~S,Throwable");
c$.error = Clazz.defineMethod (c$, "error", 
function (txt) {
try {
if (J.util.Logger.isActiveLevel (2)) {
J.util.Logger._logger.error (txt);
}} catch (t) {
}
}, "~S");
c$.errorEx = Clazz.defineMethod (c$, "errorEx", 
function (txt, e) {
try {
if (J.util.Logger.isActiveLevel (2)) {
J.util.Logger._logger.errorEx (txt, e);
}} catch (t) {
}
}, "~S,Throwable");
c$.getLogLevel = Clazz.defineMethod (c$, "getLogLevel", 
function () {
for (var i = 7; --i >= 0; ) if (J.util.Logger.isActiveLevel (i)) return i;

return 0;
});
c$.fatal = Clazz.defineMethod (c$, "fatal", 
function (txt) {
try {
if (J.util.Logger.isActiveLevel (1)) {
J.util.Logger._logger.fatal (txt);
}} catch (t) {
}
}, "~S");
c$.fatalEx = Clazz.defineMethod (c$, "fatalEx", 
function (txt, e) {
try {
if (J.util.Logger.isActiveLevel (1)) {
J.util.Logger._logger.fatalEx (txt, e);
}} catch (t) {
}
}, "~S,Throwable");
c$.startTimer = Clazz.defineMethod (c$, "startTimer", 
function (msg) {
if (msg == null) return;
J.util.Logger.htTiming.put (msg, Long.$valueOf (System.currentTimeMillis ()));
}, "~S");
c$.checkTimer = Clazz.defineMethod (c$, "checkTimer", 
function (msg, andReset) {
if (msg == null) return -1;
var t = J.util.Logger.htTiming.get (msg);
if (t == null) return -1;
var time = System.currentTimeMillis () - t.longValue ();
if (!msg.startsWith ("(")) J.util.Logger.info ("Time for " + msg + ": " + (time) + " ms");
if (andReset) J.util.Logger.startTimer (msg);
return time;
}, "~S,~B");
c$.checkMemory = Clazz.defineMethod (c$, "checkMemory", 
function () {
var bTotal = 0;
var bFree = 0;
var bMax = 0;
try {
var runtime = Runtime.getRuntime ();
runtime.gc ();
bTotal = runtime.totalMemory ();
bFree = runtime.freeMemory ();
bMax = runtime.maxMemory ();
} catch (e) {
}
J.util.Logger.info ("Memory: Total-Free=" + (bTotal - bFree) + "; Total=" + bTotal + "; Free=" + bFree + "; Max=" + bMax);
});
c$._logger = c$.prototype._logger =  new J.util.DefaultLogger ();
Clazz.defineStatics (c$,
"LEVEL_FATAL", 1,
"LEVEL_ERROR", 2,
"LEVEL_WARN", 3,
"LEVEL_INFO", 4,
"LEVEL_DEBUG", 5,
"LEVEL_DEBUGHIGH", 6,
"LEVEL_MAX", 7,
"_activeLevels",  Clazz.newBooleanArray (7, false),
"_logLevel", false,
"debugging", false,
"debuggingHigh", false);
{
J.util.Logger._activeLevels[6] = J.util.Logger.getProperty ("debugHigh", false);
J.util.Logger._activeLevels[5] = J.util.Logger.getProperty ("debug", false);
J.util.Logger._activeLevels[4] = J.util.Logger.getProperty ("info", true);
J.util.Logger._activeLevels[3] = J.util.Logger.getProperty ("warn", true);
J.util.Logger._activeLevels[2] = J.util.Logger.getProperty ("error", true);
J.util.Logger._activeLevels[1] = J.util.Logger.getProperty ("fatal", true);
($t$ = J.util.Logger._logLevel = J.util.Logger.getProperty ("logLevel", false), J.util.Logger.prototype._logLevel = J.util.Logger._logLevel, $t$);
($t$ = J.util.Logger.debugging = (J.util.Logger._logger != null && (J.util.Logger._activeLevels[5] || J.util.Logger._activeLevels[6])), J.util.Logger.prototype.debugging = J.util.Logger.debugging, $t$);
($t$ = J.util.Logger.debuggingHigh = (J.util.Logger.debugging && J.util.Logger._activeLevels[6]), J.util.Logger.prototype.debuggingHigh = J.util.Logger.debuggingHigh, $t$);
}c$.htTiming = c$.prototype.htTiming =  new java.util.Hashtable ();
});
