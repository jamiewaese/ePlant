Clazz.declarePackage ("J.viewer.binding");
Clazz.load (["J.viewer.binding.JmolBinding"], "J.viewer.binding.PfaatBinding", null, function () {
c$ = Clazz.declareType (J.viewer.binding, "PfaatBinding", J.viewer.binding.JmolBinding);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.viewer.binding.PfaatBinding, ["extendedSelect"]);
this.setSelectBindings ();
});
Clazz.defineMethod (c$, "setSelectBindings", 
($fz = function () {
var $private = Clazz.checkPrivateMethod (arguments);
if ($private != null) {
return $private.apply (this, arguments);
}
this.bind (272, 16);
this.bind (272, 17);
this.bind (273, 18);
this.bind (281, 19);
this.bind (280, 20);
}, $fz.isPrivate = true, $fz));
});
