Clazz.declarePackage ("J.viewer.binding");
Clazz.load (["J.viewer.binding.JmolBinding"], "J.viewer.binding.RasmolBinding", null, function () {
c$ = Clazz.declareType (J.viewer.binding, "RasmolBinding", J.viewer.binding.JmolBinding);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.viewer.binding.RasmolBinding, ["selectOrToggle"]);
this.setSelectBindings ();
});
Clazz.defineMethod (c$, "setSelectBindings", 
($fz = function () {
var $private = Clazz.checkPrivateMethod (arguments);
if ($private != null) {
return $private.apply (this, arguments);
}
this.bind (272, 16);
this.bind (273, 18);
}, $fz.isPrivate = true, $fz));
});
