Clazz.declarePackage ("J.script");
Clazz.load (["J.script.SV"], "J.script.ScriptVariableInt", null, function () {
c$ = Clazz.declareType (J.script, "ScriptVariableInt", J.script.SV);
Clazz.makeConstructor (c$, 
function (intValue) {
Clazz.superConstructor (this, J.script.ScriptVariableInt, [2]);
this.intValue = intValue;
}, "~N");
});
