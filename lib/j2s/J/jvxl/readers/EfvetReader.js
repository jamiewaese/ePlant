Clazz.declarePackage ("J.jvxl.readers");
Clazz.load (["J.jvxl.readers.PolygonFileReader"], "J.jvxl.readers.EfvetReader", ["J.jvxl.data.JvxlCoder", "J.util.Logger", "$.P3"], function () {
c$ = Clazz.declareType (J.jvxl.readers, "EfvetReader", J.jvxl.readers.PolygonFileReader);
Clazz.makeConstructor (c$, 
function () {
Clazz.superConstructor (this, J.jvxl.readers.EfvetReader, []);
});
Clazz.defineMethod (c$, "init2", 
function (sg, br) {
Clazz.superCall (this, J.jvxl.readers.EfvetReader, "init2", [sg, br]);
this.jvxlFileHeaderBuffer.append ("efvet file format\nvertices and triangles only\n");
J.jvxl.data.JvxlCoder.jvxlCreateHeaderWithoutTitleOrAtoms (this.volumeData, this.jvxlFileHeaderBuffer);
this.hasColorData = true;
}, "J.jvxl.readers.SurfaceGenerator,java.io.BufferedReader");
Clazz.overrideMethod (c$, "getSurfaceData", 
function () {
this.getHeader ();
this.getVertices ();
this.getTriangles ();
J.util.Logger.info ("efvet file contains " + this.nVertices + " vertices and " + this.nTriangles + " triangles");
});
Clazz.defineMethod (c$, "getHeader", 
($fz = function () {
this.skipTo ("<efvet", null);
while (this.readLine ().length > 0 && this.line.indexOf (">") < 0) this.jvxlFileHeaderBuffer.append ("# " + this.line + "\n");

J.util.Logger.info (this.jvxlFileHeaderBuffer.toString ());
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getVertices", 
($fz = function () {
var pt =  new J.util.P3 ();
var value = 0;
this.skipTo ("<vertices", "count");
this.jvxlData.vertexCount = this.nVertices = this.parseInt ();
this.skipTo ("property=", null);
this.line = this.line.$replace ('"', ' ');
var tokens = this.getTokens ();
var dataIndex = this.params.fileIndex;
if (dataIndex > 0 && dataIndex < tokens.length) J.util.Logger.info ("property " + tokens[dataIndex]);
 else J.util.Logger.info (this.line);
for (var i = 0; i < this.nVertices; i++) {
this.skipTo ("<vertex", "image");
pt.set (this.parseFloat (), this.parseFloat (), this.parseFloat ());
this.skipTo (null, "property");
for (var j = 0; j < dataIndex; j++) value = this.parseFloat ();

if (this.isAnisotropic) this.setVertexAnisotropy (pt);
this.addVertexCopy (pt, value, i);
}
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getTriangles", 
($fz = function () {
this.skipTo ("<triangle_array", "count");
this.nTriangles = this.parseInt ();
for (var i = 0; i < this.nTriangles; i++) {
this.skipTo ("<triangle", "vertex");
this.addTriangleCheck (this.parseInt () - 1, this.parseInt () - 1, this.parseInt () - 1, 7, 0, false, 0);
}
}, $fz.isPrivate = true, $fz));
});
