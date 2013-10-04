Clazz.declarePackage ("J.jvxl.readers");
Clazz.load (["J.jvxl.readers.AtomDataReader"], "J.jvxl.readers.IsoPlaneReader", null, function () {
c$ = Clazz.declareType (J.jvxl.readers, "IsoPlaneReader", J.jvxl.readers.AtomDataReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.jvxl.readers.IsoPlaneReader, []);
});
Clazz.defineMethod (c$, "init", 
function (sg) {
Clazz.superCall (this, J.jvxl.readers.IsoPlaneReader, "init", [sg]);
this.precalculateVoxelData = false;
}, "J.jvxl.readers.SurfaceGenerator");
Clazz.defineMethod (c$, "setup", 
function (isMapData) {
Clazz.superCall (this, J.jvxl.readers.IsoPlaneReader, "setup", [isMapData]);
this.setHeader ("PLANE", this.params.thePlane.toString ());
this.params.cutoff = 0;
this.setVolumeForPlane ();
}, "~B");
});
