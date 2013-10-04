Clazz.declarePackage ("J.script");
Clazz.load (["J.script.T"], "J.script.ContextToken", ["java.util.Hashtable", "J.script.SV"], function () {
c$ = Clazz.decorateAsClass (function () {
this.contextVariables = null;
this.name0 = null;
Clazz.instantialize (this, arguments);
}, J.script, "ContextToken", J.script.T);
Clazz.makeConstructor (c$, 
function (tok, intValue, value) {
Clazz.superConstructor (this, J.script.ContextToken, [tok]);
this.intValue = intValue;
this.value = value;
}, "~N,~N,~O");
Clazz.makeConstructor (c$, 
function (tok, value) {
Clazz.superConstructor (this, J.script.ContextToken, [tok]);
this.value = value;
if (tok == 102410) this.addName ("_var");
}, "~N,~O");
Clazz.defineMethod (c$, "addName", 
function (name) {
if (this.contextVariables == null) this.contextVariables =  new java.util.Hashtable ();
this.contextVariables.put (name, J.script.SV.newVariable (4, "").setName (name));
}, "~S");
});
