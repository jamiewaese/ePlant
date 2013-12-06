Clazz.declarePackage ("J.shape");
Clazz.load (["J.shape.FontLineShape"], "J.shape.Uccage", null, function () {
c$ = Clazz.declareType (J.shape, "Uccage", J.shape.FontLineShape);
Clazz.defineMethod (c$, "getShapeState", 
function () {
return (this.modelSet.haveUnitCells ? Clazz.superCall (this, J.shape.Uccage, "getShapeState", []) : "");
});
Clazz.defineMethod (c$, "initShape", 
function () {
Clazz.superCall (this, J.shape.Uccage, "initShape", []);
this.font3d = this.gdata.getFont3D (14);
this.myType = "unitcell";
});
});
