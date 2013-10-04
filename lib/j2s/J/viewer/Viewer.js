Clazz.declarePackage ("J.viewer");
Clazz.load (["java.lang.Enum", "J.api.JmolViewer", "J.atomdata.AtomDataServer", "java.util.ArrayList", "$.Hashtable", "J.atomdata.RadiusData", "J.i18n.GT", "J.util.CommandHistory", "$.Dimension"], "J.viewer.Viewer", ["java.io.BufferedReader", "$.File", "$.StringReader", "java.lang.Boolean", "$.Character", "$.Double", "$.Float", "$.Runtime", "J.adapter.smarter.SmarterJmolAdapter", "J.api.Interface", "J.constant.EnumAxesMode", "$.EnumFileStatus", "$.EnumStereoMode", "$.EnumVdw", "J.io.CifDataReader", "$.JmolBinary", "J.modelset.Group", "J.script.SV", "$.ScriptVariableInt", "$.T", "J.thread.ScriptDelayThread", "$.TimeoutThread", "J.util.ArrayUtil", "$.BS", "$.BSUtil", "$.C", "$.ColorUtil", "$.Elements", "$.Escape", "$.GData", "$.JmolMolecule", "$.Logger", "$.Measure", "$.P3", "$.P3i", "$.Parser", "$.SB", "$.TempArray", "$.TextFormat", "$.V3", "J.viewer.ActionManager", "$.AnimationManager", "$.ColorManager", "$.DataManager", "$.FileManager", "$.JC", "$.ModelManager", "$.SelectionManager", "$.ShapeManager", "$.StateManager", "$.StatusManager", "$.TransformManager", "J.viewer.binding.Binding"], function () {
c$ = Clazz.decorateAsClass (function () {
this.autoExit = false;
this.haveDisplay = false;
this.isJS = false;
this.isJS2D = false;
this.isJS3D = false;
this.isSingleThreaded = false;
this.queueOnHold = false;
this.fullName = "";
this.appletDocumentBase = "";
this.appletCodeBase = "";
this.compiler = null;
this.definedAtomSets = null;
this.modelSet = null;
this.fileManager = null;
this.$isApplet = false;
this.isSyntaxAndFileCheck = false;
this.isSyntaxCheck = false;
this.listCommands = false;
this.mustRender = false;
this.htmlName = "";
this.insertedCommand = "";
this.gdata = null;
this.applet = null;
this.actionManager = null;
this.animationManager = null;
this.colorManager = null;
this.dataManager = null;
this.shapeManager = null;
this.selectionManager = null;
this.repaintManager = null;
this.global = null;
this.statusManager = null;
this.transformManager = null;
this.syncId = "";
this.logFilePath = "";
this.allowScripting = false;
this.isPrintOnly = false;
this.$isSignedApplet = false;
this.isSignedAppletLocal = false;
this.isSilent = false;
this.multiTouch = false;
this.$noGraphicsAllowed = false;
this.useCommandThread = false;
this.commandOptions = null;
this.viewerOptions = null;
this.display = null;
this.modelAdapter = null;
this.access = null;
this.commandHistory = null;
this.symmetry = null;
this.smilesMatcher = null;
this.modelManager = null;
this.stateManager = null;
this.scriptManager = null;
this.eval = null;
this.tempArray = null;
this.$isPreviewOnly = false;
this.mouse = null;
this.mouseEnabled = true;
this.noneSelected = false;
this.ligandModels = null;
this.ligandModelSet = null;
this.sc = null;
this.bsFrameOffsets = null;
this.frameOffsets = null;
this.wasInMotion = false;
this.motionEventNumber = 0;
this.refreshing = true;
this.axesAreTainted = false;
this.dimScreen = null;
this.maximumSize = 2147483647;
this.imageFontScaling = 1;
this.antialiasDisplay = false;
this.hoverAtomIndex = -1;
this.hoverText = null;
this.hoverEnabled = true;
this.currentCursor = 0;
this.prevFrame = -2147483648;
this.haveJDX = false;
this.jsv = null;
this.language = null;
this.rd = null;
this.frankOn = true;
this.scriptEditorVisible = false;
this.appConsole = null;
this.scriptEditor = null;
this.jmolpopup = null;
this.modelkitPopup = null;
this.headlessImage = null;
this.pm = null;
this.isTainted = true;
this.movingSelected = false;
this.showSelected = false;
this.rotateBondIndex = -1;
this.rotatePrev1 = -1;
this.rotatePrev2 = -1;
this.bsRotateBranch = null;
this.creatingImage = false;
this.errorMessage = null;
this.errorMessageUntranslated = null;
this.currentShapeID = -1;
this.currentShapeState = null;
this.localFunctions = null;
this.privateKey = 0;
this.logFile = null;
this.$isKiosk = false;
this.minimizer = null;
this.executor = null;
this.displayLoadErrors = true;
this.$isParallel = false;
this.actionStates = null;
this.actionStatesRedo = null;
this.stateScriptVersionInt = 0;
this.jsExporter3D = null;
this.htPdbBondInfo = null;
this.timeouts = null;
this.scriptDelayThread = null;
Clazz.instantialize (this, arguments);
}, J.viewer, "Viewer", J.api.JmolViewer, J.atomdata.AtomDataServer);
Clazz.prepareFields (c$, function () {
this.commandHistory =  new J.util.CommandHistory ();
this.dimScreen =  new J.util.Dimension ();
this.language = J.i18n.GT.getLanguage ();
this.rd =  new J.atomdata.RadiusData (null, 0, null, null);
this.localFunctions =  new java.util.Hashtable ();
this.privateKey = Math.random ();
this.actionStates =  new java.util.ArrayList ();
this.actionStatesRedo =  new java.util.ArrayList ();
});
Clazz.defineMethod (c$, "finalize", 
function () {
J.util.Logger.debug ("viewer finalize " + this);
Clazz.superCall (this, J.viewer.Viewer, "finalize", []);
});
c$.allocateViewer = Clazz.defineMethod (c$, "allocateViewer", 
function (display, modelAdapter, fullName, documentBase, codeBase, commandOptions, statusListener, implementedPlatform) {
var info =  new java.util.Hashtable ();
info.put ("display", display);
info.put ("adapter", modelAdapter);
info.put ("statusListener", statusListener);
info.put ("platform", implementedPlatform);
info.put ("options", commandOptions);
info.put ("fullName", fullName);
info.put ("documentBase", documentBase);
info.put ("codeBase", codeBase);
return  new J.viewer.Viewer (info);
}, "~O,J.api.JmolAdapter,~S,java.net.URL,java.net.URL,~S,J.api.JmolStatusListener,J.api.ApiPlatform");
Clazz.makeConstructor (c$, 
function (info) {
Clazz.superConstructor (this, J.viewer.Viewer, []);
this.setOptions (info);
}, "java.util.Map");
Clazz.defineMethod (c$, "getGlobalSettings", 
function () {
return this.global;
});
Clazz.defineMethod (c$, "getStatusManager", 
function () {
return this.statusManager;
});
Clazz.overrideMethod (c$, "isApplet", 
function () {
return this.$isApplet;
});
Clazz.defineMethod (c$, "isRestricted", 
function (a) {
return this.access === a;
}, "J.viewer.Viewer.ACCESS");
Clazz.overrideMethod (c$, "getModelAdapter", 
function () {
if (this.modelAdapter == null) this.modelAdapter =  new J.adapter.smarter.SmarterJmolAdapter ();
return this.modelAdapter;
});
Clazz.defineMethod (c$, "getSymmetry", 
function () {
if (this.symmetry == null) this.symmetry = J.api.Interface.getOptionInterface ("symmetry.Symmetry");
return this.symmetry;
});
Clazz.defineMethod (c$, "getSymmetryInfo", 
function (bsAtoms, xyz, op, pt, pt2, id, type) {
return this.getPropertyManager ().getSymmetryInfo (bsAtoms, xyz, op, pt, pt2, id, type);
}, "J.util.BS,~S,~N,J.util.P3,J.util.P3,~S,~N");
Clazz.defineMethod (c$, "getSmilesMatcher", 
function () {
if (this.smilesMatcher == null) {
this.smilesMatcher = J.api.Interface.getOptionInterface ("smiles.SmilesMatcher");
}return this.smilesMatcher;
});
Clazz.overrideMethod (c$, "getSmartsMatch", 
function (smarts, bsSelected) {
if (bsSelected == null) bsSelected = this.getSelectionSet (false);
return this.getSmilesMatcher ().getSubstructureSet (smarts, this.modelSet.atoms, this.getAtomCount (), bsSelected, true, false);
}, "~S,J.util.BS");
Clazz.defineMethod (c$, "getViewerOptions", 
function () {
return this.viewerOptions;
});
Clazz.defineMethod (c$, "setOptions", 
($fz = function (info) {
this.viewerOptions = info;
if (J.util.Logger.debugging) {
J.util.Logger.debug ("Viewer constructor " + this);
}this.modelAdapter = info.get ("adapter");
var statusListener = info.get ("statusListener");
this.fullName = info.get ("fullName");
if (this.fullName == null) this.fullName = "";
var o = info.get ("codeBase");
this.appletCodeBase = (o == null ? "" : o.toString ());
o = info.get ("documentBase");
this.appletDocumentBase = (o == null ? "" : o.toString ());
o = info.get ("options");
this.commandOptions = (o == null ? "" : o.toString ());
if (info.containsKey ("debug") || this.commandOptions.indexOf ("-debug") >= 0) J.util.Logger.setLogLevel (5);
this.$isSignedApplet = this.checkOption ("signedApplet", "-signed");
this.$isApplet = this.$isSignedApplet || this.checkOption ("applet", "-applet");
this.allowScripting = !this.checkOption ("noscripting", "-noscripting");
var i = this.fullName.indexOf ("__");
this.htmlName = (i < 0 ? this.fullName : this.fullName.substring (0, i));
this.syncId = (i < 0 ? "" : this.fullName.substring (i + 2, this.fullName.length - 2));
if (this.$isApplet) {
{
if(typeof Jmol != "undefined") this.applet =
Jmol._applets[this.htmlName.split("_object")[0]];
}if (info.containsKey ("maximumSize")) this.setMaximumSize ((info.get ("maximumSize")).intValue ());
}this.access = (this.checkOption ("access:READSPT", "-r") ? J.viewer.Viewer.ACCESS.READSPT : this.checkOption ("access:NONE", "-R") ? J.viewer.Viewer.ACCESS.NONE : J.viewer.Viewer.ACCESS.ALL);
this.$isPreviewOnly = info.containsKey ("previewOnly");
if (this.$isPreviewOnly) info.remove ("previewOnly");
this.isPrintOnly = this.checkOption ("printOnly", "-p");
o = info.get ("platform");
var platform = "unknown";
if (o == null) {
o = (this.commandOptions.contains ("platform=") ? this.commandOptions.substring (this.commandOptions.indexOf ("platform=") + 9) : "J.awt.Platform");
}if (Clazz.instanceOf (o, String)) {
platform = o;
this.isJS3D = (platform.indexOf (".awtjs.") >= 0);
this.isJS2D = (platform.indexOf ("2d") >= 0);
this.isJS = (this.isJS2D || this.isJS3D);
o = J.api.Interface.getInterface (platform);
}this.apiPlatform = o;
this.display = info.get ("display");
this.isSingleThreaded = this.apiPlatform.isSingleThreaded ();
this.$noGraphicsAllowed = (this.display == null && this.checkOption ("noGraphics", "-n"));
this.haveDisplay = (!this.$noGraphicsAllowed && !this.isHeadless () && !this.checkOption ("isDataOnly", "\0"));
if (this.haveDisplay) {
this.mustRender = true;
this.multiTouch = this.checkOption ("multiTouch", "-multitouch");
{
if (this.isJS2D) this.display =
document.getElementById(this.display);
}} else {
this.display = null;
}this.apiPlatform.setViewer (this, this.display);
o = info.get ("graphicsAdapter");
if (o == null && !this.isJS3D) o = J.api.Interface.getInterface ("J.g3d.Graphics3D");
this.gdata = (o == null ?  new J.util.GData () : o);
this.gdata.initialize (this.apiPlatform);
this.stateManager =  new J.viewer.StateManager (this);
this.colorManager =  new J.viewer.ColorManager (this, this.gdata);
this.statusManager =  new J.viewer.StatusManager (this);
this.transformManager =  new J.viewer.TransformManager (this, 2147483647, 0);
this.selectionManager =  new J.viewer.SelectionManager (this);
if (this.haveDisplay) {
this.actionManager = (this.multiTouch ? J.api.Interface.getOptionInterface ("multitouch.ActionManagerMT") :  new J.viewer.ActionManager ());
this.actionManager.setViewer (this, this.commandOptions + "-multitouch-" + info.get ("multiTouch"));
this.mouse = this.apiPlatform.getMouseManager (this, this.actionManager);
if (this.multiTouch && !this.checkOption ("-simulated", "-simulated")) this.apiPlatform.setTransparentCursor (this.display);
}this.modelManager =  new J.viewer.ModelManager (this);
this.shapeManager =  new J.viewer.ShapeManager (this);
this.tempArray =  new J.util.TempArray ();
this.dataManager =  new J.viewer.DataManager (this);
this.animationManager =  new J.viewer.AnimationManager (this);
o = info.get ("repaintManager");
if (o == null) o = (J.api.Interface.getOptionInterface ("render.RepaintManager"));
if (o != null && !o.equals ("")) (this.repaintManager = o).set (this, this.shapeManager);
this.initialize (true);
this.fileManager =  new J.viewer.FileManager (this);
this.definedAtomSets =  new java.util.Hashtable ();
this.setJmolStatusListener (statusListener);
if (this.$isApplet) {
J.util.Logger.info ("viewerOptions: \n" + J.util.Escape.escapeMap (this.viewerOptions));
($t$ = J.viewer.Viewer.jsDocumentBase = this.appletDocumentBase, J.viewer.Viewer.prototype.jsDocumentBase = J.viewer.Viewer.jsDocumentBase, $t$);
i = J.viewer.Viewer.jsDocumentBase.indexOf ("#");
if (i >= 0) ($t$ = J.viewer.Viewer.jsDocumentBase = J.viewer.Viewer.jsDocumentBase.substring (0, i), J.viewer.Viewer.prototype.jsDocumentBase = J.viewer.Viewer.jsDocumentBase, $t$);
i = J.viewer.Viewer.jsDocumentBase.lastIndexOf ("?");
if (i >= 0) ($t$ = J.viewer.Viewer.jsDocumentBase = J.viewer.Viewer.jsDocumentBase.substring (0, i), J.viewer.Viewer.prototype.jsDocumentBase = J.viewer.Viewer.jsDocumentBase, $t$);
i = J.viewer.Viewer.jsDocumentBase.lastIndexOf ("/");
if (i >= 0) ($t$ = J.viewer.Viewer.jsDocumentBase = J.viewer.Viewer.jsDocumentBase.substring (0, i), J.viewer.Viewer.prototype.jsDocumentBase = J.viewer.Viewer.jsDocumentBase, $t$);
this.fileManager.setAppletContext (this.appletDocumentBase);
var appletProxy = info.get ("appletProxy");
if (appletProxy != null) this.setStringProperty ("appletProxy", appletProxy);
if (this.$isSignedApplet) {
this.logFilePath = J.util.TextFormat.simpleReplace (this.appletCodeBase, "file://", "");
this.logFilePath = J.util.TextFormat.simpleReplace (this.logFilePath, "file:/", "");
if (this.logFilePath.indexOf ("//") >= 0) this.logFilePath = null;
 else this.isSignedAppletLocal = true;
} else {
this.logFilePath = null;
}} else {
this.gdata.setBackgroundTransparent (this.checkOption ("backgroundTransparent", "-b"));
this.isSilent = this.checkOption ("silent", "-i");
if (this.isSilent) J.util.Logger.setLogLevel (3);
this.isSyntaxAndFileCheck = this.checkOption ("checkLoad", "-C");
this.isSyntaxCheck = this.isSyntaxAndFileCheck || this.checkOption ("check", "-c");
this.listCommands = this.checkOption ("listCommands", "-l");
this.autoExit = this.checkOption ("exit", "-x");
this.cd (".");
if (this.isHeadless ()) {
this.headlessImage = info.get ("headlessImage");
o = info.get ("headlistMaxTimeMs");
if (o == null) o = Integer.$valueOf (60000);
this.setTimeout ("" + Math.random (), (o).intValue (), "exitJmol");
}}this.useCommandThread = !this.isHeadless () && this.checkOption ("useCommandThread", "-threaded");
this.setStartupBooleans ();
this.setIntProperty ("_nProcessors", J.viewer.Viewer.nProcessors);
o = info.get ("menuFile");
if (o != null) this.getProperty ("DATA_API", "setMenu", this.getFileAsString (o));
if (!this.isSilent) {
J.util.Logger.info ("(C) 2012 Jmol Development" + "\nJmol Version: " + J.viewer.Viewer.getJmolVersion () + "\njava.vendor: " + J.viewer.Viewer.strJavaVendor + "\njava.version: " + J.viewer.Viewer.strJavaVersion + "\nos.name: " + J.viewer.Viewer.strOSName + "\nAccess: " + this.access + "\nmemory: " + this.getParameter ("_memory") + "\nprocessors available: " + J.viewer.Viewer.nProcessors + "\nuseCommandThread: " + this.useCommandThread + (!this.$isApplet ? "" : "\nappletId:" + this.htmlName + (this.$isSignedApplet ? " (signed)" : "")));
}this.zap (false, true, false);
this.global.setS ("language", J.i18n.GT.getLanguage ());
this.stateManager.setJmolDefaults ();
}, $fz.isPrivate = true, $fz), "java.util.Map");
Clazz.defineMethod (c$, "getScriptManager", 
($fz = function () {
if (this.allowScripting && this.scriptManager == null) {
this.scriptManager = J.api.Interface.getOptionInterface ("viewer.ScriptManager");
this.scriptManager.setViewer (this);
this.eval = this.scriptManager.getEval ();
if (this.useCommandThread) this.scriptManager.startCommandWatcher (true);
}return this.scriptManager;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "checkOption", 
($fz = function (key1, key2) {
return (this.viewerOptions.containsKey (key1) || this.commandOptions.indexOf (key2) >= 0);
}, $fz.isPrivate = true, $fz), "~S,~S");
Clazz.defineMethod (c$, "isPreviewOnly", 
function () {
return this.$isPreviewOnly;
});
Clazz.defineMethod (c$, "isHeadless", 
function () {
return this.apiPlatform.isHeadless ();
});
Clazz.defineMethod (c$, "setStartupBooleans", 
($fz = function () {
this.setBooleanProperty ("_applet", this.$isApplet);
this.setBooleanProperty ("_jspecview", false);
this.setBooleanProperty ("_signedApplet", this.$isSignedApplet);
this.setBooleanProperty ("_headless", this.apiPlatform.isHeadless ());
this.setStringProperty ("_restrict", "\"" + this.access + "\"");
this.setBooleanProperty ("_useCommandThread", this.useCommandThread);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "noGraphicsAllowed", 
function () {
return this.$noGraphicsAllowed;
});
c$.getJmolVersion = Clazz.overrideMethod (c$, "getJmolVersion", 
function () {
return J.viewer.JC.version + "  " + J.viewer.JC.date;
});
Clazz.defineMethod (c$, "getExportDriverList", 
function () {
return (this.isRestricted (J.viewer.Viewer.ACCESS.ALL) ? this.global.getParameter ("exportDrivers") : "");
});
Clazz.defineMethod (c$, "getHtmlName", 
function () {
return this.htmlName;
});
Clazz.overrideMethod (c$, "getDisplay", 
function () {
return this.display;
});
Clazz.defineMethod (c$, "clearMouse", 
function () {
this.mouse.clear ();
});
Clazz.defineMethod (c$, "disposeMouse", 
function () {
this.mouse.dispose ();
this.mouse = null;
});
Clazz.overrideMethod (c$, "handleOldJvm10Event", 
function (id, x, y, modifiers, time) {
return this.mouse.handleOldJvm10Event (id, x, y, modifiers, time);
}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "reset", 
function (includingSpin) {
this.modelSet.calcBoundBoxDimensions (null, 1);
this.axesAreTainted = true;
this.transformManager.homePosition (includingSpin);
if (this.modelSet.setCrystallographicDefaults ()) this.stateManager.setCrystallographicDefaults ();
 else this.setAxesModeMolecular (false);
this.prevFrame = -2147483648;
if (!this.getSpinOn ()) this.refresh (1, "Viewer:homePosition()");
}, "~B");
Clazz.overrideMethod (c$, "homePosition", 
function () {
this.evalString ("reset spin");
});
Clazz.defineMethod (c$, "getAppletInfo", 
function () {
var info =  new java.util.Hashtable ();
info.put ("htmlName", this.htmlName);
info.put ("syncId", this.syncId);
info.put ("fullName", this.fullName);
if (this.$isApplet) {
info.put ("documentBase", this.appletDocumentBase);
info.put ("codeBase", this.appletCodeBase);
info.put ("registry", this.statusManager.getRegistryInfo ());
}info.put ("version", J.viewer.JC.version);
info.put ("date", J.viewer.JC.date);
info.put ("javaVendor", J.viewer.Viewer.strJavaVendor);
info.put ("javaVersion", J.viewer.Viewer.strJavaVersion);
info.put ("operatingSystem", J.viewer.Viewer.strOSName);
return info;
});
Clazz.defineMethod (c$, "initialize", 
function (clearUserVariables) {
this.global = this.stateManager.getGlobalSettings (this.global, clearUserVariables);
this.setStartupBooleans ();
this.global.setI ("_width", this.dimScreen.width);
this.global.setI ("_height", this.dimScreen.height);
if (this.haveDisplay) {
this.global.setB ("_is2D", this.isJS2D);
this.global.setB ("_multiTouchClient", this.actionManager.isMTClient ());
this.global.setB ("_multiTouchServer", this.actionManager.isMTServer ());
}this.colorManager.resetElementColors ();
this.setObjectColor ("background", "black");
this.setObjectColor ("axis1", "red");
this.setObjectColor ("axis2", "green");
this.setObjectColor ("axis3", "blue");
this.gdata.setAmbientPercent (this.global.ambientPercent);
this.gdata.setDiffusePercent (this.global.diffusePercent);
this.gdata.setSpecular (this.global.specular);
this.gdata.setCel (this.global.celShading);
this.gdata.setSpecularPercent (this.global.specularPercent);
this.gdata.setSpecularPower (-this.global.specularExponent);
this.gdata.setPhongExponent (this.global.phongExponent);
this.gdata.setSpecularPower (this.global.specularPower);
if (this.modelSet != null) this.animationManager.setAnimationOn (false);
this.animationManager.setAnimationFps (this.global.animationFps);
this.statusManager.setAllowStatusReporting (this.global.statusReporting);
this.setBooleanProperty ("antialiasDisplay", this.global.antialiasDisplay);
this.setTransformManagerDefaults ();
}, "~B");
Clazz.defineMethod (c$, "listSavedStates", 
function () {
return this.stateManager.listSavedStates ();
});
Clazz.defineMethod (c$, "saveOrientation", 
function (saveName) {
this.stateManager.saveOrientation (saveName);
}, "~S");
Clazz.defineMethod (c$, "restoreOrientation", 
function (saveName, timeSeconds) {
return this.stateManager.restoreOrientation (saveName, timeSeconds, true);
}, "~S,~N");
Clazz.defineMethod (c$, "restoreRotation", 
function (saveName, timeSeconds) {
this.stateManager.restoreOrientation (saveName, timeSeconds, false);
}, "~S,~N");
Clazz.defineMethod (c$, "saveModelOrientation", 
function () {
this.modelSet.saveModelOrientation (this.animationManager.currentModelIndex, this.stateManager.getOrientation ());
});
Clazz.defineMethod (c$, "getOrientation", 
function () {
return this.stateManager.getOrientation ();
});
Clazz.defineMethod (c$, "getSavedOrienationText", 
function (name) {
return this.stateManager.getSavedOrientationText (name);
}, "~S");
Clazz.defineMethod (c$, "restoreModelOrientation", 
function (modelIndex) {
var o = this.modelSet.getModelOrientation (modelIndex);
if (o != null) o.restore (-1, true);
}, "~N");
Clazz.defineMethod (c$, "restoreModelRotation", 
function (modelIndex) {
var o = this.modelSet.getModelOrientation (modelIndex);
if (o != null) o.restore (-1, false);
}, "~N");
Clazz.defineMethod (c$, "saveBonds", 
function (saveName) {
this.stateManager.saveBonds (saveName);
}, "~S");
Clazz.defineMethod (c$, "restoreBonds", 
function (saveName) {
this.clearModelDependentObjects ();
return this.stateManager.restoreBonds (saveName);
}, "~S");
Clazz.defineMethod (c$, "saveState", 
function (saveName) {
this.stateManager.saveState (saveName);
}, "~S");
Clazz.defineMethod (c$, "deleteSavedState", 
function (saveName) {
this.stateManager.deleteSaved ("State_" + saveName);
}, "~S");
Clazz.defineMethod (c$, "getSavedState", 
function (saveName) {
return this.stateManager.getSavedState (saveName);
}, "~S");
Clazz.defineMethod (c$, "saveStructure", 
function (saveName) {
this.stateManager.saveStructure (saveName);
}, "~S");
Clazz.defineMethod (c$, "getSavedStructure", 
function (saveName) {
return this.stateManager.getSavedStructure (saveName);
}, "~S");
Clazz.defineMethod (c$, "saveCoordinates", 
function (saveName, bsSelected) {
this.stateManager.saveCoordinates (saveName, bsSelected);
}, "~S,J.util.BS");
Clazz.defineMethod (c$, "getSavedCoordinates", 
function (saveName) {
return this.stateManager.getSavedCoordinates (saveName);
}, "~S");
Clazz.defineMethod (c$, "saveSelection", 
function (saveName) {
this.stateManager.saveSelection (saveName, this.getSelectionSet (false));
this.stateManager.restoreSelection (saveName);
}, "~S");
Clazz.defineMethod (c$, "restoreSelection", 
function (saveName) {
return this.stateManager.restoreSelection (saveName);
}, "~S");
Clazz.defineMethod (c$, "getMatrixtransform", 
function () {
return this.transformManager.getMatrixtransform ();
});
Clazz.defineMethod (c$, "getRotationQuaternion", 
function () {
return this.transformManager.getRotationQuaternion ();
});
Clazz.overrideMethod (c$, "getRotationRadius", 
function () {
return this.transformManager.getRotationRadius ();
});
Clazz.defineMethod (c$, "setRotationRadius", 
function (angstroms, doAll) {
if (doAll) angstroms = this.transformManager.setRotationRadius (angstroms, false);
if (this.modelSet.setRotationRadius (this.animationManager.currentModelIndex, angstroms)) this.global.setF ("rotationRadius", angstroms);
}, "~N,~B");
Clazz.defineMethod (c$, "getRotationCenter", 
function () {
return this.transformManager.getRotationCenter ();
});
Clazz.defineMethod (c$, "setCenterAt", 
function (relativeTo, pt) {
if (this.isJmolDataFrame ()) return;
this.transformManager.setCenterAt (relativeTo, pt);
}, "~S,J.util.P3");
Clazz.defineMethod (c$, "setCenterBitSet", 
function (bsCenter, doScale) {
var center = (J.util.BSUtil.cardinalityOf (bsCenter) > 0 ? this.getAtomSetCenter (bsCenter) : null);
if (this.isJmolDataFrame ()) return;
this.transformManager.setNewRotationCenter (center, doScale);
}, "J.util.BS,~B");
Clazz.defineMethod (c$, "setNewRotationCenter", 
function (center) {
if (this.isJmolDataFrame ()) return;
this.transformManager.setNewRotationCenter (center, true);
}, "J.util.P3");
Clazz.defineMethod (c$, "getNavigationCenter", 
function () {
return this.transformManager.getNavigationCenter ();
});
Clazz.defineMethod (c$, "getNavigationDepthPercent", 
function () {
return this.transformManager.getNavigationDepthPercent ();
});
Clazz.defineMethod (c$, "navigate", 
function (keyWhere, modifiers) {
if (this.isJmolDataFrame ()) return;
this.transformManager.navigateKey (keyWhere, modifiers);
if (!this.transformManager.vibrationOn && keyWhere != 0) this.refresh (1, "Viewer:navigate()");
}, "~N,~N");
Clazz.defineMethod (c$, "getNavigationOffset", 
function () {
return this.transformManager.getNavigationOffset ();
});
Clazz.defineMethod (c$, "getNavigationOffsetPercent", 
function (XorY) {
return this.transformManager.getNavigationOffsetPercent (XorY);
}, "~S");
Clazz.defineMethod (c$, "isNavigating", 
function () {
return this.transformManager.isNavigating ();
});
Clazz.defineMethod (c$, "isInPosition", 
function (axis, degrees) {
return this.transformManager.isInPosition (axis, degrees);
}, "J.util.V3,~N");
Clazz.defineMethod (c$, "move", 
function (eval, dRot, dZoom, dTrans, dSlab, floatSecondsTotal, fps) {
this.transformManager.move (eval, dRot, dZoom, dTrans, dSlab, floatSecondsTotal, fps);
this.moveUpdate (floatSecondsTotal);
}, "J.api.JmolScriptEvaluator,J.util.V3,~N,J.util.V3,~N,~N,~N");
Clazz.defineMethod (c$, "waitForMoveTo", 
function () {
return this.global.waitForMoveTo;
});
Clazz.defineMethod (c$, "stopMotion", 
function () {
this.transformManager.stopMotion ();
});
Clazz.defineMethod (c$, "setRotationMatrix", 
function (rotationMatrix) {
this.transformManager.setRotation (rotationMatrix);
}, "J.util.Matrix3f");
Clazz.defineMethod (c$, "moveTo", 
function (eval, floatSecondsTotal, center, rotAxis, degrees, rotationMatrix, zoom, xTrans, yTrans, rotationRadius, navCenter, xNav, yNav, navDepth) {
if (!this.haveDisplay) floatSecondsTotal = 0;
this.setTainted (true);
this.transformManager.moveTo (eval, floatSecondsTotal, center, rotAxis, degrees, rotationMatrix, zoom, xTrans, yTrans, rotationRadius, navCenter, xNav, yNav, navDepth);
}, "J.api.JmolScriptEvaluator,~N,J.util.P3,J.util.V3,~N,J.util.Matrix3f,~N,~N,~N,~N,J.util.P3,~N,~N,~N");
Clazz.defineMethod (c$, "moveUpdate", 
function (floatSecondsTotal) {
if (floatSecondsTotal > 0) this.requestRepaintAndWait ();
 else if (floatSecondsTotal == 0) this.setSync ();
}, "~N");
Clazz.defineMethod (c$, "getMoveToText", 
function (timespan) {
return this.transformManager.getMoveToText (timespan, false);
}, "~N");
Clazz.defineMethod (c$, "navigateList", 
function (eval, list) {
if (this.isJmolDataFrame ()) return;
this.transformManager.navigateList (eval, list);
}, "J.api.JmolScriptEvaluator,java.util.List");
Clazz.defineMethod (c$, "navigatePt", 
function (center) {
this.transformManager.setNavigatePt (center);
this.setSync ();
}, "J.util.P3");
Clazz.defineMethod (c$, "navigateAxis", 
function (rotAxis, degrees) {
this.transformManager.navigateAxis (rotAxis, degrees);
this.setSync ();
}, "J.util.V3,~N");
Clazz.defineMethod (c$, "navTranslatePercent", 
function (x, y) {
if (this.isJmolDataFrame ()) return;
this.transformManager.navTranslatePercent (0, x, y);
this.setSync ();
}, "~N,~N");
Clazz.defineMethod (c$, "setMouseEnabled", 
function (TF) {
this.mouseEnabled = TF;
}, "~B");
Clazz.overrideMethod (c$, "processEvent", 
function (groupID, eventType, touchID, iData, pt, time) {
this.actionManager.processEvent (groupID, eventType, touchID, iData, pt, time);
}, "~N,~N,~N,~N,J.util.P3,~N");
Clazz.defineMethod (c$, "zoomBy", 
function (pixels) {
if (this.mouseEnabled) this.transformManager.zoomBy (pixels);
this.refresh (2, this.statusManager.syncingMouse ? "Mouse: zoomBy " + pixels : "");
}, "~N");
Clazz.defineMethod (c$, "zoomByFactor", 
function (factor, x, y) {
if (this.mouseEnabled) this.transformManager.zoomByFactor (factor, x, y);
this.refresh (2, !this.statusManager.syncingMouse ? "" : "Mouse: zoomByFactor " + factor + (x == 2147483647 ? "" : " " + x + " " + y));
}, "~N,~N,~N");
Clazz.defineMethod (c$, "rotateXYBy", 
function (xDelta, yDelta) {
if (this.mouseEnabled) this.transformManager.rotateXYBy (xDelta, yDelta, null);
this.refresh (2, this.statusManager.syncingMouse ? "Mouse: rotateXYBy " + xDelta + " " + yDelta : "");
}, "~N,~N");
Clazz.defineMethod (c$, "spinXYBy", 
function (xDelta, yDelta, speed) {
if (this.mouseEnabled) this.transformManager.spinXYBy (xDelta, yDelta, speed);
if (xDelta == 0 && yDelta == 0) return;
this.refresh (2, this.statusManager.syncingMouse ? "Mouse: spinXYBy " + xDelta + " " + yDelta + " " + speed : "");
}, "~N,~N,~N");
Clazz.defineMethod (c$, "rotateZBy", 
function (zDelta, x, y) {
if (this.mouseEnabled) this.transformManager.rotateZBy (zDelta, x, y);
this.refresh (2, this.statusManager.syncingMouse ? "Mouse: rotateZBy " + zDelta + (x == 2147483647 ? "" : " " + x + " " + y) : "");
}, "~N,~N,~N");
Clazz.defineMethod (c$, "rotateSelected", 
function (deltaX, deltaY, bsSelected) {
if (this.isJmolDataFrame ()) return;
if (this.mouseEnabled) {
this.transformManager.rotateXYBy (deltaX, deltaY, this.setMovableBitSet (bsSelected, false));
this.refreshMeasures (true);
}this.refresh (2, this.statusManager.syncingMouse ? "Mouse: rotateMolecule " + deltaX + " " + deltaY : "");
}, "~N,~N,J.util.BS");
Clazz.defineMethod (c$, "setMovableBitSet", 
($fz = function (bsSelected, checkMolecule) {
if (bsSelected == null) bsSelected = this.getSelectionSet (false);
bsSelected = J.util.BSUtil.copy (bsSelected);
J.util.BSUtil.andNot (bsSelected, this.getMotionFixedAtoms ());
if (checkMolecule && !this.global.allowMoveAtoms) bsSelected = this.modelSet.getMoleculeBitSet (bsSelected);
return bsSelected;
}, $fz.isPrivate = true, $fz), "J.util.BS,~B");
Clazz.defineMethod (c$, "translateXYBy", 
function (xDelta, yDelta) {
if (this.mouseEnabled) this.transformManager.translateXYBy (xDelta, yDelta);
this.refresh (2, this.statusManager.syncingMouse ? "Mouse: translateXYBy " + xDelta + " " + yDelta : "");
}, "~N,~N");
Clazz.defineMethod (c$, "centerAt", 
function (x, y, pt) {
if (this.mouseEnabled) this.transformManager.centerAt (x, y, pt);
this.refresh (2, this.statusManager.syncingMouse ? "Mouse: centerAt " + x + " " + y + " " + pt.x + " " + pt.y + " " + pt.z : "");
}, "~N,~N,J.util.P3");
Clazz.overrideMethod (c$, "rotateFront", 
function () {
this.transformManager.rotateFront ();
this.refresh (1, "Viewer:rotateFront()");
});
Clazz.overrideMethod (c$, "rotateX", 
function (angleRadians) {
this.transformManager.rotateX (angleRadians);
this.refresh (1, "Viewer:rotateX()");
}, "~N");
Clazz.overrideMethod (c$, "rotateY", 
function (angleRadians) {
this.transformManager.rotateY (angleRadians);
this.refresh (1, "Viewer:rotateY()");
}, "~N");
Clazz.overrideMethod (c$, "rotateZ", 
function (angleRadians) {
this.transformManager.rotateZ (angleRadians);
this.refresh (1, "Viewer:rotateZ()");
}, "~N");
Clazz.overrideMethod (c$, "rotateXDeg", 
function (angleDegrees) {
this.rotateX (angleDegrees * 0.017453292);
}, "~N");
Clazz.overrideMethod (c$, "rotateYDeg", 
function (angleDegrees) {
this.rotateY (angleDegrees * 0.017453292);
}, "~N");
Clazz.defineMethod (c$, "translate", 
function (xyz, x, type, bsAtoms) {
var xy = (type == '\0' ? Clazz.floatToInt (x) : type == '%' ? this.transformManager.percentToPixels (xyz, x) : this.transformManager.angstromsToPixels (x * (type == 'n' ? 10 : 1)));
if (bsAtoms != null) {
if (xy == 0) return;
this.transformManager.setSelectedTranslation (bsAtoms, xyz, xy);
} else {
switch (xyz) {
case 'X':
case 'x':
if (type == '\0') this.transformManager.translateToPercent ('x', x);
 else this.transformManager.translateXYBy (xy, 0);
break;
case 'Y':
case 'y':
if (type == '\0') this.transformManager.translateToPercent ('y', x);
 else this.transformManager.translateXYBy (0, xy);
break;
case 'Z':
case 'z':
if (type == '\0') this.transformManager.translateToPercent ('z', x);
 else this.transformManager.translateZBy (xy);
break;
}
}this.refresh (1, "Viewer:translate()");
}, "~S,~N,~S,J.util.BS");
Clazz.defineMethod (c$, "getTranslationXPercent", 
function () {
return this.transformManager.getTranslationXPercent ();
});
Clazz.defineMethod (c$, "getTranslationYPercent", 
function () {
return this.transformManager.getTranslationYPercent ();
});
Clazz.defineMethod (c$, "getTranslationZPercent", 
function () {
return this.transformManager.getTranslationZPercent ();
});
Clazz.defineMethod (c$, "getTranslationScript", 
function () {
return this.transformManager.getTranslationScript ();
});
Clazz.defineMethod (c$, "getZShadeStart", 
function () {
return this.transformManager.getZShadeStart ();
});
Clazz.overrideMethod (c$, "getZoomPercent", 
function () {
return Clazz.floatToInt (this.getZoomSetting ());
});
Clazz.defineMethod (c$, "getZoomSetting", 
function () {
return this.transformManager.getZoomSetting ();
});
Clazz.overrideMethod (c$, "getZoomPercentFloat", 
function () {
return this.transformManager.getZoomPercentFloat ();
});
Clazz.defineMethod (c$, "getMaxZoomPercent", 
function () {
return 200000;
});
Clazz.defineMethod (c$, "slabReset", 
function () {
this.transformManager.slabReset ();
});
Clazz.defineMethod (c$, "getZoomEnabled", 
function () {
return this.transformManager.zoomEnabled;
});
Clazz.defineMethod (c$, "getSlabEnabled", 
function () {
return this.transformManager.slabEnabled;
});
Clazz.defineMethod (c$, "getSlabByMolecule", 
function () {
return this.global.slabByMolecule;
});
Clazz.defineMethod (c$, "getSlabByAtom", 
function () {
return this.global.slabByAtom;
});
Clazz.defineMethod (c$, "slabByPixels", 
function (pixels) {
this.transformManager.slabByPercentagePoints (pixels);
this.refresh (3, "slabByPixels");
}, "~N");
Clazz.defineMethod (c$, "depthByPixels", 
function (pixels) {
this.transformManager.depthByPercentagePoints (pixels);
this.refresh (3, "depthByPixels");
}, "~N");
Clazz.defineMethod (c$, "slabDepthByPixels", 
function (pixels) {
this.transformManager.slabDepthByPercentagePoints (pixels);
this.refresh (3, "slabDepthByPixels");
}, "~N");
Clazz.defineMethod (c$, "slabInternal", 
function (plane, isDepth) {
this.transformManager.slabInternal (plane, isDepth);
}, "J.util.Point4f,~B");
Clazz.defineMethod (c$, "slabToPercent", 
function (percentSlab) {
this.transformManager.slabToPercent (percentSlab);
}, "~N");
Clazz.defineMethod (c$, "depthToPercent", 
function (percentDepth) {
this.transformManager.depthToPercent (percentDepth);
}, "~N");
Clazz.defineMethod (c$, "setSlabDepthInternal", 
function (isDepth) {
this.transformManager.setSlabDepthInternal (isDepth);
}, "~B");
Clazz.defineMethod (c$, "zValueFromPercent", 
function (zPercent) {
return this.transformManager.zValueFromPercent (zPercent);
}, "~N");
Clazz.overrideMethod (c$, "getUnscaledTransformMatrix", 
function () {
return this.transformManager.getUnscaledTransformMatrix ();
});
Clazz.defineMethod (c$, "finalizeTransformParameters", 
function () {
this.transformManager.finalizeTransformParameters ();
this.gdata.setSlab (this.transformManager.slabValue);
this.gdata.setDepth (this.transformManager.depthValue);
this.gdata.setZShade (this.transformManager.zShadeEnabled, this.transformManager.zSlabValue, this.transformManager.zDepthValue, this.global.zShadePower);
});
Clazz.defineMethod (c$, "rotatePoint", 
function (pt, ptRot) {
this.transformManager.rotatePoint (pt, ptRot);
}, "J.util.P3,J.util.P3");
Clazz.defineMethod (c$, "transformPt", 
function (pointAngstroms) {
return this.transformManager.transformPoint (pointAngstroms);
}, "J.util.P3");
Clazz.defineMethod (c$, "transformPtVib", 
function (pointAngstroms, vibrationVector) {
return this.transformManager.transformPointVib (pointAngstroms, vibrationVector);
}, "J.util.P3,J.util.V3");
Clazz.defineMethod (c$, "transformPtScr", 
function (pointAngstroms, pointScreen) {
this.transformManager.transformPointScr (pointAngstroms, pointScreen);
}, "J.util.P3,J.util.P3i");
Clazz.defineMethod (c$, "transformPtNoClip", 
function (pointAngstroms, pt) {
this.transformManager.transformPointNoClip2 (pointAngstroms, pt);
}, "J.util.P3,J.util.P3");
Clazz.defineMethod (c$, "transformPt3f", 
function (pointAngstroms, pointScreen) {
this.transformManager.transformPoint2 (pointAngstroms, pointScreen);
}, "J.util.P3,J.util.P3");
Clazz.defineMethod (c$, "transformPoints", 
function (pointsAngstroms, pointsScreens) {
this.transformManager.transformPoints (pointsAngstroms.length, pointsAngstroms, pointsScreens);
}, "~A,~A");
Clazz.defineMethod (c$, "transformVector", 
function (vectorAngstroms, vectorTransformed) {
this.transformManager.transformVector (vectorAngstroms, vectorTransformed);
}, "J.util.V3,J.util.V3");
Clazz.defineMethod (c$, "unTransformPoint", 
function (pointScreen, pointAngstroms) {
this.transformManager.unTransformPoint (pointScreen, pointAngstroms);
}, "J.util.P3,J.util.P3");
Clazz.defineMethod (c$, "getScalePixelsPerAngstrom", 
function (asAntialiased) {
return this.transformManager.scalePixelsPerAngstrom * (asAntialiased || !this.antialiasDisplay ? 1 : 0.5);
}, "~B");
Clazz.defineMethod (c$, "scaleToScreen", 
function (z, milliAngstroms) {
return this.transformManager.scaleToScreen (z, milliAngstroms);
}, "~N,~N");
Clazz.defineMethod (c$, "unscaleToScreen", 
function (z, screenDistance) {
return this.transformManager.unscaleToScreen (z, screenDistance);
}, "~N,~N");
Clazz.defineMethod (c$, "scaleToPerspective", 
function (z, sizeAngstroms) {
return this.transformManager.scaleToPerspective (z, sizeAngstroms);
}, "~N,~N");
Clazz.defineMethod (c$, "setSpin", 
function (key, value) {
if (!J.util.Parser.isOneOf (key, "x;y;z;fps;X;Y;Z;FPS")) return;
var i = "x;y;z;fps;X;Y;Z;FPS".indexOf (key);
switch (i) {
case 0:
this.transformManager.setSpinXYZ (value, NaN, NaN);
break;
case 2:
this.transformManager.setSpinXYZ (NaN, value, NaN);
break;
case 4:
this.transformManager.setSpinXYZ (NaN, NaN, value);
break;
case 6:
default:
this.transformManager.setSpinFps (value);
break;
case 10:
this.transformManager.setNavXYZ (value, NaN, NaN);
break;
case 12:
this.transformManager.setNavXYZ (NaN, value, NaN);
break;
case 14:
this.transformManager.setNavXYZ (NaN, NaN, value);
break;
case 16:
this.transformManager.setNavFps (value);
break;
}
this.global.setI ((i < 10 ? "spin" : "nav") + key, value);
}, "~S,~N");
Clazz.defineMethod (c$, "getSpinState", 
function () {
return this.getStateCreator ().getSpinState (false);
});
Clazz.defineMethod (c$, "setSpinOn", 
function (spinOn) {
if (spinOn) this.transformManager.setSpinOn ();
 else this.transformManager.setSpinOff ();
}, "~B");
Clazz.defineMethod (c$, "getSpinOn", 
function () {
return this.transformManager.getSpinOn ();
});
Clazz.defineMethod (c$, "setNavOn", 
function (navOn) {
this.transformManager.setNavOn (navOn);
}, "~B");
Clazz.defineMethod (c$, "getNavOn", 
function () {
return this.transformManager.getNavOn ();
});
Clazz.defineMethod (c$, "setNavXYZ", 
function (x, y, z) {
this.transformManager.setNavXYZ (Clazz.floatToInt (x), Clazz.floatToInt (y), Clazz.floatToInt (z));
}, "~N,~N,~N");
Clazz.defineMethod (c$, "getOrientationText", 
function (type, name) {
return (name == null ? this.transformManager.getOrientationText (type) : this.stateManager.getSavedOrientationText (name));
}, "~N,~S");
Clazz.defineMethod (c$, "getOrientationInfo", 
function () {
return this.transformManager.getOrientationInfo ();
});
Clazz.defineMethod (c$, "getMatrixRotate", 
function () {
return this.transformManager.getMatrixRotate ();
});
Clazz.defineMethod (c$, "getAxisAngle", 
function (axisAngle) {
this.transformManager.getAxisAngle (axisAngle);
}, "J.util.AxisAngle4f");
Clazz.defineMethod (c$, "getTransformText", 
function () {
return this.transformManager.getTransformText ();
});
Clazz.defineMethod (c$, "getRotation", 
function (matrixRotation) {
this.transformManager.getRotation (matrixRotation);
}, "J.util.Matrix3f");
Clazz.defineMethod (c$, "getCurrentColorRange", 
function () {
return this.colorManager.getPropertyColorRange ();
});
Clazz.defineMethod (c$, "setDefaultColors", 
($fz = function (isRasmol) {
this.colorManager.setDefaultColors (isRasmol);
this.global.setB ("colorRasmol", isRasmol);
this.global.setS ("defaultColorScheme", (isRasmol ? "rasmol" : "jmol"));
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "getDefaultTranslucent", 
function () {
return this.global.defaultTranslucent;
});
Clazz.defineMethod (c$, "getColorArgbOrGray", 
function (colix) {
return this.gdata.getColorArgbOrGray (colix);
}, "~N");
Clazz.defineMethod (c$, "setRubberbandArgb", 
function (argb) {
this.colorManager.setRubberbandArgb (argb);
}, "~N");
Clazz.defineMethod (c$, "getColixRubberband", 
function () {
return this.colorManager.colixRubberband;
});
Clazz.defineMethod (c$, "setElementArgb", 
function (elementNumber, argb) {
this.global.setS ("=color " + J.util.Elements.elementNameFromNumber (elementNumber), J.util.Escape.escapeColor (argb));
this.colorManager.setElementArgb (elementNumber, argb);
}, "~N,~N");
Clazz.defineMethod (c$, "getVectorScale", 
function () {
return this.global.vectorScale;
});
Clazz.defineMethod (c$, "getVectorSymmetry", 
function () {
return this.global.vectorSymmetry;
});
Clazz.overrideMethod (c$, "setVectorScale", 
function (scale) {
this.global.setF ("vectorScale", scale);
this.global.vectorScale = scale;
}, "~N");
Clazz.defineMethod (c$, "getDefaultDrawArrowScale", 
function () {
return this.global.defaultDrawArrowScale;
});
Clazz.defineMethod (c$, "getVibrationScale", 
function () {
return this.global.vibrationScale;
});
Clazz.defineMethod (c$, "getVibrationPeriod", 
function () {
return this.global.vibrationPeriod;
});
Clazz.defineMethod (c$, "isVibrationOn", 
function () {
return this.transformManager.vibrationOn;
});
Clazz.overrideMethod (c$, "setVibrationScale", 
function (scale) {
this.transformManager.setVibrationScale (scale);
this.global.vibrationScale = scale;
this.global.setF ("vibrationScale", scale);
}, "~N");
Clazz.defineMethod (c$, "setVibrationOff", 
function () {
this.transformManager.setVibrationPeriod (0);
});
Clazz.overrideMethod (c$, "setVibrationPeriod", 
function (period) {
this.transformManager.setVibrationPeriod (period);
period = Math.abs (period);
this.global.vibrationPeriod = period;
this.global.setF ("vibrationPeriod", period);
}, "~N");
Clazz.defineMethod (c$, "setObjectColor", 
function (name, colorName) {
if (colorName == null || colorName.length == 0) return;
this.setObjectArgb (name, J.util.ColorUtil.getArgbFromString (colorName));
}, "~S,~S");
Clazz.defineMethod (c$, "setObjectArgb", 
function (name, argb) {
var objId = J.viewer.StateManager.getObjectIdFromName (name);
if (objId < 0) {
if (name.equalsIgnoreCase ("axes")) {
this.setObjectArgb ("axis1", argb);
this.setObjectArgb ("axis2", argb);
this.setObjectArgb ("axis3", argb);
}return;
}this.global.objColors[objId] = argb;
switch (objId) {
case 0:
this.gdata.setBackgroundArgb (argb);
this.colorManager.setColixBackgroundContrast (argb);
break;
}
this.global.setS (name + "Color", J.util.Escape.escapeColor (argb));
}, "~S,~N");
Clazz.defineMethod (c$, "setBackgroundImage", 
function (fileName, image) {
this.global.backgroundImageFileName = fileName;
this.gdata.setBackgroundImage (image);
}, "~S,~O");
Clazz.defineMethod (c$, "getObjectArgb", 
function (objId) {
return this.global.objColors[objId];
}, "~N");
Clazz.defineMethod (c$, "getObjectColix", 
function (objId) {
var argb = this.getObjectArgb (objId);
if (argb == 0) return this.getColixBackgroundContrast ();
return J.util.C.getColix (argb);
}, "~N");
Clazz.defineMethod (c$, "getFontState", 
function (myType, font3d) {
return this.getStateCreator ().getFontState (myType, font3d);
}, "~S,J.util.JmolFont");
Clazz.overrideMethod (c$, "setColorBackground", 
function (colorName) {
this.setObjectColor ("background", colorName);
}, "~S");
Clazz.overrideMethod (c$, "getBackgroundArgb", 
function () {
return this.getObjectArgb (0);
});
Clazz.defineMethod (c$, "setObjectMad", 
function (iShape, name, mad) {
var objId = J.viewer.StateManager.getObjectIdFromName (name.equalsIgnoreCase ("axes") ? "axis" : name);
if (objId < 0) return;
if (mad == -2 || mad == -4) {
var m = mad + 3;
mad = this.getObjectMad (objId);
if (mad == 0) mad = m;
}this.global.setB ("show" + name, mad != 0);
this.global.objStateOn[objId] = (mad != 0);
if (mad == 0) return;
this.global.objMad[objId] = mad;
this.setShapeSize (iShape, mad, null);
}, "~N,~S,~N");
Clazz.defineMethod (c$, "getObjectMad", 
function (objId) {
return (this.global.objStateOn[objId] ? this.global.objMad[objId] : 0);
}, "~N");
Clazz.defineMethod (c$, "setPropertyColorScheme", 
function (scheme, isTranslucent, isOverloaded) {
this.global.propertyColorScheme = scheme;
if (scheme.startsWith ("translucent ")) {
isTranslucent = true;
scheme = scheme.substring (12).trim ();
}this.colorManager.setPropertyColorScheme (scheme, isTranslucent, isOverloaded);
}, "~S,~B,~B");
Clazz.defineMethod (c$, "getPropertyColorScheme", 
function () {
return this.global.propertyColorScheme;
});
Clazz.defineMethod (c$, "getColixBackgroundContrast", 
function () {
return this.colorManager.colixBackgroundContrast;
});
Clazz.defineMethod (c$, "getSpecularState", 
function () {
return this.getStateCreator ().getSpecularState ();
});
Clazz.defineMethod (c$, "getColixAtomPalette", 
function (atom, pid) {
return this.colorManager.getColixAtomPalette (atom, pid);
}, "J.modelset.Atom,~N");
Clazz.defineMethod (c$, "getColixBondPalette", 
function (bond, pid) {
return this.colorManager.getColixBondPalette (bond, pid);
}, "J.modelset.Bond,~N");
Clazz.defineMethod (c$, "getColorSchemeList", 
function (colorScheme) {
return this.colorManager.getColorSchemeList (colorScheme);
}, "~S");
Clazz.defineMethod (c$, "setUserScale", 
function (scale) {
this.colorManager.setUserScale (scale);
}, "~A");
Clazz.defineMethod (c$, "getColixForPropertyValue", 
function (val) {
return this.colorManager.getColixForPropertyValue (val);
}, "~N");
Clazz.defineMethod (c$, "getColorPointForPropertyValue", 
function (val) {
return J.util.ColorUtil.colorPointFromInt2 (this.gdata.getColorArgbOrGray (this.colorManager.getColixForPropertyValue (val)));
}, "~N");
Clazz.defineMethod (c$, "select", 
function (bs, isGroup, addRemove, isQuiet) {
if (isGroup) bs = this.getUndeletedGroupAtomBits (bs);
this.selectionManager.select (bs, addRemove, isQuiet);
this.shapeManager.setShapeSizeBs (1, 2147483647, null, null);
}, "J.util.BS,~B,Boolean,~B");
Clazz.overrideMethod (c$, "setSelectionSet", 
function (set) {
this.select (set, false, null, true);
}, "J.util.BS");
Clazz.defineMethod (c$, "selectBonds", 
function (bs) {
this.shapeManager.setShapeSizeBs (1, 2147483647, null, bs);
}, "J.util.BS");
Clazz.defineMethod (c$, "displayAtoms", 
function (bs, isDisplay, isGroup, addRemove, isQuiet) {
if (isGroup) bs = this.getUndeletedGroupAtomBits (bs);
if (isDisplay) this.selectionManager.display (this.modelSet, bs, addRemove, isQuiet);
 else this.selectionManager.hide (this.modelSet, bs, addRemove, isQuiet);
}, "J.util.BS,~B,~B,Boolean,~B");
Clazz.defineMethod (c$, "getUndeletedGroupAtomBits", 
($fz = function (bs) {
bs = this.getAtomBits (1087373318, bs);
J.util.BSUtil.andNot (bs, this.selectionManager.getDeletedAtoms ());
return bs;
}, $fz.isPrivate = true, $fz), "J.util.BS");
Clazz.defineMethod (c$, "getHiddenSet", 
function () {
return this.selectionManager.getHiddenSet ();
});
Clazz.defineMethod (c$, "isSelected", 
function (atomIndex) {
return this.selectionManager.isSelected (atomIndex);
}, "~N");
Clazz.defineMethod (c$, "isInSelectionSubset", 
function (atomIndex) {
return this.selectionManager.isInSelectionSubset (atomIndex);
}, "~N");
Clazz.defineMethod (c$, "reportSelection", 
function (msg) {
if (this.modelSet.getSelectionHaloEnabled ()) this.setTainted (true);
if (this.isScriptQueued () || this.global.debugScript) this.scriptStatus (msg);
}, "~S");
Clazz.defineMethod (c$, "getAtomSetCenter", 
function (bs) {
return this.modelSet.getAtomSetCenter (bs);
}, "J.util.BS");
Clazz.defineMethod (c$, "clearAtomSets", 
($fz = function () {
this.setSelectionSubset (null);
this.definedAtomSets.clear ();
}, $fz.isPrivate = true, $fz));
Clazz.overrideMethod (c$, "selectAll", 
function () {
this.selectionManager.selectAll (false);
});
Clazz.defineMethod (c$, "setNoneSelected", 
function (noneSelected) {
this.noneSelected = noneSelected;
}, "~B");
Clazz.defineMethod (c$, "getNoneSelected", 
function () {
return (this.noneSelected ? Boolean.TRUE : Boolean.FALSE);
});
Clazz.overrideMethod (c$, "clearSelection", 
function () {
this.selectionManager.clearSelection (true);
this.global.setB ("hideNotSelected", false);
});
Clazz.defineMethod (c$, "setSelectionSubset", 
function (subset) {
this.selectionManager.setSelectionSubset (subset);
}, "J.util.BS");
Clazz.defineMethod (c$, "getSelectionSubset", 
function () {
return this.selectionManager.getSelectionSubset ();
});
Clazz.defineMethod (c$, "invertSelection", 
function () {
this.selectionManager.invertSelection ();
});
Clazz.defineMethod (c$, "getSelectionSet", 
function (includeDeleted) {
return this.selectionManager.getSelectionSet (includeDeleted);
}, "~B");
Clazz.defineMethod (c$, "setSelectedAtom", 
function (atomIndex, TF) {
this.selectionManager.setSelectedAtom (atomIndex, TF);
}, "~N,~B");
Clazz.defineMethod (c$, "isAtomSelected", 
function (atomIndex) {
return this.selectionManager.isAtomSelected (atomIndex);
}, "~N");
Clazz.overrideMethod (c$, "getSelectionCount", 
function () {
return this.selectionManager.getSelectionCount ();
});
Clazz.defineMethod (c$, "setFormalCharges", 
function (formalCharge) {
this.modelSet.setFormalCharges (this.getSelectionSet (false), formalCharge);
}, "~N");
Clazz.overrideMethod (c$, "addSelectionListener", 
function (listener) {
this.selectionManager.addListener (listener);
}, "J.api.JmolSelectionListener");
Clazz.overrideMethod (c$, "removeSelectionListener", 
function (listener) {
this.selectionManager.addListener (listener);
}, "J.api.JmolSelectionListener");
Clazz.defineMethod (c$, "getAtomBitSetEval", 
function (eval, atomExpression) {
if (!this.allowScripting) {
System.out.println ("viewer.getAtomBitSetEval not allowed");
return  new J.util.BS ();
}return this.getScriptManager ().getAtomBitSetEval (eval, atomExpression);
}, "J.api.JmolScriptEvaluator,~O");
Clazz.overrideMethod (c$, "setModeMouse", 
function (modeMouse) {
if (modeMouse == -1) {
if (this.mouse != null) {
this.mouse.dispose ();
this.mouse = null;
}this.clearScriptQueue ();
this.clearThreads ();
this.haltScriptExecution ();
if (this.scriptManager != null) this.scriptManager.clear (true);
this.gdata.destroy ();
if (this.jmolpopup != null) this.jmolpopup.jpiDispose ();
if (this.modelkitPopup != null) this.modelkitPopup.jpiDispose ();
try {
if (this.appConsole != null) {
this.appConsole.dispose ();
this.appConsole = null;
}if (this.scriptEditor != null) {
this.scriptEditor.dispose ();
this.scriptEditor = null;
}} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}}, "~N");
Clazz.defineMethod (c$, "getRubberBandSelection", 
function () {
return (this.haveDisplay ? this.actionManager.getRubberBand () : null);
});
Clazz.defineMethod (c$, "isBound", 
function (action, gesture) {
return (this.haveDisplay && this.actionManager.isBound (action, gesture));
}, "~N,~N");
Clazz.defineMethod (c$, "getCursorX", 
function () {
return (this.haveDisplay ? this.actionManager.getCurrentX () : 0);
});
Clazz.defineMethod (c$, "getCursorY", 
function () {
return (this.haveDisplay ? this.actionManager.getCurrentY () : 0);
});
Clazz.defineMethod (c$, "getDefaultDirectory", 
function () {
return this.global.defaultDirectory;
});
Clazz.overrideMethod (c$, "getBufferedInputStream", 
function (fullPathName) {
return this.fileManager.getBufferedInputStream (fullPathName);
}, "~S");
Clazz.defineMethod (c$, "getBufferedReaderOrErrorMessageFromName", 
function (name, fullPathNameReturn, isBinary) {
return this.fileManager.getBufferedReaderOrErrorMessageFromName (name, fullPathNameReturn, isBinary, true);
}, "~S,~A,~B");
Clazz.defineMethod (c$, "setLoadParameters", 
($fz = function (htParams, isAppend) {
if (htParams == null) htParams =  new java.util.Hashtable ();
htParams.put ("viewer", this);
if (this.global.atomTypes.length > 0) htParams.put ("atomTypes", this.global.atomTypes);
if (!htParams.containsKey ("lattice")) htParams.put ("lattice", this.global.getDefaultLattice ());
if (this.global.applySymmetryToBonds) htParams.put ("applySymmetryToBonds", Boolean.TRUE);
if (this.global.pdbGetHeader) htParams.put ("getHeader", Boolean.TRUE);
if (this.global.pdbSequential) htParams.put ("isSequential", Boolean.TRUE);
htParams.put ("stateScriptVersionInt", Integer.$valueOf (this.stateScriptVersionInt));
if (!htParams.containsKey ("filter")) {
var filter = this.getDefaultLoadFilter ();
if (filter.length > 0) htParams.put ("filter", filter);
}if (isAppend && !this.global.appendNew && this.getAtomCount () > 0) htParams.put ("merging", Boolean.TRUE);
return htParams;
}, $fz.isPrivate = true, $fz), "java.util.Map,~B");
Clazz.overrideMethod (c$, "openFileAsyncPDB", 
function (fileName, pdbCartoons) {
this.getStateCreator ().openFileAsync (fileName, pdbCartoons);
}, "~S,~B");
Clazz.defineMethod (c$, "openFile", 
function (fileName) {
this.zap (true, true, false);
return this.loadModelFromFile (null, fileName, null, null, false, null, null, 0);
}, "~S");
Clazz.overrideMethod (c$, "openFiles", 
function (fileNames) {
this.zap (true, true, false);
return this.loadModelFromFile (null, null, fileNames, null, false, null, null, 0);
}, "~A");
Clazz.overrideMethod (c$, "openReader", 
function (fullPathName, fileName, reader) {
this.zap (true, true, false);
return this.loadModelFromFile (fullPathName, fileName, null, reader, false, null, null, 0);
}, "~S,~S,java.io.Reader");
Clazz.overrideMethod (c$, "openDOM", 
function (DOMNode) {
this.zap (true, true, false);
return this.loadModelFromFile ("?", "?", null, DOMNode, false, null, null, 0);
}, "~O");
Clazz.defineMethod (c$, "loadModelFromFile", 
function (fullPathName, fileName, fileNames, reader, isAppend, htParams, loadScript, tokType) {
if (htParams == null) htParams = this.setLoadParameters (null, isAppend);
var atomSetCollection;
var saveInfo = this.fileManager.getFileInfo ();
if (fileNames != null) {
if (loadScript == null) {
loadScript =  new J.util.SB ().append ("load files");
for (var i = 0; i < fileNames.length; i++) loadScript.append (" /*file*/$FILENAME" + (i + 1) + "$");

}var timeBegin = System.currentTimeMillis ();
atomSetCollection = this.fileManager.createAtomSetCollectionFromFiles (fileNames, this.setLoadParameters (htParams, isAppend), isAppend);
var ms = System.currentTimeMillis () - timeBegin;
var msg = "";
for (var i = 0; i < fileNames.length; i++) msg += (i == 0 ? "" : ",") + fileNames[i];

J.util.Logger.info ("openFiles(" + fileNames.length + ") " + ms + " ms");
fileNames = htParams.get ("fullPathNames");
var fileTypes = htParams.get ("fileTypes");
var s = loadScript.toString ();
for (var i = 0; i < fileNames.length; i++) {
var fname = fileNames[i];
if (fileTypes != null && fileTypes[i] != null) fname = fileTypes[i] + "::" + fname;
s = J.util.TextFormat.simpleReplace (s, "$FILENAME" + (i + 1) + "$", J.util.Escape.eS (fname.$replace ('\\', '/')));
}
loadScript =  new J.util.SB ().append (s);
} else if (reader == null) {
if (loadScript == null) loadScript =  new J.util.SB ().append ("load /*file*/$FILENAME$");
atomSetCollection = this.openFile (fileName, isAppend, htParams, loadScript);
} else if (Clazz.instanceOf (reader, java.io.Reader)) {
atomSetCollection = this.fileManager.createAtomSetCollectionFromReader (fullPathName, fileName, reader, htParams);
} else {
atomSetCollection = this.fileManager.createAtomSetCollectionFromDOM (reader, htParams);
}if (tokType != 0) {
this.fileManager.setFileInfo (saveInfo);
return this.loadAtomDataAndReturnError (atomSetCollection, tokType);
}if (htParams.containsKey ("isData")) return atomSetCollection;
if (loadScript != null) {
var fname = htParams.get ("fullPathName");
if (fname == null) fname = "";
if (htParams.containsKey ("loadScript")) loadScript = htParams.get ("loadScript");
htParams.put ("loadScript", loadScript =  new J.util.SB ().append (J.util.TextFormat.simpleReplace (loadScript.toString (), "$FILENAME$", J.util.Escape.eS (fname.$replace ('\\', '/')))));
}return this.createModelSetAndReturnError (atomSetCollection, isAppend, loadScript, htParams);
}, "~S,~S,~A,~O,~B,java.util.Map,J.util.SB,~N");
Clazz.defineMethod (c$, "setLigandModel", 
function (id, data) {
id = id.toUpperCase ();
if (this.ligandModels == null) this.ligandModels =  new java.util.Hashtable ();
this.ligandModels.put (id + "_data", data);
}, "~S,~S");
Clazz.defineMethod (c$, "getLigandModel", 
function (id) {
if (id == null) {
if (this.ligandModelSet != null) {
var e = this.ligandModels.entrySet ().iterator ();
while (e.hasNext ()) {
var entry = e.next ();
if (Clazz.instanceOf (entry.getValue (), Boolean)) e.remove ();
}
}return null;
}id = id.toUpperCase ();
if (this.ligandModelSet == null) this.ligandModelSet =  new java.util.Hashtable ();
this.ligandModelSet.put (id, Boolean.TRUE);
if (this.ligandModels == null) this.ligandModels =  new java.util.Hashtable ();
var model = this.ligandModels.get (id);
var data;
var fname = null;
if (Clazz.instanceOf (model, Boolean)) return null;
if (model == null) model = this.ligandModels.get (id + "_data");
var isError = false;
if (model == null) {
fname = this.setLoadFormat ("#" + id, '#', false);
if (fname.length == 0) return null;
this.scriptEcho ("fetching " + fname);
model = this.getFileAsString (fname);
isError = ((model).indexOf ("java.") == 0);
if (!isError) this.ligandModels.put (id + "_data", model);
}if (!isError && Clazz.instanceOf (model, String)) {
data = model;
if (data.length != 0) {
var htParams =  new java.util.Hashtable ();
htParams.put ("modelOnly", Boolean.TRUE);
model = this.getModelAdapter ().getAtomSetCollectionReader ("ligand", null, J.io.JmolBinary.getBufferedReaderForString (data), htParams);
isError = (Clazz.instanceOf (model, String));
if (!isError) {
model = this.getModelAdapter ().getAtomSetCollection (model);
isError = (Clazz.instanceOf (model, String));
if (fname != null && !isError) this.scriptEcho (this.getModelAdapter ().getAtomSetCollectionAuxiliaryInfo (model).get ("modelLoadNote"));
}}}if (isError) {
this.scriptEcho (model.toString ());
this.ligandModels.put (id, Boolean.FALSE);
return null;
}return model;
}, "~S");
Clazz.defineMethod (c$, "openFile", 
($fz = function (fileName, isAppend, htParams, loadScript) {
if (fileName == null) return null;
if (fileName.indexOf ("[]") >= 0) {
return null;
}var atomSetCollection;
var msg = "openFile(" + fileName + ")";
J.util.Logger.startTimer (msg);
htParams = this.setLoadParameters (htParams, isAppend);
var isLoadVariable = fileName.startsWith ("@");
var haveFileData = (htParams.containsKey ("fileData"));
if (fileName.indexOf ('$') == 0) htParams.put ("smilesString", fileName.substring (1));
var isString = (fileName.equalsIgnoreCase ("string") || fileName.equals ("Jmol Model Kit"));
var strModel = null;
if (haveFileData) {
strModel = htParams.get ("fileData");
if (htParams.containsKey ("isData")) {
return this.loadInlineScript (strModel, '\0', isAppend, htParams);
}} else if (isString) {
strModel = this.modelSet.getInlineData (-1);
if (strModel == null) if (this.isModelKitMode ()) strModel = "1 0 C 0 0";
 else return "cannot find string data";
if (loadScript != null) htParams.put ("loadScript", loadScript =  new J.util.SB ().append (J.util.TextFormat.simpleReplace (loadScript.toString (), "$FILENAME$", "data \"model inline\"\n" + strModel + "end \"model inline\"")));
}if (strModel != null) {
if (!isAppend) this.zap (true, false, false);
atomSetCollection = this.fileManager.createAtomSetCollectionFromString (strModel, loadScript, htParams, isAppend, isLoadVariable || haveFileData && !isString);
} else {
atomSetCollection = this.fileManager.createAtomSetCollectionFromFile (fileName, htParams, isAppend);
}J.util.Logger.checkTimer (msg, false);
return atomSetCollection;
}, $fz.isPrivate = true, $fz), "~S,~B,java.util.Map,J.util.SB");
Clazz.overrideMethod (c$, "openStringInline", 
function (strModel) {
return this.openStringInlineParams (strModel, null, false);
}, "~S");
Clazz.defineMethod (c$, "loadInline", 
function (strModel) {
return this.loadInlineScript (strModel, this.global.inlineNewlineChar, false, null);
}, "~S");
Clazz.defineMethod (c$, "loadInline", 
function (strModel, newLine) {
return this.loadInlineScript (strModel, newLine, false, null);
}, "~S,~S");
Clazz.defineMethod (c$, "loadInline", 
function (strModel, isAppend) {
return this.loadInlineScript (strModel, '\0', isAppend, null);
}, "~S,~B");
Clazz.defineMethod (c$, "loadInline", 
function (arrayModels) {
return this.loadInline (arrayModels, false);
}, "~A");
Clazz.defineMethod (c$, "loadInline", 
function (arrayModels, isAppend) {
if (arrayModels == null || arrayModels.length == 0) return null;
return this.openStringsInline (arrayModels, null, isAppend);
}, "~A,~B");
Clazz.defineMethod (c$, "loadInline", 
function (arrayData, isAppend) {
if (arrayData == null || arrayData.size () == 0) return null;
if (!isAppend) this.zap (true, false, false);
var atomSetCollection = this.fileManager.createAtomSeCollectionFromArrayData (arrayData, this.setLoadParameters (null, isAppend), isAppend);
return this.createModelSetAndReturnError (atomSetCollection, isAppend, null, null);
}, "java.util.List,~B");
Clazz.defineMethod (c$, "loadInlineScript", 
function (strModel, newLine, isAppend, htParams) {
if (strModel == null || strModel.length == 0) return null;
if (strModel.startsWith ("LOAD files")) {
this.script (strModel);
return null;
}strModel = this.fixInlineString (strModel, newLine);
if (newLine.charCodeAt (0) != 0) J.util.Logger.info ("loading model inline, " + strModel.length + " bytes, with newLine character " + (newLine).charCodeAt (0) + " isAppend=" + isAppend);
J.util.Logger.debug (strModel);
var datasep = this.getDataSeparator ();
var i;
if (datasep != null && datasep !== "" && (i = strModel.indexOf (datasep)) >= 0 && strModel.indexOf ("# Jmol state") < 0) {
var n = 2;
while ((i = strModel.indexOf (datasep, i + 1)) >= 0) n++;

var strModels =  new Array (n);
var pt = 0;
var pt0 = 0;
for (i = 0; i < n; i++) {
pt = strModel.indexOf (datasep, pt0);
if (pt < 0) pt = strModel.length;
strModels[i] = strModel.substring (pt0, pt);
pt0 = pt + datasep.length;
}
return this.openStringsInline (strModels, htParams, isAppend);
}return this.openStringInlineParams (strModel, htParams, isAppend);
}, "~S,~S,~B,java.util.Map");
Clazz.defineMethod (c$, "fixInlineString", 
function (strModel, newLine) {
var i;
if (strModel.indexOf ("\\/n") >= 0) {
strModel = J.util.TextFormat.simpleReplace (strModel, "\n", "");
strModel = J.util.TextFormat.simpleReplace (strModel, "\\/n", "\n");
newLine = String.fromCharCode ( 0);
}if (newLine.charCodeAt (0) != 0 && newLine != '\n') {
var repEmpty = (strModel.indexOf ('\n') >= 0);
var len = strModel.length;
for (i = 0; i < len && strModel.charAt (i) == ' '; ++i) {
}
if (i < len && strModel.charAt (i) == newLine) strModel = strModel.substring (i + 1);
if (repEmpty) strModel = J.util.TextFormat.simpleReplace (strModel, "" + newLine, "");
 else strModel = strModel.$replace (newLine, '\n');
}return strModel;
}, "~S,~S");
Clazz.defineMethod (c$, "openStringInlineParams", 
($fz = function (strModel, htParams, isAppend) {
var br =  new java.io.BufferedReader ( new java.io.StringReader (strModel));
var type = this.getModelAdapter ().getFileTypeName (br);
if (type == null) return "unknown file type";
if (type.equals ("spt")) {
return "cannot open script inline";
}htParams = this.setLoadParameters (htParams, isAppend);
var loadScript = htParams.get ("loadScript");
var isLoadCommand = htParams.containsKey ("isData");
if (loadScript == null) loadScript =  new J.util.SB ();
if (!isAppend) this.zap (true, false, false);
var atomSetCollection = this.fileManager.createAtomSetCollectionFromString (strModel, loadScript, htParams, isAppend, isLoadCommand);
return this.createModelSetAndReturnError (atomSetCollection, isAppend, loadScript, null);
}, $fz.isPrivate = true, $fz), "~S,java.util.Map,~B");
Clazz.defineMethod (c$, "openStringsInline", 
($fz = function (arrayModels, htParams, isAppend) {
var loadScript =  new J.util.SB ();
if (!isAppend) this.zap (true, false, false);
var atomSetCollection = this.fileManager.createAtomSeCollectionFromStrings (arrayModels, loadScript, this.setLoadParameters (htParams, isAppend), isAppend);
return this.createModelSetAndReturnError (atomSetCollection, isAppend, loadScript, null);
}, $fz.isPrivate = true, $fz), "~A,java.util.Map,~B");
Clazz.defineMethod (c$, "getInlineChar", 
function () {
return this.global.inlineNewlineChar;
});
Clazz.defineMethod (c$, "getDataSeparator", 
function () {
return this.global.getParameter ("dataseparator");
});
Clazz.defineMethod (c$, "createModelSetAndReturnError", 
($fz = function (atomSetCollection, isAppend, loadScript, htParams) {
var fullPathName = this.fileManager.getFullPathName ();
var fileName = this.fileManager.getFileName ();
var errMsg;
if (loadScript == null) {
this.setBooleanProperty ("preserveState", false);
loadScript =  new J.util.SB ().append ("load \"???\"");
}if (Clazz.instanceOf (atomSetCollection, String)) {
errMsg = atomSetCollection;
this.setFileLoadStatus (J.constant.EnumFileStatus.NOT_LOADED, fullPathName, null, null, errMsg, null);
if (this.displayLoadErrors && !isAppend && !errMsg.equals ("#CANCELED#")) this.zapMsg (errMsg);
return errMsg;
}if (isAppend) this.clearAtomSets ();
 else if (this.getModelkitMode () && !fileName.equals ("Jmol Model Kit")) this.setModelKitMode (false);
this.setFileLoadStatus (J.constant.EnumFileStatus.CREATING_MODELSET, fullPathName, fileName, null, null, null);
this.pushHoldRepaintWhy ("createModelSet");
this.setErrorMessage (null, null);
try {
var bsNew =  new J.util.BS ();
this.modelSet = this.modelManager.createModelSet (fullPathName, fileName, loadScript, atomSetCollection, bsNew, isAppend);
if (bsNew.cardinality () > 0) {
var jmolScript = this.modelSet.getModelSetAuxiliaryInfoValue ("jmolscript");
if (this.modelSet.getModelSetAuxiliaryInfoBoolean ("doMinimize")) this.minimize (2147483647, 0, bsNew, null, 0, true, true, true);
 else this.addHydrogens (bsNew, false, true);
if (jmolScript != null) this.modelSet.getModelSetAuxiliaryInfo ().put ("jmolscript", jmolScript);
}this.initializeModel (isAppend);
} catch (er) {
if (Clazz.exceptionOf (er, Error)) {
this.handleError (er, true);
errMsg = this.getShapeErrorState ();
errMsg = ("ERROR creating model: " + er + (errMsg.length == 0 ? "" : "|" + errMsg));
this.zapMsg (errMsg);
this.setErrorMessage (errMsg, null);
} else {
throw er;
}
}
this.popHoldRepaintWhy ("createModelSet");
errMsg = this.getErrorMessage ();
this.setFileLoadStatus (J.constant.EnumFileStatus.CREATED, fullPathName, fileName, this.getModelSetName (), errMsg, htParams == null ? null : htParams.get ("async"));
if (isAppend) {
this.selectAll ();
this.setTainted (true);
this.axesAreTainted = true;
}atomSetCollection = null;
System.gc ();
return errMsg;
}, $fz.isPrivate = true, $fz), "~O,~B,J.util.SB,java.util.Map");
Clazz.defineMethod (c$, "loadAtomDataAndReturnError", 
($fz = function (atomSetCollection, tokType) {
if (Clazz.instanceOf (atomSetCollection, String)) return atomSetCollection;
this.setErrorMessage (null, null);
try {
this.modelManager.createAtomDataSet (atomSetCollection, tokType);
switch (tokType) {
case 4166:
this.setStatusFrameChanged (true);
break;
case 1649412112:
this.shapeManager.deleteVdwDependentShapes (null);
break;
}
} catch (er) {
if (Clazz.exceptionOf (er, Error)) {
this.handleError (er, true);
var errMsg = this.getShapeErrorState ();
errMsg = ("ERROR adding atom data: " + er + (errMsg.length == 0 ? "" : "|" + errMsg));
this.zapMsg (errMsg);
this.setErrorMessage (errMsg, null);
this.setParallel (false);
} else {
throw er;
}
}
return this.getErrorMessage ();
}, $fz.isPrivate = true, $fz), "~O,~N");
Clazz.overrideMethod (c$, "getEmbeddedFileState", 
function (filename) {
return this.fileManager.getEmbeddedFileState (filename);
}, "~S");
Clazz.overrideMethod (c$, "getFileAsBytes", 
function (pathName, os) {
return this.fileManager.getFileAsBytes (pathName, os, true);
}, "~S,java.io.OutputStream");
Clazz.defineMethod (c$, "getCurrentFileAsString", 
function () {
var filename = this.getFullPathName ();
if (filename.equals ("string") || filename.equals ("Jmol Model Kit")) return this.modelSet.getInlineData (this.getCurrentModelIndex ());
if (filename.indexOf ("[]") >= 0) return filename;
if (filename === "JSNode") return "<DOM NODE>";
var pathName = this.modelManager.getModelSetPathName ();
if (pathName == null) return null;
return this.getFileAsStringBin (pathName, 2147483647, true, false);
});
Clazz.defineMethod (c$, "getFullPathName", 
function () {
return this.fileManager.getFullPathName ();
});
Clazz.defineMethod (c$, "getFileName", 
function () {
return this.fileManager.getFileName ();
});
Clazz.defineMethod (c$, "getFullPathNameOrError", 
function (filename) {
return this.fileManager.getFullPathNameOrError (filename);
}, "~S");
Clazz.overrideMethod (c$, "getFileAsString", 
function (name) {
return this.getFileAsStringBin (name, 2147483647, false, false);
}, "~S");
Clazz.defineMethod (c$, "getFileAsStringBin", 
function (name, nBytesMax, doSpecialLoad, allowBinary) {
if (name == null) return this.getCurrentFileAsString ();
var data =  new Array (2);
data[0] = name;
this.getFileAsStringFM (data, nBytesMax, doSpecialLoad, allowBinary);
return data[1];
}, "~S,~N,~B,~B");
Clazz.defineMethod (c$, "getFileAsStringBin", 
function (data, nBytesMax, doSpecialLoad) {
return this.getFileAsStringFM (data, nBytesMax, doSpecialLoad, true);
}, "~A,~N,~B");
Clazz.defineMethod (c$, "getFileAsStringFM", 
($fz = function (data, nBytesMax, doSpecialLoad, allowBinary) {
return this.fileManager.getFileDataOrErrorAsString (data, nBytesMax, doSpecialLoad, allowBinary);
}, $fz.isPrivate = true, $fz), "~A,~N,~B,~B");
Clazz.defineMethod (c$, "getFilePath", 
function (name, asShortName) {
return this.fileManager.getFilePath (name, false, asShortName);
}, "~S,~B");
Clazz.defineMethod (c$, "getFileInfo", 
function () {
return this.fileManager.getFileInfo ();
});
Clazz.defineMethod (c$, "setFileInfo", 
function (fileInfo) {
this.fileManager.setFileInfo (fileInfo);
}, "~A");
Clazz.defineMethod (c$, "autoCalculate", 
function (tokProperty) {
switch (tokProperty) {
case 1112539149:
this.modelSet.getSurfaceDistanceMax ();
break;
case 1112539148:
this.modelSet.calculateStraightness ();
break;
}
}, "~N");
Clazz.defineMethod (c$, "getSurfaceDistanceMax", 
function () {
return this.modelSet.getSurfaceDistanceMax ();
});
Clazz.defineMethod (c$, "calculateStraightness", 
function () {
this.modelSet.setHaveStraightness (false);
this.modelSet.calculateStraightness ();
});
Clazz.defineMethod (c$, "calculateSurface", 
function (bsSelected, envelopeRadius) {
if (bsSelected == null) bsSelected = this.getSelectionSet (false);
if (envelopeRadius == 3.4028235E38 || envelopeRadius == -1) this.addStateScriptRet ("calculate surfaceDistance " + (envelopeRadius == 3.4028235E38 ? "FROM" : "WITHIN"), null, bsSelected, null, "", false, true);
return this.modelSet.calculateSurface (bsSelected, envelopeRadius);
}, "J.util.BS,~N");
Clazz.defineMethod (c$, "getStructureList", 
function () {
return this.global.getStructureList ();
});
Clazz.defineMethod (c$, "setStructureList", 
function (list, type) {
this.global.setStructureList (list, type);
this.modelSet.setStructureList (this.getStructureList ());
}, "~A,J.constant.EnumStructure");
Clazz.defineMethod (c$, "getDefaultStructureDSSP", 
function () {
return this.global.defaultStructureDSSP;
});
Clazz.defineMethod (c$, "getDefaultStructure", 
function (bsAtoms, bsAllAtoms) {
if (bsAtoms == null) bsAtoms = this.getSelectionSet (false);
return this.modelSet.getDefaultStructure (bsAtoms, bsAllAtoms);
}, "J.util.BS,J.util.BS");
Clazz.defineMethod (c$, "calculateStructures", 
function (bsAtoms, asDSSP, setStructure) {
if (bsAtoms == null) bsAtoms = this.getSelectionSet (false);
return this.modelSet.calculateStructures (bsAtoms, asDSSP, this.global.dsspCalcHydrogen, setStructure);
}, "J.util.BS,~B,~B");
Clazz.overrideMethod (c$, "getSelectedAtomIterator", 
function (bsSelected, isGreaterOnly, modelZeroBased, isMultiModel) {
return this.modelSet.getSelectedAtomIterator (bsSelected, isGreaterOnly, modelZeroBased, false, isMultiModel);
}, "J.util.BS,~B,~B,~B");
Clazz.overrideMethod (c$, "setIteratorForAtom", 
function (iterator, atomIndex, distance) {
this.modelSet.setIteratorForAtom (iterator, -1, atomIndex, distance, null);
}, "J.api.AtomIndexIterator,~N,~N");
Clazz.overrideMethod (c$, "setIteratorForPoint", 
function (iterator, modelIndex, pt, distance) {
this.modelSet.setIteratorForPoint (iterator, modelIndex, pt, distance);
}, "J.api.AtomIndexIterator,~N,J.util.P3,~N");
Clazz.overrideMethod (c$, "fillAtomData", 
function (atomData, mode) {
atomData.programInfo = "Jmol Version " + J.viewer.Viewer.getJmolVersion ();
atomData.fileName = this.getFileName ();
this.modelSet.fillAtomData (atomData, mode);
}, "J.atomdata.AtomData,~N");
Clazz.defineMethod (c$, "addStateScript", 
function (script, addFrameNumber, postDefinitions) {
return this.addStateScriptRet (script, null, null, null, null, addFrameNumber, postDefinitions);
}, "~S,~B,~B");
Clazz.defineMethod (c$, "addStateScriptRet", 
function (script1, bsBonds, bsAtoms1, bsAtoms2, script2, addFrameNumber, postDefinitions) {
return this.modelSet.addStateScript (script1, bsBonds, bsAtoms1, bsAtoms2, script2, addFrameNumber, postDefinitions);
}, "~S,J.util.BS,J.util.BS,J.util.BS,~S,~B,~B");
Clazz.defineMethod (c$, "getEchoStateActive", 
function () {
return this.modelSet.getEchoStateActive ();
});
Clazz.defineMethod (c$, "setEchoStateActive", 
function (TF) {
this.modelSet.setEchoStateActive (TF);
}, "~B");
Clazz.defineMethod (c$, "clearModelDependentObjects", 
($fz = function () {
this.setFrameOffsets (null);
this.stopMinimization ();
this.minimizer = null;
if (this.smilesMatcher != null) {
this.smilesMatcher = null;
}if (this.symmetry != null) {
this.symmetry = null;
}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "zap", 
function (notify, resetUndo, zapModelKit) {
this.clearThreads ();
if (this.modelSet != null) {
this.ligandModelSet = null;
this.clearModelDependentObjects ();
this.fileManager.clear ();
this.clearRepaintManager (-1);
this.animationManager.clear ();
this.transformManager.clear ();
this.selectionManager.clear ();
this.clearAllMeasurements ();
this.clearMinimization ();
this.gdata.clear ();
this.modelSet = this.modelManager.zap ();
if (this.scriptManager != null) this.scriptManager.clear (false);
if (this.haveDisplay) {
this.mouse.clear ();
this.clearTimeouts ();
this.actionManager.clear ();
}this.stateManager.clear (this.global);
this.tempArray.clear ();
this.colorManager.clear ();
this.definedAtomSets.clear ();
this.dataManager.clear ();
if (resetUndo) {
if (zapModelKit && this.isModelKitMode ()) {
this.loadInline ("1 0 C 0 0");
this.setRotationRadius (5.0, true);
this.setStringProperty ("picking", "assignAtom_C");
this.setStringProperty ("picking", "assignBond_p");
}this.undoClear ();
}System.gc ();
} else {
this.modelSet = this.modelManager.zap ();
}this.initializeModel (false);
if (notify) this.setFileLoadStatus (J.constant.EnumFileStatus.ZAPPED, null, (resetUndo ? "resetUndo" : this.getZapName ()), null, null, null);
if (J.util.Logger.debugging) J.util.Logger.checkMemory ();
}, "~B,~B,~B");
Clazz.defineMethod (c$, "zapMsg", 
($fz = function (msg) {
this.zap (true, true, false);
this.echoMessage (msg);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "echoMessage", 
function (msg) {
var iShape = 29;
this.loadShape (iShape);
this.setShapeProperty (iShape, "font", this.getFont3D ("SansSerif", "Plain", 9));
this.setShapeProperty (iShape, "target", "error");
this.setShapeProperty (iShape, "text", msg);
}, "~S");
Clazz.defineMethod (c$, "initializeModel", 
($fz = function (isAppend) {
this.clearThreads ();
if (isAppend) {
this.animationManager.initializePointers (1);
return;
}this.reset (true);
this.selectAll ();
this.rotatePrev1 = this.rotateBondIndex = -1;
this.movingSelected = false;
this.noneSelected = false;
this.hoverEnabled = true;
this.transformManager.setCenter ();
this.animationManager.initializePointers (1);
if (!this.modelSet.getModelSetAuxiliaryInfoBoolean ("isPyMOL")) {
this.clearAtomSets ();
this.setCurrentModelIndex (0);
}this.setBackgroundModelIndex (-1);
this.setFrankOn (this.getShowFrank ());
this.startHoverWatcher (true);
this.setTainted (true);
this.finalizeTransformParameters ();
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "startHoverWatcher", 
function (tf) {
if (this.haveDisplay && this.hoverEnabled) this.actionManager.startHoverWatcher (tf);
}, "~B");
Clazz.overrideMethod (c$, "getModelSetName", 
function () {
if (this.modelSet == null) return null;
return this.modelSet.modelSetName;
});
Clazz.overrideMethod (c$, "getModelSetFileName", 
function () {
return this.modelManager.getModelSetFileName ();
});
Clazz.defineMethod (c$, "getUnitCellInfoText", 
function () {
return this.modelSet.getUnitCellInfoText ();
});
Clazz.defineMethod (c$, "getUnitCellInfo", 
function (infoType) {
var symmetry = this.getCurrentUnitCell ();
if (symmetry == null) return NaN;
return symmetry.getUnitCellInfoType (infoType);
}, "~N");
Clazz.defineMethod (c$, "getSpaceGroupInfo", 
function (spaceGroup) {
return this.modelSet.getSymTemp (true).getSpaceGroupInfo (this.modelSet, -1, spaceGroup, 0, null, null, null);
}, "~S");
Clazz.defineMethod (c$, "getPolymerPointsAndVectors", 
function (bs, vList) {
this.modelSet.getPolymerPointsAndVectors (bs, vList);
}, "J.util.BS,java.util.List");
Clazz.defineMethod (c$, "getModelSetProperty", 
function (strProp) {
return this.modelSet.getModelSetProperty (strProp);
}, "~S");
Clazz.defineMethod (c$, "getModelSetAuxiliaryInfoValue", 
function (strKey) {
return this.modelSet.getModelSetAuxiliaryInfoValue (strKey);
}, "~S");
Clazz.overrideMethod (c$, "getModelSetPathName", 
function () {
return this.modelManager.getModelSetPathName ();
});
Clazz.defineMethod (c$, "getModelSetTypeName", 
function () {
return this.modelSet.getModelSetTypeName ();
});
Clazz.overrideMethod (c$, "haveFrame", 
function () {
return this.haveModelSet ();
});
Clazz.defineMethod (c$, "haveModelSet", 
function () {
return this.modelSet != null;
});
Clazz.defineMethod (c$, "clearBfactorRange", 
function () {
this.modelSet.clearBfactorRange ();
});
Clazz.defineMethod (c$, "getHybridizationAndAxes", 
function (atomIndex, z, x, lcaoType) {
return this.modelSet.getHybridizationAndAxes (atomIndex, 0, z, x, lcaoType, true, true);
}, "~N,J.util.V3,J.util.V3,~S");
Clazz.defineMethod (c$, "getMoleculeBitSet", 
function (atomIndex) {
return this.modelSet.getMoleculeBitSetForAtom (atomIndex);
}, "~N");
Clazz.defineMethod (c$, "getModelUndeletedAtomsBitSet", 
function (modelIndex) {
var bs = this.modelSet.getModelAtomBitSetIncludingDeleted (modelIndex, true);
this.excludeAtoms (bs, false);
return bs;
}, "~N");
Clazz.defineMethod (c$, "getModelBitSet", 
function (atomList, allTrajectories) {
return this.modelSet.getModelBitSet (atomList, allTrajectories);
}, "J.util.BS,~B");
Clazz.defineMethod (c$, "getModelUndeletedAtomsBitSetBs", 
function (bsModels) {
var bs = this.modelSet.getModelAtomBitSetIncludingDeletedBs (bsModels);
this.excludeAtoms (bs, false);
return bs;
}, "J.util.BS");
Clazz.defineMethod (c$, "excludeAtoms", 
function (bs, ignoreSubset) {
this.selectionManager.excludeAtoms (bs, ignoreSubset);
}, "J.util.BS,~B");
Clazz.defineMethod (c$, "getModelSet", 
function () {
return this.modelSet;
});
Clazz.defineMethod (c$, "getBoundBoxCommand", 
function (withOptions) {
return this.modelSet.getBoundBoxCommand (withOptions);
}, "~B");
Clazz.defineMethod (c$, "setBoundBox", 
function (pt1, pt2, byCorner, scale) {
this.modelSet.setBoundBox (pt1, pt2, byCorner, scale);
}, "J.util.P3,J.util.P3,~B,~N");
Clazz.overrideMethod (c$, "getBoundBoxCenter", 
function () {
return this.modelSet.getBoundBoxCenter (this.animationManager.currentModelIndex);
});
Clazz.defineMethod (c$, "getAverageAtomPoint", 
function () {
return this.modelSet.getAverageAtomPoint ();
});
Clazz.defineMethod (c$, "calcBoundBoxDimensions", 
function (bs, scale) {
this.modelSet.calcBoundBoxDimensions (bs, scale);
this.axesAreTainted = true;
}, "J.util.BS,~N");
Clazz.defineMethod (c$, "getBoxInfo", 
function (bs, scale) {
return this.modelSet.getBoxInfo (bs, scale);
}, "J.util.BS,~N");
Clazz.defineMethod (c$, "calcRotationRadius", 
function (center) {
return this.modelSet.calcRotationRadius (this.animationManager.currentModelIndex, center);
}, "J.util.P3");
Clazz.defineMethod (c$, "calcRotationRadiusBs", 
function (bs) {
return this.modelSet.calcRotationRadiusBs (bs);
}, "J.util.BS");
Clazz.overrideMethod (c$, "getBoundBoxCornerVector", 
function () {
return this.modelSet.getBoundBoxCornerVector ();
});
Clazz.defineMethod (c$, "getBoundBoxVertices", 
function () {
return this.modelSet.getBboxVertices ();
});
Clazz.defineMethod (c$, "getBoundBoxInfo", 
function () {
return this.modelSet.getBoundBoxInfo ();
});
Clazz.defineMethod (c$, "getBoundBoxModels", 
function () {
return this.modelSet.getBoundBoxModels ();
});
Clazz.defineMethod (c$, "getBoundBoxCenterX", 
function () {
return Clazz.doubleToInt (this.dimScreen.width / 2);
});
Clazz.defineMethod (c$, "getBoundBoxCenterY", 
function () {
return Clazz.doubleToInt (this.dimScreen.height / 2);
});
Clazz.overrideMethod (c$, "getModelCount", 
function () {
return this.modelSet.modelCount;
});
Clazz.defineMethod (c$, "getModelInfoAsString", 
function () {
return this.modelSet.getModelInfoAsString ();
});
Clazz.defineMethod (c$, "getSymmetryInfoAsString", 
function () {
return this.modelSet.getSymmetryInfoAsString ();
});
Clazz.defineMethod (c$, "getSymmetryOperation", 
function (spaceGroup, symop, pt1, pt2, labelOnly) {
return this.modelSet.getSymmetryOperation (this.animationManager.currentModelIndex, spaceGroup, symop, pt1, pt2, null, labelOnly);
}, "~S,~N,J.util.P3,J.util.P3,~B");
Clazz.overrideMethod (c$, "getModelSetProperties", 
function () {
return this.modelSet.getModelSetProperties ();
});
Clazz.overrideMethod (c$, "getModelSetAuxiliaryInfo", 
function () {
return this.modelSet.getModelSetAuxiliaryInfo ();
});
Clazz.overrideMethod (c$, "getModelNumber", 
function (modelIndex) {
if (modelIndex < 0) return modelIndex;
return this.modelSet.getModelNumber (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "getModelFileNumber", 
function (modelIndex) {
if (modelIndex < 0) return 0;
return this.modelSet.getModelFileNumber (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "getModelNumberDotted", 
function (modelIndex) {
return modelIndex < 0 ? "0" : this.modelSet == null ? null : this.modelSet.getModelNumberDotted (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "getModelName", 
function (modelIndex) {
return this.modelSet == null ? null : this.modelSet.getModelName (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "getModelProperties", 
function (modelIndex) {
return this.modelSet.getModelProperties (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "getModelProperty", 
function (modelIndex, propertyName) {
return this.modelSet.getModelProperty (modelIndex, propertyName);
}, "~N,~S");
Clazz.defineMethod (c$, "getModelFileInfo", 
function () {
return this.getPropertyManager ().getModelFileInfo (this.getVisibleFramesBitSet ());
});
Clazz.defineMethod (c$, "getModelFileInfoAll", 
function () {
return this.getPropertyManager ().getModelFileInfo (null);
});
Clazz.overrideMethod (c$, "getModelAuxiliaryInfo", 
function (modelIndex) {
return this.modelSet.getModelAuxiliaryInfo (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "getModelAuxiliaryInfoValue", 
function (modelIndex, keyName) {
return this.modelSet.getModelAuxiliaryInfoValue (modelIndex, keyName);
}, "~N,~S");
Clazz.defineMethod (c$, "getModelNumberIndex", 
function (modelNumber, useModelNumber, doSetTrajectory) {
return this.modelSet.getModelNumberIndex (modelNumber, useModelNumber, doSetTrajectory);
}, "~N,~B,~B");
Clazz.defineMethod (c$, "modelSetHasVibrationVectors", 
function () {
return this.modelSet.modelSetHasVibrationVectors ();
});
Clazz.overrideMethod (c$, "modelHasVibrationVectors", 
function (modelIndex) {
return this.modelSet.modelHasVibrationVectors (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "getChainCount", 
function () {
return this.modelSet.getChainCount (true);
});
Clazz.overrideMethod (c$, "getChainCountInModel", 
function (modelIndex) {
return this.modelSet.getChainCountInModel (modelIndex, false);
}, "~N");
Clazz.defineMethod (c$, "getChainCountInModelWater", 
function (modelIndex, countWater) {
return this.modelSet.getChainCountInModel (modelIndex, countWater);
}, "~N,~B");
Clazz.overrideMethod (c$, "getGroupCount", 
function () {
return this.modelSet.getGroupCount ();
});
Clazz.overrideMethod (c$, "getGroupCountInModel", 
function (modelIndex) {
return this.modelSet.getGroupCountInModel (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "getPolymerCount", 
function () {
return this.modelSet.getBioPolymerCount ();
});
Clazz.overrideMethod (c$, "getPolymerCountInModel", 
function (modelIndex) {
return this.modelSet.getBioPolymerCountInModel (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "getAtomCount", 
function () {
return this.modelSet.getAtomCount ();
});
Clazz.overrideMethod (c$, "getAtomCountInModel", 
function (modelIndex) {
return this.modelSet.getAtomCountInModel (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "getBondCount", 
function () {
return this.modelSet.bondCount;
});
Clazz.overrideMethod (c$, "getBondCountInModel", 
function (modelIndex) {
return this.modelSet.getBondCountInModel (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "getBondsForSelectedAtoms", 
function (bsAtoms) {
return this.modelSet.getBondsForSelectedAtoms (bsAtoms, this.global.bondModeOr || J.util.BSUtil.cardinalityOf (bsAtoms) == 1);
}, "J.util.BS");
Clazz.defineMethod (c$, "frankClicked", 
function (x, y) {
return !this.global.disablePopupMenu && this.getShowFrank () && this.shapeManager.checkFrankclicked (x, y);
}, "~N,~N");
Clazz.defineMethod (c$, "frankClickedModelKit", 
function (x, y) {
return !this.global.disablePopupMenu && this.isModelKitMode () && x >= 0 && y >= 0 && x < 40 && y < 80;
}, "~N,~N");
Clazz.overrideMethod (c$, "findNearestAtomIndex", 
function (x, y) {
return this.findNearestAtomIndexMovable (x, y, false);
}, "~N,~N");
Clazz.defineMethod (c$, "findNearestAtomIndexMovable", 
function (x, y, mustBeMovable) {
return (this.modelSet == null || !this.getAtomPicking () ? -1 : this.modelSet.findNearestAtomIndex (x, y, mustBeMovable ? this.selectionManager.getMotionFixedAtoms () : null));
}, "~N,~N,~B");
Clazz.defineMethod (c$, "findAtomsInRectangle", 
function (rect) {
return this.modelSet.findAtomsInRectangle (rect, this.getVisibleFramesBitSet ());
}, "J.util.Rectangle");
Clazz.defineMethod (c$, "toCartesian", 
function (pt, asAbsolute) {
var unitCell = this.getCurrentUnitCell ();
if (unitCell != null) unitCell.toCartesian (pt, asAbsolute);
}, "J.util.P3,~B");
Clazz.defineMethod (c$, "toFractional", 
function (pt, asAbsolute) {
var unitCell = this.getCurrentUnitCell ();
if (unitCell != null) unitCell.toFractional (pt, asAbsolute);
}, "J.util.P3,~B");
Clazz.defineMethod (c$, "toUnitCell", 
function (pt, offset) {
var unitCell = this.getCurrentUnitCell ();
if (unitCell != null) unitCell.toUnitCell (pt, offset);
}, "J.util.P3,J.util.P3");
Clazz.defineMethod (c$, "setCurrentCage", 
function (isosurfaceId) {
var data = [isosurfaceId, null];
this.shapeManager.getShapePropertyData (23, "unitCell", data);
this.modelSet.setModelCage (this.getCurrentModelIndex (), data[1]);
}, "~S");
Clazz.defineMethod (c$, "setCurrentCagePts", 
function (points) {
this.modelSet.setModelCage (this.getCurrentModelIndex (), this.getSymmetry ().getUnitCell (points));
}, "~A");
Clazz.defineMethod (c$, "setCurrentUnitCellOffset", 
function (ijk) {
this.modelSet.setUnitCellOffset (this.animationManager.currentModelIndex, null, ijk);
}, "~N");
Clazz.defineMethod (c$, "setCurrentUnitCellOffsetPt", 
function (pt) {
this.modelSet.setUnitCellOffset (this.animationManager.currentModelIndex, pt, 0);
}, "J.util.P3");
Clazz.defineMethod (c$, "getFractionalRelative", 
function () {
return this.global.fractionalRelative;
});
Clazz.defineMethod (c$, "addUnitCellOffset", 
function (pt) {
var unitCell = this.getCurrentUnitCell ();
if (unitCell == null) return;
pt.add (unitCell.getCartesianOffset ());
}, "J.util.P3");
Clazz.defineMethod (c$, "setAtomData", 
function (type, name, coordinateData, isDefault) {
this.modelSet.setAtomData (type, name, coordinateData, isDefault);
this.refreshMeasures (true);
}, "~N,~S,~S,~B");
Clazz.overrideMethod (c$, "setCenterSelected", 
function () {
this.setCenterBitSet (this.getSelectionSet (false), true);
});
Clazz.defineMethod (c$, "getApplySymmetryToBonds", 
function () {
return this.global.applySymmetryToBonds;
});
Clazz.defineMethod (c$, "setApplySymmetryToBonds", 
function (TF) {
this.global.applySymmetryToBonds = TF;
}, "~B");
Clazz.overrideMethod (c$, "setBondTolerance", 
function (bondTolerance) {
this.global.setF ("bondTolerance", bondTolerance);
this.global.bondTolerance = bondTolerance;
}, "~N");
Clazz.overrideMethod (c$, "getBondTolerance", 
function () {
return this.global.bondTolerance;
});
Clazz.overrideMethod (c$, "setMinBondDistance", 
function (minBondDistance) {
this.global.setF ("minBondDistance", minBondDistance);
this.global.minBondDistance = minBondDistance;
}, "~N");
Clazz.overrideMethod (c$, "getMinBondDistance", 
function () {
return this.global.minBondDistance;
});
Clazz.defineMethod (c$, "getAtomIndices", 
function (bs) {
return this.modelSet.getAtomIndices (bs);
}, "J.util.BS");
Clazz.defineMethod (c$, "getAtomBits", 
function (tokType, specInfo) {
return this.modelSet.getAtomBits (tokType, specInfo);
}, "~N,~O");
Clazz.defineMethod (c$, "getSequenceBits", 
function (specInfo, bs) {
return this.modelSet.getSequenceBits (specInfo, bs);
}, "~S,J.util.BS");
Clazz.defineMethod (c$, "getAtomsNearPt", 
function (distance, coord) {
var bs =  new J.util.BS ();
this.modelSet.getAtomsWithin (distance, coord, bs, -1);
return bs;
}, "~N,J.util.P3");
Clazz.defineMethod (c$, "getAtomsNearPts", 
function (distance, points, bsInclude) {
return this.modelSet.getAtomsWithinBs (distance, points, bsInclude);
}, "~N,~A,J.util.BS");
Clazz.defineMethod (c$, "getAtomsNearPlane", 
function (distance, plane) {
return this.modelSet.getAtomsWithin (distance, plane);
}, "~N,J.util.Point4f");
Clazz.defineMethod (c$, "getAtomsWithinRadius", 
function (distance, bs, withinAllModels, rd) {
return this.modelSet.getAtomsWithinBs (distance, bs, withinAllModels, rd);
}, "~N,J.util.BS,~B,J.atomdata.RadiusData");
Clazz.defineMethod (c$, "getAtomsConnected", 
function (min, max, intType, bs) {
return this.modelSet.getAtomsConnected (min, max, intType, bs);
}, "~N,~N,~N,J.util.BS");
Clazz.defineMethod (c$, "getBranchBitSet", 
function (atomIndex, atomIndexNot) {
if (atomIndex < 0 || atomIndex >= this.getAtomCount ()) return  new J.util.BS ();
return J.util.JmolMolecule.getBranchBitSet (this.modelSet.atoms, atomIndex, this.getModelUndeletedAtomsBitSet (this.modelSet.atoms[atomIndex].modelIndex), null, atomIndexNot, true, true);
}, "~N,~N");
Clazz.defineMethod (c$, "getAtomIndexFromAtomNumber", 
function (atomNumber) {
return this.modelSet.getAtomIndexFromAtomNumber (atomNumber, this.getVisibleFramesBitSet ());
}, "~N");
Clazz.overrideMethod (c$, "getElementsPresentBitSet", 
function (modelIndex) {
return this.modelSet.getElementsPresentBitSet (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "getHeteroList", 
function (modelIndex) {
return this.modelSet.getHeteroList (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "getVisibleSet", 
function () {
return this.modelSet.getVisibleSet ();
});
Clazz.defineMethod (c$, "getClickableSet", 
function () {
return this.modelSet.getClickableSet ();
});
Clazz.defineMethod (c$, "calcSelectedGroupsCount", 
function () {
this.modelSet.calcSelectedGroupsCount (this.getSelectionSet (false));
});
Clazz.defineMethod (c$, "calcSelectedMonomersCount", 
function () {
this.modelSet.calcSelectedMonomersCount (this.getSelectionSet (false));
});
Clazz.defineMethod (c$, "calcSelectedMoleculesCount", 
function () {
this.modelSet.calcSelectedMoleculesCount (this.getSelectionSet (false));
});
Clazz.defineMethod (c$, "getFileHeader", 
function () {
return this.modelSet.getFileHeader (this.animationManager.currentModelIndex);
});
Clazz.defineMethod (c$, "getFileData", 
function () {
return this.modelSet.getFileData (this.animationManager.currentModelIndex);
});
Clazz.defineMethod (c$, "getCifData", 
function (modelIndex) {
var name = this.getModelFileName (modelIndex);
var data = this.getFileAsString (name);
if (data == null) return null;
return J.io.CifDataReader.readCifData ( new java.io.BufferedReader ( new java.io.StringReader (data)));
}, "~N");
Clazz.defineMethod (c$, "getPDBHeader", 
function () {
return this.modelSet.getPDBHeader (this.animationManager.currentModelIndex);
});
Clazz.defineMethod (c$, "getModelInfo", 
function (atomExpression) {
return this.getPropertyManager ().getModelInfo (atomExpression);
}, "~O");
Clazz.defineMethod (c$, "getLigandInfo", 
function (atomExpression) {
return this.getPropertyManager ().getLigandInfo (atomExpression);
}, "~O");
Clazz.defineMethod (c$, "getAuxiliaryInfo", 
function (atomExpression) {
return this.modelSet.getAuxiliaryInfo (this.getModelBitSet (this.getAtomBitSet (atomExpression), false));
}, "~O");
Clazz.defineMethod (c$, "getAllAtomInfo", 
function (atomExpression) {
return this.getPropertyManager ().getAllAtomInfo (this.getAtomBitSet (atomExpression));
}, "~O");
Clazz.defineMethod (c$, "getAllBondInfo", 
function (atomExpression) {
return this.getPropertyManager ().getAllBondInfo (this.getAtomBitSet (atomExpression));
}, "~O");
Clazz.defineMethod (c$, "getMoleculeInfo", 
function (atomExpression) {
return this.getPropertyManager ().getMoleculeInfo (this.modelSet, atomExpression);
}, "~O");
Clazz.defineMethod (c$, "getChimeInfo", 
function (tok) {
return this.getPropertyManager ().getChimeInfo (tok, this.getSelectionSet (true));
}, "~N");
Clazz.defineMethod (c$, "getAllChainInfo", 
function (atomExpression) {
return this.getPropertyManager ().getAllChainInfo (this.getAtomBitSet (atomExpression));
}, "~O");
Clazz.defineMethod (c$, "getAllPolymerInfo", 
function (atomExpression) {
return this.getPropertyManager ().getAllChainInfo (this.getAtomBitSet (atomExpression));
}, "~O");
Clazz.defineMethod (c$, "getStateCreator", 
function () {
if (this.sc == null) (this.sc = J.api.Interface.getOptionInterface ("viewer.StateCreator")).setViewer (this);
return this.sc;
});
Clazz.defineMethod (c$, "getWrappedState", 
function (fileName, scripts, isImage, asJmolZip, width, height) {
return this.getStateCreator ().getWrappedState (fileName, scripts, isImage, asJmolZip, width, height);
}, "~S,~A,~B,~B,~N,~N");
Clazz.overrideMethod (c$, "getStateInfo", 
function () {
return this.getStateInfo3 (null, 0, 0);
});
Clazz.defineMethod (c$, "getStateInfo3", 
function (type, width, height) {
return (this.global.preserveState ? this.getStateCreator ().getStateScript (type, width, height) : "");
}, "~S,~N,~N");
Clazz.defineMethod (c$, "getStructureState", 
function () {
return this.getStateCreator ().getModelState (null, false, true);
});
Clazz.defineMethod (c$, "getProteinStructureState", 
function () {
return this.modelSet.getProteinStructureState (this.getSelectionSet (false), false, false, 3);
});
Clazz.defineMethod (c$, "getCoordinateState", 
function (bsSelected) {
return this.getStateCreator ().getAtomicPropertyState (2, bsSelected);
}, "J.util.BS");
Clazz.defineMethod (c$, "setCurrentColorRange", 
function (label) {
var data = this.getDataFloat (label);
var bs = (data == null ? null : (this.dataManager.getData (label))[2]);
if (bs != null && this.isRangeSelected ()) bs.and (this.getSelectionSet (false));
this.setCurrentColorRangeData (data, bs);
}, "~S");
Clazz.defineMethod (c$, "setCurrentColorRangeData", 
function (data, bs) {
this.colorManager.setPropertyColorRangeData (data, bs, this.global.propertyColorScheme);
}, "~A,J.util.BS");
Clazz.defineMethod (c$, "setCurrentColorRange", 
function (min, max) {
this.colorManager.setPropertyColorRange (min, max);
}, "~N,~N");
Clazz.defineMethod (c$, "setData", 
function (type, data, arrayCount, matchField, matchFieldColumnCount, field, fieldColumnCount) {
this.dataManager.setData (type, data, arrayCount, this.getAtomCount (), matchField, matchFieldColumnCount, field, fieldColumnCount);
}, "~S,~A,~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "getData", 
function (type) {
return this.dataManager.getData (type);
}, "~S");
Clazz.defineMethod (c$, "getDataFloat", 
function (label) {
return this.dataManager.getDataFloatA (label);
}, "~S");
Clazz.defineMethod (c$, "getDataFloat2D", 
function (label) {
return this.dataManager.getDataFloat2D (label);
}, "~S");
Clazz.defineMethod (c$, "getDataFloat3D", 
function (label) {
return this.dataManager.getDataFloat3D (label);
}, "~S");
Clazz.defineMethod (c$, "getDataFloatAt", 
function (label, atomIndex) {
return this.dataManager.getDataFloat (label, atomIndex);
}, "~S,~N");
Clazz.overrideMethod (c$, "getAltLocListInModel", 
function (modelIndex) {
return this.modelSet.getAltLocListInModel (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "setConformation", 
function () {
return this.modelSet.setConformation (this.getSelectionSet (false));
});
Clazz.defineMethod (c$, "getConformation", 
function (iModel, conformationIndex, doSet) {
return this.modelSet.getConformation (iModel, conformationIndex, doSet);
}, "~N,~N,~B");
Clazz.defineMethod (c$, "autoHbond", 
function (bsFrom, bsTo, onlyIfHaveCalculated) {
if (bsFrom == null) bsFrom = bsTo = this.getSelectionSet (false);
return this.modelSet.autoHbond (bsFrom, bsTo, onlyIfHaveCalculated);
}, "J.util.BS,J.util.BS,~B");
Clazz.defineMethod (c$, "getHbondsAngleMin", 
function () {
return this.global.hbondsAngleMinimum;
});
Clazz.defineMethod (c$, "getHbondsDistanceMax", 
function () {
return this.global.hbondsDistanceMaximum;
});
Clazz.defineMethod (c$, "getHbondsRasmol", 
function () {
return this.global.hbondsRasmol;
});
Clazz.overrideMethod (c$, "havePartialCharges", 
function () {
return this.modelSet.getPartialCharges () != null;
});
Clazz.defineMethod (c$, "getCurrentUnitCell", 
function () {
return this.modelSet.getUnitCell (this.animationManager.currentModelIndex);
});
Clazz.defineMethod (c$, "getModelUnitCell", 
function (modelIndex) {
return this.modelSet.getUnitCell (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "getDefaultMeasurementLabel", 
function (nPoints) {
switch (nPoints) {
case 2:
return this.global.defaultDistanceLabel;
case 3:
return this.global.defaultAngleLabel;
default:
return this.global.defaultTorsionLabel;
}
}, "~N");
Clazz.overrideMethod (c$, "getMeasurementCount", 
function () {
var count = this.getShapePropertyAsInt (6, "count");
return count <= 0 ? 0 : count;
});
Clazz.overrideMethod (c$, "getMeasurementStringValue", 
function (i) {
var str = "" + this.getShapePropertyIndex (6, "stringValue", i);
return str;
}, "~N");
Clazz.defineMethod (c$, "getMeasurementInfo", 
function () {
return this.getShapeProperty (6, "info");
});
Clazz.defineMethod (c$, "getMeasurementInfoAsString", 
function () {
return this.getShapeProperty (6, "infostring");
});
Clazz.overrideMethod (c$, "getMeasurementCountPlusIndices", 
function (i) {
var List = this.getShapePropertyIndex (6, "countPlusIndices", i);
return List;
}, "~N");
Clazz.defineMethod (c$, "setPendingMeasurement", 
function (measurementPending) {
this.setShapeProperty (6, "pending", measurementPending);
}, "J.modelset.MeasurementPending");
Clazz.defineMethod (c$, "getPendingMeasurement", 
function () {
return this.getShapeProperty (6, "pending");
});
Clazz.defineMethod (c$, "clearAllMeasurements", 
function () {
this.setShapeProperty (6, "clear", null);
});
Clazz.overrideMethod (c$, "clearMeasurements", 
function () {
this.evalString ("measures delete");
});
Clazz.defineMethod (c$, "getJustifyMeasurements", 
function () {
return this.global.justifyMeasurements;
});
Clazz.defineMethod (c$, "setAnimation", 
function (tok) {
switch (tok) {
case 1073742098:
this.animationManager.reverseAnimation ();
case 1073742096:
case 266287:
if (!this.animationManager.animationOn) this.animationManager.resumeAnimation ();
return;
case 20487:
if (this.animationManager.animationOn && !this.animationManager.animationPaused) this.animationManager.pauseAnimation ();
return;
case 1073742037:
this.animationManager.setAnimationNext ();
return;
case 1073742108:
this.animationManager.setAnimationPrevious ();
return;
case 1073741942:
case 1073742126:
this.animationManager.rewindAnimation ();
return;
case 1073741993:
this.animationManager.setAnimationLast ();
return;
}
}, "~N");
Clazz.defineMethod (c$, "setAnimationDirection", 
function (direction) {
this.animationManager.setAnimationDirection (direction);
}, "~N");
Clazz.defineMethod (c$, "getAnimationDirection", 
function () {
return this.animationManager.animationDirection;
});
Clazz.defineMethod (c$, "getAnimationInfo", 
function () {
return this.getStateCreator ().getInfo (this.animationManager);
});
Clazz.overrideMethod (c$, "setAnimationFps", 
function (fps) {
if (fps < 1) fps = 1;
if (fps > 50) fps = 50;
this.global.setI ("animationFps", fps);
this.animationManager.setAnimationFps (fps);
}, "~N");
Clazz.overrideMethod (c$, "getAnimationFps", 
function () {
return this.animationManager.animationFps;
});
Clazz.defineMethod (c$, "setAnimationReplayMode", 
function (replayMode, firstFrameDelay, lastFrameDelay) {
this.animationManager.setAnimationReplayMode (replayMode, firstFrameDelay, lastFrameDelay);
}, "J.constant.EnumAnimationMode,~N,~N");
Clazz.defineMethod (c$, "getAnimationReplayMode", 
function () {
return this.animationManager.animationReplayMode;
});
Clazz.defineMethod (c$, "setAnimationOn", 
function (animationOn) {
var wasAnimating = this.animationManager.animationOn;
if (animationOn == wasAnimating) return;
this.animationManager.setAnimationOn (animationOn);
}, "~B");
Clazz.defineMethod (c$, "setAnimationRange", 
function (modelIndex1, modelIndex2) {
this.animationManager.setAnimationRange (modelIndex1, modelIndex2);
}, "~N,~N");
Clazz.overrideMethod (c$, "getVisibleFramesBitSet", 
function () {
return this.modelSet.selectDisplayedTrajectories (J.util.BSUtil.copy (this.animationManager.bsVisibleFrames));
});
Clazz.defineMethod (c$, "isAnimationOn", 
function () {
return this.animationManager.animationOn;
});
Clazz.defineMethod (c$, "setMovie", 
function (info) {
this.animationManager.setMovie (info);
}, "java.util.Map");
Clazz.defineMethod (c$, "setAnimMorphCount", 
function (n) {
this.animationManager.morphCount = n;
}, "~N");
Clazz.defineMethod (c$, "isMovie", 
function () {
return this.animationManager.isMovie ();
});
Clazz.defineMethod (c$, "getFrameCount", 
function () {
return this.animationManager.getFrameCount ();
});
Clazz.defineMethod (c$, "defineAtomSets", 
function (info) {
this.definedAtomSets.putAll (info);
}, "java.util.Map");
Clazz.defineMethod (c$, "morph", 
function (frame) {
this.animationManager.morph (frame);
}, "~N");
Clazz.defineMethod (c$, "setAnimDisplay", 
function (bs) {
this.animationManager.setDisplay (bs);
if (!this.isAnimationOn ()) this.animationManager.morph (this.animationManager.currentMorphFrame + 1);
}, "J.util.BS");
Clazz.defineMethod (c$, "setCurrentModelIndex", 
function (modelIndex) {
if (modelIndex == -2147483648) {
this.prevFrame = -2147483648;
this.setCurrentModelIndexClear (this.animationManager.currentModelIndex, true);
return;
}this.animationManager.setCurrentModelIndex (modelIndex, true);
}, "~N");
Clazz.defineMethod (c$, "setTrajectory", 
function (modelIndex) {
this.modelSet.setTrajectory (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "setTrajectoryBs", 
function (bsModels) {
this.modelSet.setTrajectoryBs (bsModels);
}, "J.util.BS");
Clazz.defineMethod (c$, "isTrajectory", 
function (modelIndex) {
return this.modelSet.isTrajectory (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "getBitSetTrajectories", 
function () {
return this.modelSet.getBitSetTrajectories ();
});
Clazz.defineMethod (c$, "getTrajectoryState", 
function () {
return this.getStateCreator ().getTrajectoryState ();
});
Clazz.defineMethod (c$, "setFrameOffset", 
function (modelIndex) {
this.transformManager.setFrameOffset (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "setFrameOffsets", 
function (bsAtoms) {
this.bsFrameOffsets = bsAtoms;
this.transformManager.setFrameOffsets (this.frameOffsets = this.modelSet.getFrameOffsets (this.bsFrameOffsets));
}, "J.util.BS");
Clazz.defineMethod (c$, "getFrameOffsets", 
function () {
return this.bsFrameOffsets;
});
Clazz.defineMethod (c$, "setCurrentModelIndexClear", 
function (modelIndex, clearBackground) {
this.animationManager.setCurrentModelIndex (modelIndex, clearBackground);
}, "~N,~B");
Clazz.defineMethod (c$, "getCurrentModelIndex", 
function () {
return this.animationManager.currentModelIndex;
});
Clazz.overrideMethod (c$, "getDisplayModelIndex", 
function () {
return this.animationManager.currentModelIndex;
});
Clazz.defineMethod (c$, "haveFileSet", 
function () {
return (this.getModelCount () > 1 && this.getModelNumber (2147483647) > 2000000);
});
Clazz.defineMethod (c$, "setBackgroundModelIndex", 
function (modelIndex) {
this.animationManager.setBackgroundModelIndex (modelIndex);
this.global.setS ("backgroundModel", this.modelSet.getModelNumberDotted (modelIndex));
}, "~N");
Clazz.defineMethod (c$, "setFrameVariables", 
function () {
this.global.setS ("_firstFrame", this.animationManager.getModelNumber (-1));
this.global.setS ("_lastFrame", this.animationManager.getModelNumber (1));
this.global.setF ("_animTimeSec", this.animationManager.getAnimRunTimeSeconds ());
});
Clazz.overrideMethod (c$, "getMotionEventNumber", 
function () {
return this.motionEventNumber;
});
Clazz.overrideMethod (c$, "setInMotion", 
function (inMotion) {
if ( new Boolean (this.wasInMotion ^ inMotion).valueOf ()) {
this.animationManager.inMotion = inMotion;
if (inMotion) {
this.startHoverWatcher (false);
++this.motionEventNumber;
} else {
this.startHoverWatcher (true);
this.refresh (3, "viewer stInMotion " + inMotion);
}this.wasInMotion = inMotion;
}}, "~B");
Clazz.defineMethod (c$, "getInMotion", 
function () {
return this.animationManager.inMotion || this.animationManager.animationOn;
});
Clazz.defineMethod (c$, "setRefreshing", 
($fz = function (TF) {
this.refreshing = TF;
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "getRefreshing", 
function () {
return this.refreshing;
});
Clazz.overrideMethod (c$, "pushHoldRepaint", 
function () {
this.pushHoldRepaintWhy (null);
});
Clazz.defineMethod (c$, "pushHoldRepaintWhy", 
function (why) {
if (this.repaintManager != null) {
this.repaintManager.pushHoldRepaint ();
}}, "~S");
Clazz.overrideMethod (c$, "popHoldRepaint", 
function () {
if (this.repaintManager != null) {
this.repaintManager.popHoldRepaint (true);
}});
Clazz.defineMethod (c$, "popHoldRepaintWhy", 
function (why) {
if (this.repaintManager != null) {
this.repaintManager.popHoldRepaint (!why.equals ("pause"));
}}, "~S");
Clazz.overrideMethod (c$, "refresh", 
function (mode, strWhy) {
if (this.repaintManager == null || !this.refreshing) return;
if (mode == 6 && this.getInMotion ()) return;
{
if (typeof Jmol == "undefined") return;
if (this.isJS2D) {
if (mode == 7)return;
if (mode > 0) this.repaintManager.repaintIfReady();
} else if (mode == 2 || mode == 7) {
this.transformManager.finalizeTransformParameters();
if (Jmol._refresh)
Jmol._refresh(this.applet, mode, strWhy,
[this.transformManager.fixedRotationCenter,
this.transformManager.getRotationQuaternion(),
this.transformManager.xTranslationFraction,
this.transformManager.yTranslationFraction,
this.transformManager.modelRadius,
this.transformManager.scalePixelsPerAngstrom,
this.transformManager.zoomPercent
]);
if (mode == 7)return;
}
}if (mode % 3 != 0 && this.statusManager.doSync ()) this.statusManager.setSync (mode == 2 ? strWhy : null);
}, "~N,~S");
Clazz.defineMethod (c$, "requestRepaintAndWait", 
function () {
if (!this.haveDisplay || this.repaintManager == null) return;
this.repaintManager.requestRepaintAndWait ();
this.setSync ();
});
Clazz.defineMethod (c$, "clearShapeRenderers", 
function () {
this.clearRepaintManager (-1);
});
Clazz.defineMethod (c$, "isRepaintPending", 
function () {
return (this.repaintManager == null ? false : this.repaintManager.isRepaintPending ());
});
Clazz.overrideMethod (c$, "notifyViewerRepaintDone", 
function () {
if (this.repaintManager != null) this.repaintManager.repaintDone ();
this.animationManager.repaintDone ();
});
Clazz.defineMethod (c$, "areAxesTainted", 
function () {
var TF = this.axesAreTainted;
this.axesAreTainted = false;
return TF;
});
Clazz.defineMethod (c$, "setMaximumSize", 
($fz = function (x) {
this.maximumSize = Math.max (x, 100);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.overrideMethod (c$, "setScreenDimension", 
function (width, height) {
height = Math.min (height, this.maximumSize);
width = Math.min (width, this.maximumSize);
if (this.isStereoDouble ()) width = Clazz.doubleToInt ((width + 1) / 2);
if (this.dimScreen.width == width && this.dimScreen.height == height) return;
this.resizeImage (width, height, false, false, true);
}, "~N,~N");
Clazz.defineMethod (c$, "getImageFontScaling", 
function () {
return this.imageFontScaling;
});
Clazz.defineMethod (c$, "resizeImage", 
function (width, height, isImageWrite, isExport, isReset) {
if (!isImageWrite && this.creatingImage) return;
if (!isExport && !isImageWrite) this.setShapeProperty (5, "clearBoxes", null);
this.antialiasDisplay = (isReset ? this.global.antialiasDisplay : isImageWrite && !isExport ? this.global.antialiasImages : false);
this.imageFontScaling = (isReset || width <= 0 ? 1 : Clazz.doubleToInt ((this.global.zoomLarge == (height > width) ? height : width) / this.getScreenDim ())) * (this.antialiasDisplay ? 2 : 1);
if (width > 0) {
this.dimScreen.width = width;
this.dimScreen.height = height;
if (!isImageWrite) {
this.global.setI ("_width", width);
this.global.setI ("_height", height);
this.setStatusResized (width, height);
}} else {
width = this.dimScreen.width;
height = this.dimScreen.height;
}this.transformManager.setScreenParameters (width, height, isImageWrite || isReset ? this.global.zoomLarge : false, this.antialiasDisplay, false, false);
this.gdata.setWindowParameters (width, height, this.antialiasDisplay);
}, "~N,~N,~B,~B,~B");
Clazz.overrideMethod (c$, "getScreenWidth", 
function () {
return this.dimScreen.width;
});
Clazz.overrideMethod (c$, "getScreenHeight", 
function () {
return this.dimScreen.height;
});
Clazz.defineMethod (c$, "getScreenDim", 
function () {
return (this.global.zoomLarge == (this.dimScreen.height > this.dimScreen.width) ? this.dimScreen.height : this.dimScreen.width);
});
Clazz.overrideMethod (c$, "generateOutputForExport", 
function (type, fileName, width, height) {
if (this.$noGraphicsAllowed || this.repaintManager == null) return null;
return this.getStateCreator ().generateOutputForExport (type, fileName, width, height);
}, "~S,~A,~N,~N");
Clazz.defineMethod (c$, "clearRepaintManager", 
($fz = function (iShape) {
if (this.repaintManager != null) this.repaintManager.clear (iShape);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.overrideMethod (c$, "renderScreenImageStereo", 
function (gLeft, gRight, width, height) {
if (this.updateWindow (width, height)) {
if (gRight == null) {
this.getScreenImageBuffer (gLeft);
} else {
this.render1 (gRight, this.getImage (true), 0, 0);
this.render1 (gLeft, this.getImage (false), 0, 0);
}}this.notifyViewerRepaintDone ();
}, "~O,~O,~N,~N");
Clazz.defineMethod (c$, "updateJS", 
function (width, height) {
{
if (this.isJS2D) {
this.renderScreenImageStereo(this.apiPlatform.context, null, width, height);
return;
}
if (this.updateWindow(width, height)){ this.render(); }
this.notifyViewerRepaintDone();
}}, "~N,~N");
Clazz.defineMethod (c$, "updateWindow", 
($fz = function (width, height) {
if (!this.refreshing || this.creatingImage) return false;
if (this.isTainted || this.getSlabEnabled ()) this.setModelVisibility ();
this.isTainted = false;
if (this.repaintManager != null) {
if (width != 0) this.setScreenDimension (width, height);
}return true;
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "renderScreenImage", 
function (g, width, height) {
this.renderScreenImageStereo (g, null, width, height);
}, "~O,~N,~N");
Clazz.defineMethod (c$, "getImage", 
($fz = function (isDouble) {
{
if (!this.isJS2D)return null;
}var image = null;
try {
this.gdata.beginRendering (this.transformManager.getStereoRotationMatrix (isDouble));
this.render ();
this.gdata.endRendering ();
image = this.gdata.getScreenImage ();
} catch (er) {
if (Clazz.exceptionOf (er, Error)) {
this.handleError (er, false);
this.setErrorMessage ("Error during rendering: " + er, null);
} else {
throw er;
}
}
return image;
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "isAntialiased", 
function () {
return this.antialiasDisplay;
});
Clazz.defineMethod (c$, "render", 
($fz = function () {
if (this.modelSet == null || !this.mustRender || !this.refreshing && !this.creatingImage || this.repaintManager == null) return;
var antialias2 = this.antialiasDisplay && this.global.antialiasTranslucent;
this.finalizeTransformParameters ();
this.shapeManager.finalizeAtoms (this.transformManager.bsSelectedAtoms, this.transformManager.ptOffset);
var minMax = this.shapeManager.transformAtoms ();
this.transformManager.bsSelectedAtoms = null;
{
if (!this.isJS2D) { this.repaintManager.renderExport("JS",
this.gdata, this.modelSet, null);
this.notifyViewerRepaintDone(); return; }
}this.repaintManager.render (this.gdata, this.modelSet, true, minMax);
if (this.gdata.setPass2 (antialias2)) {
this.transformManager.setAntialias (antialias2);
this.repaintManager.render (this.gdata, this.modelSet, false, null);
this.transformManager.setAntialias (this.antialiasDisplay);
}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getStereoImage", 
($fz = function (stereoMode) {
this.gdata.beginRendering (this.transformManager.getStereoRotationMatrix (true));
this.render ();
this.gdata.endRendering ();
this.gdata.snapshotAnaglyphChannelBytes ();
this.gdata.beginRendering (this.transformManager.getStereoRotationMatrix (false));
this.render ();
this.gdata.endRendering ();
this.gdata.applyAnaglygh (stereoMode, this.transformManager.stereoColors);
return this.gdata.getScreenImage ();
}, $fz.isPrivate = true, $fz), "J.constant.EnumStereoMode");
Clazz.defineMethod (c$, "render1", 
($fz = function (graphic, img, x, y) {
if (graphic != null && img != null) {
this.apiPlatform.drawImage (graphic, img, x, y, this.dimScreen.width, this.dimScreen.height);
}this.gdata.releaseScreenImage ();
}, $fz.isPrivate = true, $fz), "~O,~O,~N,~N");
Clazz.overrideMethod (c$, "getScreenImageBuffer", 
function (graphic) {
{
if (!this.isJS2D)return null
}{
var mergeImages = (graphic == null && this.isStereoDouble ());
var imageBuffer = (this.transformManager.stereoMode.isBiColor () ? this.getStereoImage (this.transformManager.stereoMode) : this.getImage (this.isStereoDouble ()));
var imageBuffer2 = null;
if (mergeImages) {
imageBuffer2 = this.apiPlatform.newBufferedImage (imageBuffer, this.dimScreen.width << 1, this.dimScreen.height);
graphic = this.apiPlatform.getGraphics (imageBuffer2);
}if (graphic != null) {
if (this.isStereoDouble ()) {
this.render1 (graphic, imageBuffer, this.dimScreen.width, 0);
imageBuffer = this.getImage (false);
}this.render1 (graphic, imageBuffer, 0, 0);
}return (mergeImages ? imageBuffer2 : imageBuffer);
}}, "~O");
Clazz.overrideMethod (c$, "getImageAs", 
function (type, quality, width, height, fileName, os) {
{
if (!this.isJS2D)return null
}return this.getImageAsWithComment (type, quality, width, height, fileName, null, os, "");
}, "~S,~N,~N,~N,~S,java.io.OutputStream");
Clazz.defineMethod (c$, "getImageAsWithComment", 
function (type, quality, width, height, fileName, scripts, os, comment) {
{
if (!this.isJS2D)return null
}return this.getStateCreator ().getImageAsWithComment (type, quality, width, height, fileName, scripts, os, comment);
}, "~S,~N,~N,~N,~S,~A,java.io.OutputStream,~S");
Clazz.overrideMethod (c$, "releaseScreenImage", 
function () {
this.gdata.releaseScreenImage ();
});
Clazz.defineMethod (c$, "getAllowEmbeddedScripts", 
function () {
return this.global.allowEmbeddedScripts && !this.$isPreviewOnly;
});
Clazz.overrideMethod (c$, "evalFile", 
function (strFilename) {
if (!this.allowScripting) return null;
var ptWait = strFilename.indexOf (" -noqueue");
if (ptWait >= 0) {
return this.evalStringWaitStatusQueued ("String", strFilename.substring (0, ptWait), "", true, false, false);
}return this.getScriptManager ().addScript (strFilename, true, false);
}, "~S");
Clazz.defineMethod (c$, "getInsertedCommand", 
function () {
var s = this.insertedCommand;
this.insertedCommand = "";
if (J.util.Logger.debugging && s !== "") J.util.Logger.debug ("inserting: " + s);
return s;
});
Clazz.overrideMethod (c$, "script", 
function (strScript) {
return this.evalStringQuietSync (strScript, false, true);
}, "~S");
Clazz.overrideMethod (c$, "evalString", 
function (strScript) {
return this.evalStringQuietSync (strScript, false, true);
}, "~S");
Clazz.overrideMethod (c$, "evalStringQuiet", 
function (strScript) {
return this.evalStringQuietSync (strScript, true, true);
}, "~S");
Clazz.defineMethod (c$, "evalStringQuietSync", 
function (strScript, isQuiet, allowSyncScript) {
return (this.getScriptManager () == null ? null : this.scriptManager.evalStringQuietSync (strScript, isQuiet, allowSyncScript));
}, "~S,~B,~B");
Clazz.defineMethod (c$, "usingScriptQueue", 
function () {
return this.global.useScriptQueue;
});
Clazz.defineMethod (c$, "clearScriptQueue", 
function () {
if (this.scriptManager != null) this.scriptManager.clearQueue ();
});
Clazz.defineMethod (c$, "setScriptQueue", 
($fz = function (TF) {
this.global.useScriptQueue = TF;
if (!TF) this.clearScriptQueue ();
}, $fz.isPrivate = true, $fz), "~B");
Clazz.overrideMethod (c$, "checkHalt", 
function (str, isInsert) {
return (this.scriptManager != null && this.scriptManager.checkHalt (str, isInsert));
}, "~S,~B");
Clazz.overrideMethod (c$, "scriptWait", 
function (strScript) {
return this.evalWait ("JSON", strScript, "+scriptStarted,+scriptStatus,+scriptEcho,+scriptTerminated");
}, "~S");
Clazz.overrideMethod (c$, "scriptWaitStatus", 
function (strScript, statusList) {
return this.evalWait ("object", strScript, statusList);
}, "~S,~S");
Clazz.defineMethod (c$, "evalWait", 
($fz = function (returnType, strScript, statusList) {
if (this.getScriptManager () == null) return null;
this.scriptManager.waitForQueue ();
var doTranslateTemp = J.i18n.GT.setDoTranslate (false);
var ret = this.evalStringWaitStatusQueued (returnType, strScript, statusList, false, false, false);
J.i18n.GT.setDoTranslate (doTranslateTemp);
return ret;
}, $fz.isPrivate = true, $fz), "~S,~S,~S");
Clazz.defineMethod (c$, "evalStringWaitStatusQueued", 
function (returnType, strScript, statusList, isScriptFile, isQuiet, isQueued) {
if (this.getScriptManager () == null) return null;
return this.scriptManager.evalStringWaitStatusQueued (returnType, strScript, statusList, isScriptFile, isQuiet, isQueued);
}, "~S,~S,~S,~B,~B,~B");
Clazz.defineMethod (c$, "exitJmol", 
function () {
if (this.$isApplet) return;
if (this.headlessImage != null) {
try {
var p = this.headlessImage;
if (this.isHeadless ()) this.createImage (p[0], p[1], null, (p[2]).intValue (), (p[3]).intValue (), (p[4]).intValue ());
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}J.util.Logger.debug ("exitJmol -- exiting");
System.out.flush ();
System.exit (0);
});
Clazz.defineMethod (c$, "scriptCheckRet", 
($fz = function (strScript, returnContext) {
if (this.getScriptManager () == null) return null;
return this.scriptManager.scriptCheckRet (strScript, returnContext);
}, $fz.isPrivate = true, $fz), "~S,~B");
Clazz.overrideMethod (c$, "scriptCheck", 
function (strScript) {
if (this.getScriptManager () == null) return null;
return this.scriptCheckRet (strScript, false);
}, "~S");
Clazz.overrideMethod (c$, "isScriptExecuting", 
function () {
return (this.eval != null && this.eval.isExecuting ());
});
Clazz.overrideMethod (c$, "haltScriptExecution", 
function () {
if (this.eval != null) this.eval.haltExecution ();
this.stopScriptDelayThread ();
this.setStringPropertyTok ("pathForAllFiles", 545259570, "");
this.clearTimeouts ();
});
Clazz.defineMethod (c$, "pauseScriptExecution", 
function () {
if (this.eval != null) this.eval.pauseExecution (true);
});
Clazz.defineMethod (c$, "getDefaultLoadFilter", 
function () {
return this.global.defaultLoadFilter;
});
Clazz.defineMethod (c$, "getDefaultLoadScript", 
function () {
return this.global.defaultLoadScript;
});
Clazz.defineMethod (c$, "resolveDatabaseFormat", 
function (fileName) {
if (J.viewer.Viewer.hasDatabasePrefix (fileName)) fileName = this.setLoadFormat (fileName, fileName.charAt (0), false);
return fileName;
}, "~S");
c$.isDatabaseCode = Clazz.defineMethod (c$, "isDatabaseCode", 
function (ch) {
return (ch == '$' || ch == '=' || ch == ':');
}, "~S");
c$.hasDatabasePrefix = Clazz.defineMethod (c$, "hasDatabasePrefix", 
function (fileName) {
return (fileName.length != 0 && J.viewer.Viewer.isDatabaseCode (fileName.charAt (0)));
}, "~S");
Clazz.defineMethod (c$, "setLoadFormat", 
function (name, type, withPrefix) {
var format;
var f = name.substring (1);
switch (type) {
case '=':
if (name.startsWith ("==")) {
f = f.substring (1);
type = '#';
} else if (f.indexOf ("/") > 0) {
try {
var pt = f.indexOf ("/");
var database = f.substring (0, pt);
f = this.global.resolveDataBase (database, f.substring (pt + 1));
return (f == null ? name : f);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return name;
} else {
throw e;
}
}
}case '#':
var s = (type == '=' ? this.global.loadFormat : this.global.loadLigandFormat);
if (f.indexOf (".") > 0 && s.indexOf ("%FILE.") >= 0) s = s.substring (0, s.indexOf ("%FILE") + 5);
return J.util.TextFormat.formatStringS (s, "FILE", f);
case ':':
format = this.global.pubChemFormat;
var fl = f.toLowerCase ();
try {
f = "cid/" + String.valueOf (Integer.$valueOf (f).intValue ());
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
if (fl.startsWith ("smiles:")) {
format += "?POST?smiles=" + f.substring (7);
f = "smiles";
} else if (fl.startsWith ("cid:")) {
f = "cid/" + f.substring (4);
} else {
if (fl.startsWith ("name:")) f = f.substring (5);
if (fl.startsWith ("cas:")) f = f.substring (4);
f = "name/" + J.util.Escape.escapeUrl (f);
}} else {
throw e;
}
}
return J.util.TextFormat.formatStringS (format, "FILE", f);
case '$':
if (name.startsWith ("$$")) {
f = f.substring (1);
format = J.util.TextFormat.simpleReplace (this.global.smilesUrlFormat, "&get3d=True", "");
return J.util.TextFormat.formatStringS (format, "FILE", J.util.Escape.escapeUrl (f));
}case 'N':
case '2':
case 'I':
case 'K':
case '/':
f = J.util.Escape.escapeUrl (f);
switch (type) {
case 'N':
format = this.global.nihResolverFormat + "/names";
break;
case '2':
format = this.global.nihResolverFormat + "/image";
break;
case 'I':
format = this.global.nihResolverFormat + "/stdinchi";
break;
case 'K':
format = this.global.nihResolverFormat + "/inchikey";
break;
case '/':
format = this.global.nihResolverFormat + "/";
break;
default:
format = this.global.smilesUrlFormat;
break;
}
return (withPrefix ? "MOL3D::" : "") + J.util.TextFormat.formatStringS (format, "FILE", f);
case '_':
var server = J.viewer.FileManager.fixFileNameVariables (this.global.edsUrlFormat, f);
var strCutoff = J.viewer.FileManager.fixFileNameVariables (this.global.edsUrlCutoff, f);
return [server, strCutoff];
}
return f;
}, "~S,~S,~B");
Clazz.defineMethod (c$, "getElectronDensityLoadInfo", 
function () {
return [this.global.edsUrlFormat, this.global.edsUrlCutoff, this.global.edsUrlOptions];
});
Clazz.defineMethod (c$, "getStandardLabelFormat", 
function (type) {
switch (type) {
default:
case 0:
return "%[identify]";
case 1:
return this.global.defaultLabelXYZ;
case 2:
return this.global.defaultLabelPDB;
}
}, "~N");
Clazz.defineMethod (c$, "getRibbonAspectRatio", 
function () {
return this.global.ribbonAspectRatio;
});
Clazz.defineMethod (c$, "getSheetSmoothing", 
function () {
return this.global.sheetSmoothing;
});
Clazz.defineMethod (c$, "getSsbondsBackbone", 
function () {
return this.global.ssbondsBackbone;
});
Clazz.defineMethod (c$, "getHbondsBackbone", 
function () {
return this.global.hbondsBackbone;
});
Clazz.defineMethod (c$, "getHbondsSolid", 
function () {
return this.global.hbondsSolid;
});
Clazz.defineMethod (c$, "getAdditionalHydrogens", 
function (bsAtoms, doAll, justCarbon, vConnections) {
if (bsAtoms == null) bsAtoms = this.getSelectionSet (false);
var nTotal =  Clazz.newIntArray (1, 0);
var pts = this.modelSet.calculateHydrogens (bsAtoms, nTotal, doAll, justCarbon, vConnections);
var points =  new Array (nTotal[0]);
for (var i = 0, pt = 0; i < pts.length; i++) if (pts[i] != null) for (var j = 0; j < pts[i].length; j++) points[pt++] = pts[i][j];


return points;
}, "J.util.BS,~B,~B,java.util.List");
Clazz.overrideMethod (c$, "setMarBond", 
function (marBond) {
this.global.bondRadiusMilliAngstroms = marBond;
this.global.setI ("bondRadiusMilliAngstroms", marBond);
this.setShapeSize (1, marBond * 2, J.util.BSUtil.setAll (this.getAtomCount ()));
}, "~N");
Clazz.defineMethod (c$, "setHoverLabel", 
function (strLabel) {
this.loadShape (33);
this.setShapeProperty (33, "label", strLabel);
this.hoverEnabled = (strLabel != null);
}, "~S");
Clazz.defineMethod (c$, "hoverOn", 
function (atomIndex, action) {
this.setStatusAtomHovered (atomIndex, this.getAtomInfoXYZ (atomIndex, false));
if (!this.hoverEnabled) return;
if (this.isModelKitMode ()) {
if (this.isAtomAssignable (atomIndex)) this.highlight (J.util.BSUtil.newAndSetBit (atomIndex));
this.refresh (3, "hover on atom");
return;
}if (this.eval != null && this.isScriptExecuting () || atomIndex == this.hoverAtomIndex || this.global.hoverDelayMs == 0) return;
if (!this.isInSelectionSubset (atomIndex)) return;
this.loadShape (33);
if (this.isBound (action, 30) && this.getPickingMode () == 2 && this.modelSet.atoms[atomIndex].isShapeVisible (J.viewer.JC.getShapeVisibilityFlag (5))) {
this.setShapeProperty (33, "specialLabel", J.i18n.GT._ ("Drag to move label"));
}this.setShapeProperty (33, "text", null);
this.setShapeProperty (33, "target", Integer.$valueOf (atomIndex));
this.hoverText = null;
this.hoverAtomIndex = atomIndex;
this.refresh (3, "hover on atom");
}, "~N,~N");
Clazz.defineMethod (c$, "getHoverDelay", 
function () {
return this.global.modelKitMode ? 20 : this.global.hoverDelayMs;
});
Clazz.defineMethod (c$, "hoverOnPt", 
function (x, y, text, id, pt) {
if (!this.hoverEnabled) return;
if (this.eval != null && this.isScriptExecuting ()) return;
this.loadShape (33);
this.setShapeProperty (33, "xy", J.util.P3i.new3 (x, y, 0));
this.setShapeProperty (33, "target", null);
this.setShapeProperty (33, "specialLabel", null);
this.setShapeProperty (33, "text", text);
this.hoverAtomIndex = -1;
this.hoverText = text;
if (id != null && pt != null) this.setStatusObjectHovered (id, text, pt);
this.refresh (3, "hover on point");
}, "~N,~N,~S,~S,J.util.P3");
Clazz.defineMethod (c$, "hoverOff", 
function () {
if (this.isModelKitMode ()) this.highlight (null);
if (!this.hoverEnabled) return;
var isHover = (this.hoverText != null || this.hoverAtomIndex >= 0);
if (this.hoverAtomIndex >= 0) {
this.setShapeProperty (33, "target", null);
this.hoverAtomIndex = -1;
}if (this.hoverText != null) {
this.setShapeProperty (33, "text", null);
this.hoverText = null;
}this.setShapeProperty (33, "specialLabel", null);
if (isHover) this.refresh (3, "hover off");
});
Clazz.defineMethod (c$, "getBfactor100Hi", 
function () {
return this.modelSet.getBfactor100Hi ();
});
Clazz.defineMethod (c$, "getColix", 
function (object) {
return J.util.C.getColixO (object);
}, "~O");
Clazz.defineMethod (c$, "getRasmolSetting", 
function (tok) {
switch (tok) {
case 1613758476:
return this.global.rasmolHydrogenSetting;
case 1613758470:
return this.global.rasmolHeteroSetting;
}
return false;
}, "~N");
Clazz.defineMethod (c$, "getDebugScript", 
function () {
return this.global.debugScript;
});
Clazz.overrideMethod (c$, "setDebugScript", 
function (debugScript) {
this.global.debugScript = debugScript;
this.global.setB ("debugScript", debugScript);
if (this.eval != null) this.eval.setDebugging ();
}, "~B");
Clazz.defineMethod (c$, "clearClickCount", 
function () {
this.setTainted (true);
});
Clazz.defineMethod (c$, "getCursor", 
function () {
return this.currentCursor;
});
Clazz.defineMethod (c$, "setCursor", 
function (cursor) {
if (this.$isKiosk || this.currentCursor == cursor || this.multiTouch || !this.haveDisplay) return;
this.apiPlatform.setCursor (this.currentCursor = cursor, this.display);
}, "~N");
Clazz.defineMethod (c$, "setPickingMode", 
function (strMode, pickingMode) {
if (!this.haveDisplay) return;
this.showSelected = false;
var option = null;
if (strMode != null) {
var pt = strMode.indexOf ("_");
if (pt >= 0) {
option = strMode.substring (pt + 1);
strMode = strMode.substring (0, pt);
}pickingMode = J.viewer.ActionManager.getPickingMode (strMode);
}if (pickingMode < 0) pickingMode = 1;
this.actionManager.setPickingMode (pickingMode);
this.global.setS ("picking", J.viewer.ActionManager.getPickingModeName (this.actionManager.getAtomPickingMode ()));
if (option == null || option.length == 0) return;
option = Character.toUpperCase (option.charAt (0)) + (option.length == 1 ? "" : option.substring (1, 2));
switch (pickingMode) {
case 32:
this.setAtomPickingOption (option);
break;
case 33:
this.setBondPickingOption (option);
break;
default:
J.util.Logger.error ("Bad picking mode: " + strMode + "_" + option);
}
}, "~S,~N");
Clazz.defineMethod (c$, "getPickingMode", 
function () {
return (this.haveDisplay ? this.actionManager.getAtomPickingMode () : 0);
});
Clazz.defineMethod (c$, "getDrawPicking", 
function () {
return this.global.drawPicking;
});
Clazz.defineMethod (c$, "isModelKitMode", 
function () {
return this.global.modelKitMode;
});
Clazz.defineMethod (c$, "getBondPicking", 
function () {
return this.global.bondPicking || this.global.modelKitMode;
});
Clazz.defineMethod (c$, "getAtomPicking", 
($fz = function () {
return this.global.atomPicking;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setPickingStyle", 
function (style, pickingStyle) {
if (!this.haveDisplay) return;
if (style != null) pickingStyle = J.viewer.ActionManager.getPickingStyle (style);
if (pickingStyle < 0) pickingStyle = 0;
this.actionManager.setPickingStyle (pickingStyle);
this.global.setS ("pickingStyle", J.viewer.ActionManager.getPickingStyleName (this.actionManager.getPickingStyle ()));
}, "~S,~N");
Clazz.defineMethod (c$, "getDrawHover", 
function () {
return this.haveDisplay && this.global.drawHover;
});
Clazz.overrideMethod (c$, "getAtomInfo", 
function (atomOrPointIndex) {
return (atomOrPointIndex >= 0 ? this.modelSet.getAtomInfo (atomOrPointIndex, null) : this.shapeManager.getShapePropertyIndex (6, "pointInfo", -atomOrPointIndex));
}, "~N");
Clazz.defineMethod (c$, "getAtomInfoXYZ", 
function (atomIndex, useChimeFormat) {
return this.modelSet.getAtomInfoXYZ (atomIndex, useChimeFormat);
}, "~N,~B");
Clazz.defineMethod (c$, "setSync", 
($fz = function () {
if (this.statusManager.doSync ()) this.statusManager.setSync (null);
}, $fz.isPrivate = true, $fz));
Clazz.overrideMethod (c$, "setJmolCallbackListener", 
function (jmolCallbackListener) {
this.statusManager.setJmolCallbackListener (jmolCallbackListener);
}, "J.api.JmolCallbackListener");
Clazz.overrideMethod (c$, "setJmolStatusListener", 
function (jmolStatusListener) {
this.statusManager.setJmolStatusListener (jmolStatusListener, null);
}, "J.api.JmolStatusListener");
Clazz.defineMethod (c$, "getMessageQueue", 
function () {
return this.statusManager.getMessageQueue ();
});
Clazz.defineMethod (c$, "getStatusChanged", 
function (statusNameList) {
return this.statusManager.getStatusChanged (statusNameList);
}, "~S");
Clazz.defineMethod (c$, "menuEnabled", 
function () {
return (!this.global.disablePopupMenu && this.getPopupMenu () != null);
});
Clazz.defineMethod (c$, "popupMenu", 
function (x, y, type) {
if (!this.haveDisplay || !this.refreshing || this.$isPreviewOnly || this.global.disablePopupMenu) return;
switch (type) {
case 'j':
try {
this.getPopupMenu ();
this.jmolpopup.jpiShow (x, y);
} catch (e) {
this.global.disablePopupMenu = true;
}
break;
case 'a':
case 'b':
case 'm':
this.modelkitPopup = this.apiPlatform.getMenuPopup (this, null, type);
if (this.modelkitPopup != null) this.modelkitPopup.jpiShow (x, y);
break;
}
}, "~N,~N,~S");
Clazz.defineMethod (c$, "getMenu", 
function (type) {
this.getPopupMenu ();
if (type.equals ("\0")) {
this.popupMenu (this.dimScreen.width - 120, 0, 'j');
return "OK";
}return (this.jmolpopup == null ? "" : this.jmolpopup.jpiGetMenuAsString ("Jmol version " + J.viewer.Viewer.getJmolVersion () + "|_GET_MENU|" + type));
}, "~S");
Clazz.defineMethod (c$, "getPopupMenu", 
($fz = function () {
if (this.jmolpopup == null) {
this.jmolpopup = (this.allowScripting ? this.apiPlatform.getMenuPopup (this, this.menuStructure, 'j') : null);
if (this.jmolpopup == null) {
this.global.disablePopupMenu = true;
return null;
}}return this.jmolpopup.jpiGetMenuAsObject ();
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "setMenu", 
function (fileOrText, isFile) {
if (isFile) J.util.Logger.info ("Setting menu " + (fileOrText.length == 0 ? "to Jmol defaults" : "from file " + fileOrText));
if (fileOrText.length == 0) fileOrText = null;
 else if (isFile) fileOrText = this.getFileAsString (fileOrText);
this.getProperty ("DATA_API", "setMenu", fileOrText);
this.statusManager.setCallbackFunction ("menu", fileOrText);
}, "~S,~B");
Clazz.defineMethod (c$, "setStatusFrameChanged", 
function (isVib) {
if (isVib) {
this.prevFrame = -2147483648;
}var frameNo = this.animationManager.getCurrentFrame ();
this.transformManager.setVibrationPeriod (NaN);
var firstIndex = this.animationManager.firstFrameIndex;
var lastIndex = this.animationManager.lastFrameIndex;
var isMovie = this.isMovie ();
var modelIndex = this.animationManager.currentModelIndex;
if (firstIndex == lastIndex && !isMovie) modelIndex = firstIndex;
var frameID = this.getModelFileNumber (modelIndex);
var currentFrame = this.animationManager.getCurrentFrame ();
var fileNo = frameID;
var modelNo = frameID % 1000000;
var firstNo = (isMovie ? firstIndex : this.getModelFileNumber (firstIndex));
var lastNo = (isMovie ? lastIndex : this.getModelFileNumber (lastIndex));
var strModelNo;
if (isMovie) {
strModelNo = "" + (frameNo + 1);
} else if (fileNo == 0) {
strModelNo = this.getModelNumberDotted (firstIndex);
if (firstIndex != lastIndex) strModelNo += " - " + this.getModelNumberDotted (lastIndex);
if (Clazz.doubleToInt (firstNo / 1000000) == Clazz.doubleToInt (lastNo / 1000000)) fileNo = firstNo;
} else {
strModelNo = this.getModelNumberDotted (modelIndex);
}if (fileNo != 0) fileNo = (fileNo < 1000000 ? 1 : Clazz.doubleToInt (fileNo / 1000000));
if (!isMovie) {
this.global.setI ("_currentFileNumber", fileNo);
this.global.setI ("_currentModelNumberInFile", modelNo);
}this.global.setI ("_currentFrame", currentFrame);
this.global.setI ("_morphCount", this.animationManager.morphCount);
this.global.setF ("_currentMorphFrame", this.animationManager.currentMorphFrame);
this.global.setI ("_frameID", frameID);
this.global.setS ("_modelNumber", strModelNo);
this.global.setS ("_modelName", (modelIndex < 0 ? "" : this.getModelName (modelIndex)));
this.global.setS ("_modelTitle", (modelIndex < 0 ? "" : this.getModelTitle (modelIndex)));
this.global.setS ("_modelFile", (modelIndex < 0 ? "" : this.getModelFileName (modelIndex)));
if (currentFrame == this.prevFrame) return;
this.prevFrame = currentFrame;
var entryName;
if (isMovie) {
entryName = "" + (this.animationManager.getCurrentFrame () + 1);
} else {
entryName = this.getModelName (frameNo);
var script = "" + this.getModelNumberDotted (frameNo);
if (!entryName.equals (script)) entryName = script + ": " + entryName;
if (entryName.length > 50) entryName = entryName.substring (0, 45) + "...";
}this.statusManager.setStatusFrameChanged (frameNo, fileNo, modelNo, (this.animationManager.animationDirection < 0 ? -firstNo : firstNo), (this.animationManager.currentDirection < 0 ? -lastNo : lastNo), currentFrame, entryName);
if (this.doHaveJDX ()) this.getJSV ().setModel (modelIndex);
}, "~B");
Clazz.defineMethod (c$, "doHaveJDX", 
($fz = function () {
return (this.haveJDX || (this.haveJDX = this.getBooleanProperty ("_jspecview")));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getJSV", 
($fz = function () {
if (this.jsv == null) {
this.jsv = J.api.Interface.getOptionInterface ("viewer.JSpecView");
this.jsv.setViewer (this);
}return this.jsv;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getJDXBaseModelIndex", 
function (modelIndex) {
if (!this.doHaveJDX ()) return modelIndex;
return this.getJSV ().getBaseModelIndex (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "getJspecViewProperties", 
function (myParam) {
var o = this.statusManager.getJspecViewProperties ("" + myParam);
if (o != null) this.haveJDX = true;
return o;
}, "~O");
Clazz.defineMethod (c$, "scriptEcho", 
function (strEcho) {
if (!J.util.Logger.isActiveLevel (4)) return;
{
System.out.println(strEcho);
}this.statusManager.setScriptEcho (strEcho, this.isScriptQueued ());
if (this.listCommands && strEcho != null && strEcho.indexOf ("$[") == 0) J.util.Logger.info (strEcho);
}, "~S");
Clazz.defineMethod (c$, "isScriptQueued", 
($fz = function () {
return this.scriptManager != null && this.scriptManager.isScriptQueued ();
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "notifyError", 
function (errType, errMsg, errMsgUntranslated) {
this.global.setS ("_errormessage", errMsgUntranslated);
this.statusManager.notifyError (errType, errMsg, errMsgUntranslated);
}, "~S,~S,~S");
Clazz.defineMethod (c$, "jsEval", 
function (strEval) {
return this.statusManager.jsEval (strEval);
}, "~S");
Clazz.defineMethod (c$, "setStatusAtomHovered", 
function (atomIndex, info) {
this.global.setI ("_atomhovered", atomIndex);
this.statusManager.setStatusAtomHovered (atomIndex, info);
}, "~N,~S");
Clazz.defineMethod (c$, "setStatusObjectHovered", 
function (id, info, pt) {
this.global.setS ("_objecthovered", id);
this.statusManager.setStatusObjectHovered (id, info, pt);
}, "~S,~S,J.util.P3");
Clazz.defineMethod (c$, "setFileLoadStatus", 
($fz = function (ptLoad, fullPathName, fileName, modelName, strError, isAsync) {
this.setErrorMessage (strError, null);
this.global.setI ("_loadPoint", ptLoad.getCode ());
var doCallback = (ptLoad !== J.constant.EnumFileStatus.CREATING_MODELSET);
this.statusManager.setFileLoadStatus (fullPathName, fileName, modelName, strError, ptLoad.getCode (), doCallback, isAsync);
if (doCallback && this.doHaveJDX ()) this.getJSV ().setModel (this.getCurrentModelIndex ());
}, $fz.isPrivate = true, $fz), "J.constant.EnumFileStatus,~S,~S,~S,~S,Boolean");
Clazz.defineMethod (c$, "getZapName", 
function () {
return (this.getModelkitMode () ? "Jmol Model Kit" : "zapped");
});
Clazz.defineMethod (c$, "setStatusMeasuring", 
function (status, intInfo, strMeasure, value) {
this.statusManager.setStatusMeasuring (status, intInfo, strMeasure, value);
}, "~S,~N,~S,~N");
Clazz.defineMethod (c$, "notifyMinimizationStatus", 
function () {
var step = this.getParameter ("_minimizationStep");
var ff = this.getParameter ("_minimizationForceField");
this.statusManager.notifyMinimizationStatus (this.getParameter ("_minimizationStatus"), Clazz.instanceOf (step, String) ? Integer.$valueOf (0) : step, this.getParameter ("_minimizationEnergy"), (step.toString ().equals ("0") ? Float.$valueOf (0) : this.getParameter ("_minimizationEnergyDiff")), ff);
});
Clazz.defineMethod (c$, "setStatusAtomPicked", 
function (atomIndex, info) {
if (info == null) {
info = this.global.pickLabel;
if (info.length == 0) info = this.getAtomInfoXYZ (atomIndex, this.getMessageStyleChime ());
 else info = this.modelSet.getAtomInfo (atomIndex, info);
}this.global.setPicked (atomIndex);
this.global.setS ("_pickinfo", info);
this.statusManager.setStatusAtomPicked (atomIndex, info);
var syncMode = this.statusManager.getSyncMode ();
if (syncMode != 1 || !this.doHaveJDX ()) return;
this.getJSV ().atomPicked (atomIndex);
}, "~N,~S");
Clazz.defineMethod (c$, "setStatusResized", 
function (width, height) {
this.statusManager.setStatusResized (width, height);
}, "~N,~N");
Clazz.defineMethod (c$, "scriptStatus", 
function (strStatus) {
this.setScriptStatus (strStatus, "", 0, null);
}, "~S");
Clazz.defineMethod (c$, "scriptStatusMsg", 
function (strStatus, statusMessage) {
this.setScriptStatus (strStatus, statusMessage, 0, null);
}, "~S,~S");
Clazz.defineMethod (c$, "setScriptStatus", 
function (strStatus, statusMessage, msWalltime, strErrorMessageUntranslated) {
this.statusManager.setScriptStatus (strStatus, statusMessage, msWalltime, strErrorMessageUntranslated);
}, "~S,~S,~N,~S");
Clazz.defineMethod (c$, "getModelTitle", 
($fz = function (modelIndex) {
return this.modelSet == null ? null : this.modelSet.getModelTitle (modelIndex);
}, $fz.isPrivate = true, $fz), "~N");
Clazz.overrideMethod (c$, "getModelFileName", 
function (modelIndex) {
return this.modelSet == null ? null : this.modelSet.getModelFileName (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "dialogAsk", 
function (type, fileName) {
{
return prompt(type, fileName);
}}, "~S,~S");
Clazz.defineMethod (c$, "getScriptDelay", 
function () {
return this.global.scriptDelay;
});
Clazz.overrideMethod (c$, "showUrl", 
function (urlString) {
if (urlString == null) return;
if (urlString.indexOf (":") < 0) {
var base = this.fileManager.getAppletDocumentBase ();
if (base === "") base = this.fileManager.getFullPathName ();
if (base.indexOf ("/") >= 0) {
base = base.substring (0, base.lastIndexOf ("/") + 1);
} else if (base.indexOf ("\\") >= 0) {
base = base.substring (0, base.lastIndexOf ("\\") + 1);
}urlString = base + urlString;
}J.util.Logger.info ("showUrl:" + urlString);
this.statusManager.showUrl (urlString);
}, "~S");
Clazz.defineMethod (c$, "setMeshCreator", 
function (meshCreator) {
this.loadShape (23);
this.setShapeProperty (23, "meshCreator", meshCreator);
}, "~O");
Clazz.defineMethod (c$, "showConsole", 
function (showConsole) {
if (!this.haveDisplay) return;
try {
if (this.appConsole == null && showConsole) this.getProperty ("DATA_API", "getAppConsole", Boolean.TRUE);
this.appConsole.setVisible (true);
} catch (e) {
}
}, "~B");
Clazz.defineMethod (c$, "clearConsole", 
function () {
this.statusManager.clearConsole ();
});
Clazz.defineMethod (c$, "getParameterEscaped", 
function (key) {
return this.global.getParameterEscaped (key, 0);
}, "~S");
Clazz.overrideMethod (c$, "getParameter", 
function (key) {
return this.global.getParameter (key);
}, "~S");
Clazz.defineMethod (c$, "getOrSetNewVariable", 
function (key, doSet) {
return this.global.getOrSetNewVariable (key, doSet);
}, "~S,~B");
Clazz.defineMethod (c$, "setUserVariable", 
function (name, value) {
return this.global.setUserVariable (name, value);
}, "~S,J.script.SV");
Clazz.defineMethod (c$, "unsetProperty", 
function (key) {
key = key.toLowerCase ();
if (key.equals ("all") || key.equals ("variables")) this.fileManager.setPathForAllFiles ("");
this.global.unsetUserVariable (key);
}, "~S");
Clazz.defineMethod (c$, "getVariableList", 
function () {
return this.global.getVariableList ();
});
Clazz.overrideMethod (c$, "getBooleanProperty", 
function (key) {
key = key.toLowerCase ();
if (this.global.htBooleanParameterFlags.containsKey (key)) return this.global.htBooleanParameterFlags.get (key).booleanValue ();
if (key.endsWith ("p!")) {
if (this.actionManager == null) return false;
var s = this.actionManager.getPickingState ().toLowerCase ();
key = key.substring (0, key.length - 2) + ";";
return (s.indexOf (key) >= 0);
}if (key.equalsIgnoreCase ("__appletReady")) {
this.statusManager.setStatusAppletReady (this.fullName, true);
return true;
}if (key.equalsIgnoreCase ("__appletDestroyed")) {
this.statusManager.setStatusAppletReady (this.htmlName, false);
return true;
}if (key.equalsIgnoreCase ("executionPaused")) return (this.eval != null && this.eval.isPaused ());
if (key.equalsIgnoreCase ("executionStepping")) return (this.eval != null && this.eval.isStepping ());
if (key.equalsIgnoreCase ("haveBFactors")) return (this.modelSet.getBFactors () != null);
if (key.equalsIgnoreCase ("colorRasmol")) return this.colorManager.getDefaultColorRasmol ();
if (key.equalsIgnoreCase ("frank")) return this.getShowFrank ();
if (key.equalsIgnoreCase ("spinOn")) return this.getSpinOn ();
if (key.equalsIgnoreCase ("isNavigating")) return this.isNavigating ();
if (key.equalsIgnoreCase ("showSelections")) return this.modelSet.getSelectionHaloEnabled ();
if (this.global.htUserVariables.containsKey (key)) {
var t = this.global.getUserVariable (key);
if (t.tok == 1048589) return true;
if (t.tok == 1048588) return false;
}J.util.Logger.error ("viewer.getBooleanProperty(" + key + ") - unrecognized");
return false;
}, "~S");
Clazz.overrideMethod (c$, "setStringProperty", 
function (key, value) {
if (value == null) return;
if (key.charAt (0) == '_') {
this.global.setS (key, value);
return;
}var tok = J.script.T.getTokFromName (key);
switch (J.script.T.getParamType (tok)) {
case 603979776:
this.setBooleanPropertyTok (key, tok, J.script.SV.newVariable (4, value).asBoolean ());
break;
case 553648128:
this.setIntPropertyTok (key, tok, J.script.SV.newVariable (4, value).asInt ());
break;
case 570425344:
this.setFloatPropertyTok (key, tok, J.util.Parser.parseFloatStr (value));
break;
default:
this.setStringPropertyTok (key, tok, value);
}
}, "~S,~S");
Clazz.defineMethod (c$, "setStringPropertyTok", 
($fz = function (key, tok, value) {
switch (tok) {
case 545259548:
this.global.defaultDropScript = value;
break;
case 545259570:
value = this.fileManager.setPathForAllFiles (value);
break;
case 545259558:
this.setUnits (value, false);
return;
case 545259560:
this.global.forceField = value;
this.minimizer = null;
break;
case 545259569:
this.global.nmrUrlFormat = value;
break;
case 545259568:
this.setUnits (value, true);
return;
case 545259566:
this.global.loadLigandFormat = value;
break;
case 545259543:
this.global.defaultLabelPDB = value;
break;
case 545259544:
this.global.defaultLabelXYZ = value;
break;
case 545259549:
this.global.defaultLoadFilter = value;
break;
case 545259567:
value = this.setLogFile (value);
if (value == null) return;
break;
case 545259559:
break;
case 545259524:
this.global.atomTypes = value;
break;
case 545259538:
break;
case 545259576:
this.global.pickLabel = value;
break;
case 545259580:
if (value.length == 2 && value.startsWith ("R")) this.global.quaternionFrame = value.substring (0, 2);
 else this.global.quaternionFrame = "" + (value.toLowerCase () + "p").charAt (0);
if (!J.util.Parser.isOneOf (this.global.quaternionFrame, "RC;RP;a;b;c;n;p;q;x;")) this.global.quaternionFrame = "p";
this.modelSet.setHaveStraightness (false);
break;
case 545259555:
this.setDefaultVdw (value);
return;
case 545259564:
 new J.i18n.GT (value);
this.language = J.i18n.GT.getLanguage ();
this.modelkitPopup = null;
if (this.jmolpopup != null) {
this.jmolpopup.jpiDispose ();
this.jmolpopup = null;
this.getPopupMenu ();
}this.statusManager.setCallbackFunction ("language", this.language);
value = J.i18n.GT.getLanguage ();
break;
case 545259565:
this.global.loadFormat = value;
break;
case 545259534:
this.setObjectColor ("background", value);
return;
case 545259528:
this.setObjectColor ("axis1", value);
return;
case 545259530:
this.setObjectColor ("axis2", value);
return;
case 545259532:
this.setObjectColor ("axis3", value);
return;
case 545259536:
this.setObjectColor ("boundbox", value);
return;
case 545259586:
this.setObjectColor ("unitcell", value);
return;
case 545259578:
this.setPropertyColorScheme (value, false, false);
break;
case 545259562:
this.setShapeProperty (33, "atomLabel", value);
break;
case 545259547:
this.global.defaultDistanceLabel = value;
break;
case 545259542:
this.global.defaultAngleLabel = value;
break;
case 545259554:
this.global.defaultTorsionLabel = value;
break;
case 545259550:
this.global.defaultLoadScript = value;
break;
case 545259522:
this.fileManager.setAppletProxy (value);
break;
case 545259546:
if (value == null) value = "";
value = value.$replace ('\\', '/');
this.global.defaultDirectory = value;
break;
case 545259561:
this.global.helpPath = value;
break;
case 545259552:
if (!value.equalsIgnoreCase ("RasMol")) value = "Jmol";
this.setDefaultsType (value);
break;
case 545259545:
this.setDefaultColors (value.equalsIgnoreCase ("rasmol"));
return;
case 545259572:
this.setPickingMode (value, 0);
return;
case 545259574:
this.setPickingStyle (value, 0);
return;
case 545259540:
break;
default:
if (key.toLowerCase ().endsWith ("callback")) {
this.statusManager.setCallbackFunction (key, (value.length == 0 || value.equalsIgnoreCase ("none") ? null : value));
break;
}if (!this.global.htNonbooleanParameterValues.containsKey (key.toLowerCase ())) {
this.global.setUserVariable (key, J.script.SV.newVariable (4, value));
return;
}break;
}
this.global.setS (key, value);
}, $fz.isPrivate = true, $fz), "~S,~N,~S");
Clazz.overrideMethod (c$, "setFloatProperty", 
function (key, value) {
if (Float.isNaN (value)) return;
if (key.charAt (0) == '_') {
this.global.setF (key, value);
return;
}var tok = J.script.T.getTokFromName (key);
switch (J.script.T.getParamType (tok)) {
case 545259520:
this.setStringPropertyTok (key, tok, "" + value);
break;
case 603979776:
this.setBooleanPropertyTok (key, tok, value != 0);
break;
case 553648128:
this.setIntPropertyTok (key, tok, Clazz.floatToInt (value));
break;
default:
this.setFloatPropertyTok (key, tok, value);
}
}, "~S,~N");
Clazz.defineMethod (c$, "setFloatPropertyTok", 
($fz = function (key, tok, value) {
switch (tok) {
case 570425368:
this.global.multipleBondRadiusFactor = value;
break;
case 570425369:
this.global.multipleBondSpacing = value;
break;
case 570425393:
this.transformManager.setSlabRange (value);
break;
case 570425365:
this.global.minimizationCriterion = value;
break;
case 570425359:
if (this.haveDisplay) this.actionManager.setGestureSwipeFactor (value);
break;
case 570425366:
if (this.haveDisplay) this.actionManager.setMouseDragFactor (value);
break;
case 570425367:
if (this.haveDisplay) this.actionManager.setMouseWheelFactor (value);
break;
case 570425408:
this.global.strutLengthMaximum = value;
break;
case 570425406:
this.global.strutDefaultRadius = value;
break;
case 570425376:
this.setSpin ("X", Clazz.floatToInt (value));
break;
case 570425378:
this.setSpin ("Y", Clazz.floatToInt (value));
break;
case 570425380:
this.setSpin ("Z", Clazz.floatToInt (value));
break;
case 570425370:
if (Float.isNaN (value)) return;
this.setSpin ("FPS", Clazz.floatToInt (value));
break;
case 570425363:
this.global.loadAtomDataTolerance = value;
break;
case 570425360:
this.global.hbondsAngleMinimum = value;
break;
case 570425361:
this.global.hbondsDistanceMaximum = value;
break;
case 570425382:
this.global.pointGroupDistanceTolerance = value;
break;
case 570425384:
this.global.pointGroupLinearTolerance = value;
break;
case 570425358:
this.global.ellipsoidAxisDiameter = value;
break;
case 570425398:
this.setSpin ("x", Clazz.floatToInt (value));
break;
case 570425400:
this.setSpin ("y", Clazz.floatToInt (value));
break;
case 570425402:
this.setSpin ("z", Clazz.floatToInt (value));
break;
case 570425396:
this.setSpin ("fps", Clazz.floatToInt (value));
break;
case 570425352:
this.global.defaultDrawArrowScale = value;
break;
case 570425354:
this.global.defaultTranslucent = value;
break;
case 570425346:
this.setAxesScale (value);
break;
case 570425416:
this.transformManager.setVisualRange (value);
this.refresh (1, "set visualRange");
break;
case 570425371:
this.setNavigationDepthPercent (value);
break;
case 570425374:
this.global.navigationSpeed = value;
break;
case 570425372:
this.transformManager.setNavigationSlabOffsetPercent (value);
break;
case 570425350:
this.transformManager.setCameraDepthPercent (value);
this.refresh (1, "set cameraDepth");
break;
case 570425388:
this.setRotationRadius (value, true);
return;
case 570425362:
this.global.hoverDelayMs = Clazz.floatToInt (value * 1000);
break;
case 570425392:
this.global.sheetSmoothing = value;
break;
case 570425356:
value = J.viewer.Viewer.checkFloatRange (value, -10, 10);
this.global.dipoleScale = value;
break;
case 570425404:
this.transformManager.setStereoDegrees (value);
break;
case 1649410065:
this.setVectorScale (value);
return;
case 570425412:
this.setVibrationPeriod (value);
return;
case 570425414:
this.setVibrationScale (value);
return;
case 570425348:
this.setBondTolerance (value);
return;
case 570425364:
this.setMinBondDistance (value);
return;
case 570425390:
this.transformManager.setScaleAngstromsPerInch (value);
break;
case 570425394:
value = J.viewer.Viewer.checkFloatRange (value, 0, 10);
this.global.solventProbeRadius = value;
break;
default:
if (!this.global.htNonbooleanParameterValues.containsKey (key.toLowerCase ())) {
this.global.setUserVariable (key, J.script.SV.newVariable (3,  new Float (value)));
return;
}}
this.global.setF (key, value);
}, $fz.isPrivate = true, $fz), "~S,~N,~N");
Clazz.overrideMethod (c$, "setIntProperty", 
function (key, value) {
if (value == -2147483648) return;
if (key.charAt (0) == '_') {
this.global.setI (key, value);
return;
}var tok = J.script.T.getTokFromName (key);
switch (J.script.T.getParamType (tok)) {
case 545259520:
this.setStringPropertyTok (key, tok, "" + value);
break;
case 603979776:
this.setBooleanPropertyTok (key, tok, value != 0);
break;
case 570425344:
this.setFloatPropertyTok (key, tok, value);
break;
default:
this.setIntPropertyTok (key, tok, value);
}
}, "~S,~N");
Clazz.defineMethod (c$, "setIntPropertyTok", 
($fz = function (key, tok, value) {
switch (tok) {
case 553648151:
this.global.meshScale = value;
break;
case 553648153:
this.global.minPixelSelRadius = value;
break;
case 553648149:
this.global.isosurfacePropertySmoothingPower = value;
break;
case 553648165:
this.global.repaintWaitMs = value;
break;
case 553648170:
this.global.smallMoleculeMaxAtoms = value;
break;
case 553648152:
this.global.minimizationSteps = value;
break;
case 553648184:
this.global.strutSpacing = value;
break;
case 553648156:
value = J.viewer.Viewer.checkIntRange (value, 0, 1000);
this.gdata.setPhongExponent (value);
break;
case 553648146:
this.global.helixStep = value;
this.modelSet.setHaveStraightness (false);
break;
case 553648144:
this.global.dotScale = value;
break;
case 553648143:
this.global.dotDensity = value;
break;
case 553648138:
this.global.delayMaximumMs = value;
break;
case 553648150:
J.util.Logger.setLogLevel (value);
J.util.Logger.info ("logging level set to " + value);
this.global.setI ("logLevel", value);
if (this.eval != null) this.eval.setDebugging ();
return;
case 553648134:
switch (J.constant.EnumAxesMode.getAxesMode (value)) {
case J.constant.EnumAxesMode.MOLECULAR:
this.setAxesModeMolecular (true);
return;
case J.constant.EnumAxesMode.BOUNDBOX:
this.setAxesModeMolecular (false);
return;
case J.constant.EnumAxesMode.UNITCELL:
this.setAxesModeUnitCell (true);
return;
}
return;
case 553648178:
this.setStrandCount (0, value);
return;
case 553648182:
this.setStrandCount (12, value);
return;
case 553648180:
this.setStrandCount (13, value);
return;
case 553648155:
return;
case 536870922:
this.global.scriptDelay = value;
break;
case 553648176:
if (value < 0) value = J.viewer.Viewer.checkIntRange (value, -10, -1);
 else value = J.viewer.Viewer.checkIntRange (value, 0, 100);
this.gdata.setSpecularPower (value);
break;
case 553648172:
value = J.viewer.Viewer.checkIntRange (-value, -10, -1);
this.gdata.setSpecularPower (value);
break;
case 553648136:
this.setMarBond (value);
return;
case 536870924:
this.setBooleanPropertyTok (key, tok, value == 1);
return;
case 553648174:
value = J.viewer.Viewer.checkIntRange (value, 0, 100);
this.gdata.setSpecularPercent (value);
break;
case 553648142:
value = J.viewer.Viewer.checkIntRange (value, 0, 100);
this.gdata.setDiffusePercent (value);
break;
case 553648130:
value = J.viewer.Viewer.checkIntRange (value, 0, 100);
this.gdata.setAmbientPercent (value);
break;
case 553648186:
this.transformManager.zDepthToPercent (value);
break;
case 553648188:
this.transformManager.zSlabToPercent (value);
break;
case 554176526:
this.transformManager.depthToPercent (value);
break;
case 554176565:
this.transformManager.slabToPercent (value);
break;
case 553648190:
this.global.zShadePower = Math.max (value, 1);
break;
case 553648166:
this.global.ribbonAspectRatio = value;
break;
case 553648158:
this.global.pickingSpinRate = (value < 1 ? 1 : value);
break;
case 553648132:
this.setAnimationFps (value);
break;
case 553648154:
this.setPercentVdwAtom (value);
break;
case 553648147:
this.global.hermiteLevel = value;
break;
case 553648145:
case 553648148:
case 553648160:
case 553648159:
case 553648162:
case 553648164:
break;
default:
if (!this.global.htNonbooleanParameterValues.containsKey (key)) {
this.global.setUserVariable (key,  new J.script.ScriptVariableInt (value));
return;
}}
this.global.setI (key, value);
}, $fz.isPrivate = true, $fz), "~S,~N,~N");
c$.checkIntRange = Clazz.defineMethod (c$, "checkIntRange", 
($fz = function (value, min, max) {
return (value < min ? min : value > max ? max : value);
}, $fz.isPrivate = true, $fz), "~N,~N,~N");
c$.checkFloatRange = Clazz.defineMethod (c$, "checkFloatRange", 
($fz = function (value, min, max) {
return (value < min ? min : value > max ? max : value);
}, $fz.isPrivate = true, $fz), "~N,~N,~N");
Clazz.overrideMethod (c$, "setBooleanProperty", 
function (key, value) {
if (key.charAt (0) == '_') {
this.global.setB (key, value);
return;
}var tok = J.script.T.getTokFromName (key);
switch (J.script.T.getParamType (tok)) {
case 545259520:
this.setStringPropertyTok (key, tok, "" + value);
break;
case 553648128:
this.setIntPropertyTok (key, tok, value ? 1 : 0);
break;
case 570425344:
this.setFloatPropertyTok (key, tok, value ? 1 : 0);
break;
default:
this.setBooleanPropertyTok (key, tok, value);
}
}, "~S,~B");
Clazz.defineMethod (c$, "setBooleanPropertyTok", 
($fz = function (key, tok, value) {
var doRepaint = true;
switch (tok) {
case 603979968:
var b = this.global.twistedSheets;
this.global.twistedSheets = value;
if (b != value) this.checkCoordinatesChanged ();
break;
case 603979821:
this.global.celShading = value;
this.gdata.setCel (value);
break;
case 603979820:
this.global.cartoonFancy = value;
break;
case 603979934:
this.global.showTiming = value;
break;
case 603979973:
this.global.vectorSymmetry = value;
break;
case 603979870:
this.global.isosurfaceKey = value;
break;
case 603979888:
this.global.partialDots = value;
break;
case 603979874:
this.global.legacyAutoBonding = value;
break;
case 603979825:
this.global.defaultStructureDSSP = value;
break;
case 603979834:
this.global.dsspCalcHydrogen = value;
break;
case 603979782:
this.global.allowModelkit = value;
if (!value) this.setModelKitMode (false);
break;
case 603979882:
this.setModelKitMode (value);
break;
case 603979884:
this.global.multiProcessor = value && (J.viewer.Viewer.nProcessors > 1);
break;
case 603979883:
this.global.monitorEnergy = value;
break;
case 603979853:
this.global.hbondsRasmol = value;
break;
case 603979880:
this.global.minimizationRefresh = value;
break;
case 603979881:
this.global.minimizationSilent = value;
break;
case 603979969:
this.global.useArcBall = value;
break;
case 603979869:
if (value) {
this.$isKiosk = true;
this.global.disablePopupMenu = true;
if (this.display != null) this.apiPlatform.setTransparentCursor (this.display);
}break;
case 603979974:
this.global.waitForMoveTo = value;
break;
case 603979875:
this.global.logCommands = true;
break;
case 603979876:
this.global.logGestures = true;
break;
case 603979784:
this.global.allowMultiTouch = value;
break;
case 603979893:
this.global.preserveState = value;
this.modelSet.setPreserveState (value);
this.undoClear ();
break;
case 603979955:
this.global.strutsMultiple = value;
break;
case 603979842:
break;
case 603979938:
this.global.slabByAtom = value;
break;
case 603979940:
this.global.slabByMolecule = value;
break;
case 603979902:
this.global.saveProteinStructureState = value;
break;
case 603979780:
this.global.allowGestures = value;
break;
case 603979868:
this.global.imageState = value;
break;
case 603979970:
this.global.useMinimizationThread = value;
break;
case 603979781:
if (this.global.disablePopupMenu) value = false;
this.global.allowKeyStrokes = value;
break;
case 603979831:
this.global.dragSelected = value;
this.showSelected = false;
break;
case 603979924:
this.global.showKeyStrokes = value;
break;
case 603979844:
this.global.fontCaching = value;
break;
case 603979796:
this.global.atomPicking = value;
break;
case 603979814:
this.highlight (null);
this.global.bondPicking = value;
break;
case 603979906:
this.global.selectAllModels = value;
break;
case 603979879:
this.global.messageStyleChime = value;
break;
case 603979891:
this.global.pdbSequential = value;
break;
case 603979889:
this.global.pdbAddHydrogens = value;
break;
case 603979890:
this.global.pdbGetHeader = value;
break;
case 603979837:
this.global.ellipsoidAxes = value;
break;
case 603979836:
this.global.ellipsoidArcs = value;
break;
case 603979838:
this.global.ellipsoidBall = value;
break;
case 603979839:
this.global.ellipsoidDots = value;
break;
case 603979840:
this.global.ellipsoidFill = value;
break;
case 603979845:
this.global.fontScaling = value;
break;
case 603979956:
this.setSyncTarget (0, value);
break;
case 603979958:
this.setSyncTarget (1, value);
break;
case 603979976:
this.global.wireframeRotation = value;
break;
case 603979871:
this.global.isosurfacePropertySmoothing = value;
break;
case 603979833:
this.global.drawPicking = value;
break;
case 603979786:
this.setAntialias (0, value);
break;
case 603979790:
this.setAntialias (1, value);
break;
case 603979788:
this.setAntialias (2, value);
break;
case 603979944:
this.global.smartAromatic = value;
break;
case 603979794:
this.setApplySymmetryToBonds (value);
break;
case 603979792:
this.setAppendNew (value);
break;
case 603979800:
this.global.autoFps = value;
break;
case 603979972:
J.util.TextFormat.setUseNumberLocalization (this.global.useNumberLocalization = value);
break;
case 1611272202:
key = "showFrank";
this.setFrankOn (value);
break;
case 603979918:
this.setFrankOn (value);
break;
case 1613758488:
key = "solventProbe";
this.global.solventOn = value;
break;
case 603979948:
this.global.solventOn = value;
break;
case 603979835:
this.setDynamicMeasurements (value);
break;
case 603979785:
this.global.allowRotateSelected = value;
break;
case 603979783:
this.global.allowMoveAtoms = value;
this.global.allowRotateSelected = value;
this.global.dragSelected = value;
this.showSelected = false;
break;
case 536870922:
this.setIntPropertyTok ("showScript", tok, value ? 1 : 0);
return;
case 603979778:
this.global.allowEmbeddedScripts = value;
break;
case 603979887:
this.global.navigationPeriodic = value;
break;
case 603979984:
this.transformManager.setZShadeEnabled (value);
return;
case 603979832:
if (this.haveDisplay) this.global.drawHover = value;
break;
case 603979886:
this.setNavigationMode (value);
break;
case 603979885:
return;
case 603979860:
this.global.hideNavigationPoint = value;
break;
case 603979930:
this.global.showNavigationPointAlways = value;
break;
case 603979896:
this.setRefreshing (value);
break;
case 603979872:
this.global.justifyMeasurements = value;
break;
case 603979952:
this.global.ssbondsBackbone = value;
break;
case 603979852:
this.global.hbondsBackbone = value;
break;
case 603979854:
this.global.hbondsSolid = value;
break;
case 536870924:
this.gdata.setSpecular (value);
break;
case 603979942:
this.transformManager.setSlabEnabled (value);
return;
case 603979980:
this.transformManager.setZoomEnabled (value);
return;
case 603979864:
this.global.highResolutionFlag = value;
break;
case 603979967:
this.global.traceAlpha = value;
break;
case 603979982:
this.global.zoomLarge = value;
this.transformManager.scaleFitToScreen (false, value, false, true);
break;
case 603979873:
J.i18n.GT.setDoTranslate (value);
break;
case 603979862:
this.selectionManager.setHideNotSelected (value);
break;
case 603979904:
this.setScriptQueue (value);
break;
case 603979830:
this.global.dotSurface = value;
break;
case 603979829:
this.global.dotsSelectedOnly = value;
break;
case 1611141171:
this.setSelectionHalos (value);
break;
case 603979910:
this.global.rasmolHydrogenSetting = value;
break;
case 603979908:
this.global.rasmolHeteroSetting = value;
break;
case 603979928:
this.global.showMultipleBonds = value;
break;
case 603979920:
this.global.showHiddenSelectionHalos = value;
break;
case 603979975:
this.transformManager.setWindowCentered (value);
break;
case 603979828:
this.global.displayCellParameters = value;
break;
case 603979960:
this.global.testFlag1 = value;
break;
case 603979962:
this.global.testFlag2 = value;
break;
case 603979964:
this.global.testFlag3 = value;
break;
case 603979966:
this.jmolTest ();
this.global.testFlag4 = value;
break;
case 603979898:
this.global.ribbonBorder = value;
break;
case 603979818:
this.global.cartoonBaseEdges = value;
break;
case 603979819:
this.global.cartoonRockets = value;
break;
case 603979900:
this.global.rocketBarrels = value;
break;
case 603979850:
this.gdata.setGreyscaleMode (this.global.greyscaleRendering = value);
break;
case 603979878:
this.global.measurementLabels = value;
break;
case 603979810:
this.setAxesModeMolecular (!value);
return;
case 603979804:
this.setAxesModeMolecular (value);
return;
case 603979808:
this.setAxesModeUnitCell (value);
return;
case 603979806:
this.setAxesOrientationRasmol (value);
return;
case 603979823:
this.setStringPropertyTok ("defaultcolorscheme", 545259545, value ? "rasmol" : "jmol");
return;
case 603979824:
this.setDebugScript (value);
return;
case 603979892:
this.setPerspectiveDepth (value);
return;
case 603979798:
this.setAutoBond (value);
return;
case 603979914:
this.setShowAxes (value);
return;
case 603979916:
this.setShowBbcage (value);
return;
case 603979922:
this.setShowHydrogens (value);
return;
case 603979926:
this.setShowMeasurements (value);
return;
case 603979936:
this.setShowUnitCell (value);
return;
case 603979812:
doRepaint = false;
this.global.bondModeOr = value;
break;
case 603979978:
doRepaint = false;
this.global.zeroBasedXyzRasmol = value;
this.reset (true);
break;
case 603979894:
doRepaint = false;
this.global.rangeSelected = value;
break;
case 603979877:
doRepaint = false;
this.global.measureAllModels = value;
break;
case 603979954:
doRepaint = false;
this.statusManager.setAllowStatusReporting (value);
break;
case 603979822:
doRepaint = false;
this.global.chainCaseSensitive = value;
break;
case 603979858:
doRepaint = false;
this.global.hideNameInPopup = value;
break;
case 603979826:
doRepaint = false;
this.global.disablePopupMenu = value;
break;
case 603979846:
doRepaint = false;
this.global.forceAutoBond = value;
break;
case 603979848:
doRepaint = false;
this.global.fractionalRelative = value;
break;
default:
if (!this.global.htBooleanParameterFlags.containsKey (key.toLowerCase ())) {
this.global.setUserVariable (key, J.script.SV.getBoolean (value));
return;
}}
this.global.setB (key, value);
if (doRepaint) this.setTainted (true);
}, $fz.isPrivate = true, $fz), "~S,~N,~B");
Clazz.defineMethod (c$, "setModelKitMode", 
($fz = function (value) {
if (this.actionManager == null || !this.allowScripting) return;
if (value || this.global.modelKitMode) {
this.setPickingMode (null, value ? 33 : 1);
this.setPickingMode (null, value ? 32 : 1);
}var isChange = (this.global.modelKitMode != value);
this.global.modelKitMode = value;
this.highlight (null);
if (value) {
this.setNavigationMode (false);
this.selectAll ();
this.setAtomPickingOption ("C");
this.setBondPickingOption ("p");
if (!this.$isApplet) this.popupMenu (0, 0, 'm');
if (isChange) this.statusManager.setCallbackFunction ("modelkit", "ON");
this.global.modelKitMode = true;
if (this.getAtomCount () == 0) this.zap (false, true, true);
} else {
this.actionManager.setPickingMode (-1);
this.setStringProperty ("pickingStyle", "toggle");
this.setBooleanProperty ("bondPicking", false);
if (isChange) this.statusManager.setCallbackFunction ("modelkit", "OFF");
}}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "getModelkitMode", 
function () {
return this.global.modelKitMode;
});
Clazz.defineMethod (c$, "getLanguage", 
function () {
return this.language;
});
Clazz.defineMethod (c$, "setSmilesString", 
function (s) {
if (s == null) this.global.removeParam ("_smilesString");
 else this.global.setS ("_smilesString", s);
}, "~S");
Clazz.defineMethod (c$, "removeUserVariable", 
function (key) {
this.global.removeUserVariable (key);
if (key.endsWith ("callback")) this.statusManager.setCallbackFunction (key, null);
}, "~S");
Clazz.defineMethod (c$, "isJmolVariable", 
function (key) {
return this.global.isJmolVariable (key);
}, "~S");
Clazz.defineMethod (c$, "jmolTest", 
($fz = function () {
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "isPdbSequential", 
function () {
return this.global.pdbSequential;
});
Clazz.defineMethod (c$, "getSelectAllModels", 
function () {
return this.global.selectAllModels;
});
Clazz.defineMethod (c$, "getMessageStyleChime", 
function () {
return this.global.messageStyleChime;
});
Clazz.defineMethod (c$, "getFontCaching", 
function () {
return this.global.fontCaching;
});
Clazz.defineMethod (c$, "getFontScaling", 
function () {
return this.global.fontScaling;
});
Clazz.defineMethod (c$, "showParameter", 
function (key, ifNotSet, nMax) {
var sv = "" + this.global.getParameterEscaped (key, nMax);
if (ifNotSet || sv.indexOf ("<not defined>") < 0) this.showString (key + " = " + sv, false);
}, "~S,~B,~N");
Clazz.defineMethod (c$, "showString", 
function (str, isPrint) {
if (this.isScriptQueued () && (!this.isSilent || isPrint) && !this.isJS) J.util.Logger.warn (str);
this.scriptEcho (str);
}, "~S,~B");
Clazz.defineMethod (c$, "getAllSettings", 
function (prefix) {
return this.getStateCreator ().getAllSettings (prefix);
}, "~S");
Clazz.defineMethod (c$, "getBindingInfo", 
function (qualifiers) {
return (this.haveDisplay ? this.actionManager.getBindingInfo (qualifiers) : "");
}, "~S");
Clazz.defineMethod (c$, "getDelayMaximum", 
function () {
return (this.haveDisplay ? this.global.delayMaximumMs : 1);
});
Clazz.defineMethod (c$, "getDotSurfaceFlag", 
function () {
return this.global.dotSurface;
});
Clazz.defineMethod (c$, "getDotsSelectedOnlyFlag", 
function () {
return this.global.dotsSelectedOnly;
});
Clazz.defineMethod (c$, "getDotDensity", 
function () {
return this.global.dotDensity;
});
Clazz.defineMethod (c$, "getDotScale", 
function () {
return this.global.dotScale;
});
Clazz.defineMethod (c$, "getMeshScale", 
function () {
return this.global.meshScale;
});
Clazz.defineMethod (c$, "isRangeSelected", 
function () {
return this.global.rangeSelected;
});
Clazz.defineMethod (c$, "getIsosurfaceKey", 
function () {
return this.global.isosurfaceKey;
});
Clazz.defineMethod (c$, "getIsosurfacePropertySmoothing", 
function (asPower) {
return (asPower ? this.global.isosurfacePropertySmoothingPower : this.global.isosurfacePropertySmoothing ? 1 : 0);
}, "~B");
Clazz.defineMethod (c$, "getWireframeRotation", 
function () {
return this.global.wireframeRotation;
});
Clazz.defineMethod (c$, "isWindowCentered", 
function () {
return this.transformManager.isWindowCentered ();
});
Clazz.defineMethod (c$, "setNavigationDepthPercent", 
function (percent) {
this.transformManager.setNavigationDepthPercent (percent);
this.refresh (1, "set navigationDepth");
}, "~N");
Clazz.defineMethod (c$, "getNavigationSpeed", 
function () {
return this.global.navigationSpeed;
});
Clazz.defineMethod (c$, "getShowNavigationPoint", 
function () {
if (!this.global.navigationMode || !this.transformManager.canNavigate ()) return false;
return (this.isNavigating () && !this.global.hideNavigationPoint || this.global.showNavigationPointAlways || this.getInMotion ());
});
Clazz.defineMethod (c$, "getSolventProbeRadius", 
function () {
return this.global.solventProbeRadius;
});
Clazz.defineMethod (c$, "getCurrentSolventProbeRadius", 
function () {
return this.global.solventOn ? this.global.solventProbeRadius : 0;
});
Clazz.defineMethod (c$, "getSolventOn", 
function () {
return this.global.solventOn;
});
Clazz.defineMethod (c$, "getShowTiming", 
function () {
return this.global.showTiming;
});
Clazz.defineMethod (c$, "getTestFlag", 
function (i) {
switch (i) {
case 1:
return this.global.testFlag1;
case 2:
return this.global.testFlag2;
case 3:
return this.global.testFlag3;
case 4:
return this.global.testFlag4;
}
return false;
}, "~N");
Clazz.overrideMethod (c$, "setPerspectiveDepth", 
function (perspectiveDepth) {
this.global.setB ("perspectiveDepth", perspectiveDepth);
this.transformManager.setPerspectiveDepth (perspectiveDepth);
}, "~B");
Clazz.overrideMethod (c$, "setAxesOrientationRasmol", 
function (TF) {
this.global.setB ("axesOrientationRasmol", TF);
this.global.axesOrientationRasmol = TF;
this.reset (true);
}, "~B");
Clazz.overrideMethod (c$, "getAxesOrientationRasmol", 
function () {
return this.global.axesOrientationRasmol;
});
Clazz.defineMethod (c$, "setAxesScale", 
function (scale) {
scale = J.viewer.Viewer.checkFloatRange (scale, -100, 100);
this.global.axesScale = scale;
this.axesAreTainted = true;
}, "~N");
Clazz.defineMethod (c$, "getAxisPoints", 
function () {
return (this.getObjectMad (1) == 0 || this.getAxesMode () !== J.constant.EnumAxesMode.UNITCELL || (this.getShapeProperty (30, "axesTypeXY")).booleanValue () || this.getShapeProperty (30, "origin") != null ? null : this.getShapeProperty (30, "axisPoints"));
});
Clazz.defineMethod (c$, "getAxesScale", 
function () {
return this.global.axesScale;
});
Clazz.defineMethod (c$, "resetError", 
function () {
this.global.removeParam ("_errormessage");
});
Clazz.defineMethod (c$, "setAxesModeMolecular", 
($fz = function (TF) {
this.global.axesMode = (TF ? J.constant.EnumAxesMode.MOLECULAR : J.constant.EnumAxesMode.BOUNDBOX);
this.axesAreTainted = true;
this.global.removeParam ("axesunitcell");
this.global.removeParam (TF ? "axeswindow" : "axesmolecular");
this.global.setI ("axesMode", this.global.axesMode.getCode ());
this.global.setB (TF ? "axesMolecular" : "axesWindow", true);
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "setAxesModeUnitCell", 
function (TF) {
this.global.axesMode = (TF ? J.constant.EnumAxesMode.UNITCELL : J.constant.EnumAxesMode.BOUNDBOX);
this.axesAreTainted = true;
this.global.removeParam ("axesmolecular");
this.global.removeParam (TF ? "axeswindow" : "axesunitcell");
this.global.setB (TF ? "axesUnitcell" : "axesWindow", true);
this.global.setI ("axesMode", this.global.axesMode.getCode ());
}, "~B");
Clazz.defineMethod (c$, "getAxesMode", 
function () {
return this.global.axesMode;
});
Clazz.defineMethod (c$, "getDisplayCellParameters", 
function () {
return this.global.displayCellParameters;
});
Clazz.overrideMethod (c$, "getPerspectiveDepth", 
function () {
return this.transformManager.getPerspectiveDepth ();
});
Clazz.overrideMethod (c$, "setSelectionHalos", 
function (TF) {
if (this.modelSet == null || TF == this.modelSet.getSelectionHaloEnabled ()) return;
this.global.setB ("selectionHalos", TF);
this.loadShape (8);
this.modelSet.setSelectionHaloEnabled (TF);
}, "~B");
Clazz.defineMethod (c$, "getSelectionHaloEnabled", 
function (isRenderer) {
var flag = this.modelSet.getSelectionHaloEnabled () || isRenderer && this.showSelected;
if (isRenderer) this.showSelected = false;
return flag;
}, "~B");
Clazz.defineMethod (c$, "getBondSelectionModeOr", 
function () {
return this.global.bondModeOr;
});
Clazz.defineMethod (c$, "getChainCaseSensitive", 
function () {
return this.global.chainCaseSensitive;
});
Clazz.defineMethod (c$, "getRibbonBorder", 
function () {
return this.global.ribbonBorder;
});
Clazz.defineMethod (c$, "getCartoonFlag", 
function (tok) {
switch (tok) {
case 603979968:
return this.global.twistedSheets;
case 603979819:
return this.global.cartoonRockets;
case 603979820:
return this.global.cartoonFancy;
case 603979900:
return this.global.rocketBarrels;
case 603979818:
return this.global.cartoonBaseEdges;
}
return false;
}, "~N");
Clazz.defineMethod (c$, "setStrandCount", 
($fz = function (type, value) {
value = J.viewer.Viewer.checkIntRange (value, 0, 20);
switch (type) {
case 12:
this.global.strandCountForStrands = value;
break;
case 13:
this.global.strandCountForMeshRibbon = value;
break;
default:
this.global.strandCountForStrands = value;
this.global.strandCountForMeshRibbon = value;
break;
}
this.global.setI ("strandCount", value);
this.global.setI ("strandCountForStrands", this.global.strandCountForStrands);
this.global.setI ("strandCountForMeshRibbon", this.global.strandCountForMeshRibbon);
}, $fz.isPrivate = true, $fz), "~N,~N");
Clazz.defineMethod (c$, "getStrandCount", 
function (type) {
return (type == 12 ? this.global.strandCountForStrands : this.global.strandCountForMeshRibbon);
}, "~N");
Clazz.defineMethod (c$, "getHideNameInPopup", 
function () {
return this.global.hideNameInPopup;
});
Clazz.defineMethod (c$, "getNavigationPeriodic", 
function () {
return this.global.navigationPeriodic;
});
Clazz.defineMethod (c$, "setNavigationMode", 
($fz = function (TF) {
this.global.navigationMode = TF;
this.transformManager.setNavigationMode (TF);
}, $fz.isPrivate = true, $fz), "~B");
Clazz.defineMethod (c$, "getNavigationMode", 
function () {
return this.global.navigationMode;
});
Clazz.defineMethod (c$, "setTransformManagerDefaults", 
($fz = function () {
this.transformManager.setCameraDepthPercent (this.global.cameraDepth);
this.transformManager.setPerspectiveDepth (this.global.perspectiveDepth);
this.transformManager.setStereoDegrees (-5);
this.transformManager.setVisualRange (this.global.visualRange);
this.transformManager.setSpinOff ();
this.transformManager.setVibrationPeriod (0);
this.transformManager.setFrameOffsets (this.frameOffsets);
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getCameraFactors", 
function () {
return this.transformManager.getCameraFactors ();
});
Clazz.defineMethod (c$, "getZoomLarge", 
function () {
return this.global.zoomLarge;
});
Clazz.defineMethod (c$, "getTraceAlpha", 
function () {
return this.global.traceAlpha;
});
Clazz.defineMethod (c$, "getHermiteLevel", 
function () {
return (this.getSpinOn () ? 0 : this.global.hermiteLevel);
});
Clazz.defineMethod (c$, "getHighResolution", 
function () {
return this.global.highResolutionFlag;
});
Clazz.defineMethod (c$, "getLoadState", 
function (htParams) {
return this.getStateCreator ().getLoadState (htParams);
}, "java.util.Map");
Clazz.overrideMethod (c$, "setAutoBond", 
function (TF) {
this.global.setB ("autobond", TF);
this.global.autoBond = TF;
}, "~B");
Clazz.overrideMethod (c$, "getAutoBond", 
function () {
return this.global.autoBond;
});
Clazz.defineMethod (c$, "makeConnections", 
function (minDistance, maxDistance, order, connectOperation, bsA, bsB, bsBonds, isBonds, addGroup, energy) {
this.clearModelDependentObjects ();
this.clearMinimization ();
return this.modelSet.makeConnections (minDistance, maxDistance, order, connectOperation, bsA, bsB, bsBonds, isBonds, addGroup, energy);
}, "~N,~N,~N,~N,J.util.BS,J.util.BS,J.util.BS,~B,~B,~N");
Clazz.overrideMethod (c$, "rebond", 
function () {
this.rebondState (false);
});
Clazz.defineMethod (c$, "rebondState", 
function (isStateScript) {
this.clearModelDependentObjects ();
this.modelSet.deleteAllBonds ();
var isLegacy = isStateScript && this.checkAutoBondLegacy ();
this.modelSet.autoBondBs4 (null, null, null, null, this.getMadBond (), isLegacy);
this.addStateScript ((isLegacy ? "set legacyAutoBonding TRUE;connect;set legacyAutoBonding FALSE;" : "connect;"), false, true);
}, "~B");
Clazz.defineMethod (c$, "setPdbConectBonding", 
function (isAuto, isStateScript) {
this.clearModelDependentObjects ();
this.modelSet.deleteAllBonds ();
var bsExclude =  new J.util.BS ();
this.modelSet.setPdbConectBonding (0, 0, bsExclude);
if (isAuto) {
var isLegacy = isStateScript && this.checkAutoBondLegacy ();
this.modelSet.autoBondBs4 (null, null, bsExclude, null, this.getMadBond (), isLegacy);
this.addStateScript ((isLegacy ? "set legacyAutoBonding TRUE;connect PDB AUTO;set legacyAutoBonding FALSE;" : "connect PDB auto;"), false, true);
return;
}this.addStateScript ("connect PDB;", false, true);
}, "~B,~B");
Clazz.defineMethod (c$, "getGreyscaleRendering", 
function () {
return this.global.greyscaleRendering;
});
Clazz.defineMethod (c$, "getDisablePopupMenu", 
function () {
return this.global.disablePopupMenu;
});
Clazz.defineMethod (c$, "getForceAutoBond", 
function () {
return this.global.forceAutoBond;
});
Clazz.overrideMethod (c$, "setPercentVdwAtom", 
function (value) {
this.global.setI ("percentVdwAtom", value);
this.global.percentVdwAtom = value;
this.rd.value = value / 100;
this.rd.factorType = J.atomdata.RadiusData.EnumType.FACTOR;
this.rd.vdwType = J.constant.EnumVdw.AUTO;
this.setShapeSize (0, this.rd, null);
}, "~N");
Clazz.overrideMethod (c$, "getPercentVdwAtom", 
function () {
return this.global.percentVdwAtom;
});
Clazz.defineMethod (c$, "getDefaultRadiusData", 
function () {
return this.rd;
});
Clazz.overrideMethod (c$, "getMadBond", 
function () {
return (this.global.bondRadiusMilliAngstroms * 2);
});
Clazz.defineMethod (c$, "getMarBond", 
function () {
return this.global.bondRadiusMilliAngstroms;
});
Clazz.defineMethod (c$, "getModeMultipleBond", 
function () {
return this.global.modeMultipleBond;
});
Clazz.defineMethod (c$, "getShowMultipleBonds", 
function () {
return this.global.showMultipleBonds;
});
Clazz.defineMethod (c$, "getMultipleBondSpacing", 
function () {
return this.global.multipleBondSpacing;
});
Clazz.defineMethod (c$, "getMultipleBondRadiusFactor", 
function () {
return this.global.multipleBondRadiusFactor;
});
Clazz.overrideMethod (c$, "setShowHydrogens", 
function (TF) {
this.global.setB ("showHydrogens", TF);
this.global.showHydrogens = TF;
}, "~B");
Clazz.overrideMethod (c$, "getShowHydrogens", 
function () {
return this.global.showHydrogens;
});
Clazz.defineMethod (c$, "getShowHiddenSelectionHalos", 
function () {
return this.global.showHiddenSelectionHalos;
});
Clazz.overrideMethod (c$, "setShowBbcage", 
function (value) {
this.setObjectMad (31, "boundbox", (value ? -4 : 0));
this.global.setB ("showBoundBox", value);
}, "~B");
Clazz.overrideMethod (c$, "getShowBbcage", 
function () {
return this.getObjectMad (4) != 0;
});
Clazz.defineMethod (c$, "setShowUnitCell", 
function (value) {
this.setObjectMad (32, "unitcell", (value ? -2 : 0));
this.global.setB ("showUnitCell", value);
}, "~B");
Clazz.defineMethod (c$, "getShowUnitCell", 
function () {
return this.getObjectMad (5) != 0;
});
Clazz.overrideMethod (c$, "setShowAxes", 
function (value) {
this.setObjectMad (30, "axes", (value ? -2 : 0));
this.global.setB ("showAxes", value);
}, "~B");
Clazz.overrideMethod (c$, "getShowAxes", 
function () {
return this.getObjectMad (1) != 0;
});
Clazz.overrideMethod (c$, "setFrankOn", 
function (TF) {
if (this.$isPreviewOnly) TF = false;
this.frankOn = TF;
this.setObjectMad (34, "frank", (TF ? 1 : 0));
}, "~B");
Clazz.defineMethod (c$, "getShowFrank", 
function () {
if (this.$isPreviewOnly || this.$isApplet && this.creatingImage) return false;
return (!this.isJS && this.$isSignedApplet && !this.isSignedAppletLocal || this.frankOn);
});
Clazz.defineMethod (c$, "isSignedApplet", 
function () {
return this.$isSignedApplet;
});
Clazz.overrideMethod (c$, "setShowMeasurements", 
function (TF) {
this.global.setB ("showMeasurements", TF);
this.global.showMeasurements = TF;
}, "~B");
Clazz.overrideMethod (c$, "getShowMeasurements", 
function () {
return this.global.showMeasurements;
});
Clazz.defineMethod (c$, "getShowMeasurementLabels", 
function () {
return this.global.measurementLabels;
});
Clazz.defineMethod (c$, "getMeasureAllModelsFlag", 
function () {
return this.global.measureAllModels;
});
Clazz.defineMethod (c$, "setUnits", 
function (units, isDistance) {
this.global.setUnits (units);
if (isDistance) {
this.global.setUnits (units);
this.setShapeProperty (6, "reformatDistances", null);
} else {
}}, "~S,~B");
Clazz.defineMethod (c$, "getMeasureDistanceUnits", 
function () {
return this.global.measureDistanceUnits;
});
Clazz.defineMethod (c$, "getEnergyUnits", 
function () {
return this.global.energyUnits;
});
Clazz.defineMethod (c$, "setAppendNew", 
function (value) {
this.global.appendNew = value;
}, "~B");
Clazz.defineMethod (c$, "getAppendNew", 
function () {
return this.global.appendNew;
});
Clazz.defineMethod (c$, "getAutoFps", 
function () {
return this.global.autoFps;
});
Clazz.overrideMethod (c$, "setRasmolDefaults", 
function () {
this.setDefaultsType ("RasMol");
});
Clazz.overrideMethod (c$, "setJmolDefaults", 
function () {
this.setDefaults ();
});
Clazz.defineMethod (c$, "setDefaultsType", 
($fz = function (type) {
if (type.equalsIgnoreCase ("RasMol")) {
this.stateManager.setRasMolDefaults ();
return;
}this.setDefaults ();
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "setDefaults", 
($fz = function () {
this.setShapeSize (0, this.rd, this.getModelUndeletedAtomsBitSet (-1));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getZeroBasedXyzRasmol", 
function () {
return this.global.zeroBasedXyzRasmol;
});
Clazz.defineMethod (c$, "setAntialias", 
($fz = function (mode, TF) {
switch (mode) {
case 0:
this.global.antialiasDisplay = TF;
break;
case 1:
this.global.antialiasTranslucent = TF;
break;
case 2:
this.global.antialiasImages = TF;
return;
}
this.resizeImage (0, 0, false, false, true);
}, $fz.isPrivate = true, $fz), "~N,~B");
Clazz.defineMethod (c$, "allocTempPoints", 
function (size) {
return this.tempArray.allocTempPoints (size);
}, "~N");
Clazz.defineMethod (c$, "freeTempPoints", 
function (tempPoints) {
this.tempArray.freeTempPoints (tempPoints);
}, "~A");
Clazz.defineMethod (c$, "allocTempScreens", 
function (size) {
return this.tempArray.allocTempScreens (size);
}, "~N");
Clazz.defineMethod (c$, "freeTempScreens", 
function (tempScreens) {
this.tempArray.freeTempScreens (tempScreens);
}, "~A");
Clazz.defineMethod (c$, "allocTempEnum", 
function (size) {
return this.tempArray.allocTempEnum (size);
}, "~N");
Clazz.defineMethod (c$, "freeTempEnum", 
function (temp) {
this.tempArray.freeTempEnum (temp);
}, "~A");
Clazz.defineMethod (c$, "getFont3D", 
function (fontFace, fontStyle, fontSize) {
return this.gdata.getFont3DFSS (fontFace, fontStyle, fontSize);
}, "~S,~S,~N");
Clazz.defineMethod (c$, "formatText", 
function (text0) {
var i;
if ((i = text0.indexOf ("@{")) < 0 && (i = text0.indexOf ("%{")) < 0) return text0;
var text = text0;
var isEscaped = (text.indexOf ("\\") >= 0);
if (isEscaped) {
text = J.util.TextFormat.simpleReplace (text, "\\%", "\1");
text = J.util.TextFormat.simpleReplace (text, "\\@", "\2");
isEscaped = !text.equals (text0);
}text = J.util.TextFormat.simpleReplace (text, "%{", "@{");
var name;
while ((i = text.indexOf ("@{")) >= 0) {
i++;
var i0 = i + 1;
var len = text.length;
i = J.util.TextFormat.ichMathTerminator (text, i, len);
if (i >= len) return text;
name = text.substring (i0, i);
if (name.length == 0) return text;
var v = this.evaluateExpression (name);
if (Clazz.instanceOf (v, J.util.P3)) v = J.util.Escape.eP (v);
text = text.substring (0, i0 - 2) + v.toString () + text.substring (i + 1);
}
if (isEscaped) {
text = J.util.TextFormat.simpleReplace (text, "\2", "@");
text = J.util.TextFormat.simpleReplace (text, "\1", "%");
}return text;
}, "~S");
Clazz.defineMethod (c$, "getElementSymbol", 
function (i) {
return this.modelSet.getElementSymbol (i);
}, "~N");
Clazz.defineMethod (c$, "getElementNumber", 
function (i) {
return this.modelSet.getElementNumber (i);
}, "~N");
Clazz.overrideMethod (c$, "getAtomName", 
function (i) {
return this.modelSet.getAtomName (i);
}, "~N");
Clazz.overrideMethod (c$, "getAtomNumber", 
function (i) {
return this.modelSet.getAtomNumber (i);
}, "~N");
Clazz.defineMethod (c$, "getAtomGroupQuaternions", 
function (bsAtoms, nMax) {
return this.modelSet.getAtomGroupQuaternions (bsAtoms, nMax, this.getQuaternionFrame ());
}, "J.util.BS,~N");
Clazz.defineMethod (c$, "getAtomQuaternion", 
function (i) {
return this.modelSet.getQuaternion (i, this.getQuaternionFrame ());
}, "~N");
Clazz.overrideMethod (c$, "getAtomPoint3f", 
function (i) {
return this.modelSet.atoms[i];
}, "~N");
Clazz.defineMethod (c$, "getAtomPointVector", 
function (bs) {
return this.modelSet.getAtomPointVector (bs);
}, "J.util.BS");
Clazz.overrideMethod (c$, "getAtomRadius", 
function (i) {
return this.modelSet.getAtomRadius (i);
}, "~N");
Clazz.overrideMethod (c$, "getAtomArgb", 
function (i) {
return this.gdata.getColorArgbOrGray (this.modelSet.getAtomColix (i));
}, "~N");
Clazz.defineMethod (c$, "getAtomChain", 
function (i) {
return this.modelSet.getAtomChain (i);
}, "~N");
Clazz.overrideMethod (c$, "getAtomModelIndex", 
function (i) {
return this.modelSet.atoms[i].modelIndex;
}, "~N");
Clazz.defineMethod (c$, "getAtomSequenceCode", 
function (i) {
return this.modelSet.atoms[i].getSeqcodeString ();
}, "~N");
Clazz.overrideMethod (c$, "getBondRadius", 
function (i) {
return this.modelSet.getBondRadius (i);
}, "~N");
Clazz.overrideMethod (c$, "getBondOrder", 
function (i) {
return this.modelSet.getBondOrder (i);
}, "~N");
Clazz.defineMethod (c$, "assignAromaticBonds", 
function () {
this.modelSet.assignAromaticBonds ();
});
Clazz.defineMethod (c$, "getSmartAromatic", 
function () {
return this.global.smartAromatic;
});
Clazz.defineMethod (c$, "resetAromatic", 
function () {
this.modelSet.resetAromatic ();
});
Clazz.overrideMethod (c$, "getBondArgb1", 
function (i) {
return this.gdata.getColorArgbOrGray (this.modelSet.getBondColix1 (i));
}, "~N");
Clazz.overrideMethod (c$, "getBondModelIndex", 
function (i) {
return this.modelSet.getBondModelIndex (i);
}, "~N");
Clazz.overrideMethod (c$, "getBondArgb2", 
function (i) {
return this.gdata.getColorArgbOrGray (this.modelSet.getBondColix2 (i));
}, "~N");
Clazz.overrideMethod (c$, "getPolymerLeadMidPoints", 
function (modelIndex, polymerIndex) {
return this.modelSet.getPolymerLeadMidPoints (modelIndex, polymerIndex);
}, "~N,~N");
Clazz.defineMethod (c$, "setStereoMode", 
function (twoColors, stereoMode, degrees) {
this.setFloatProperty ("stereoDegrees", degrees);
this.setBooleanProperty ("greyscaleRendering", stereoMode.isBiColor ());
if (twoColors != null) this.transformManager.setStereoMode2 (twoColors);
 else this.transformManager.setStereoMode (stereoMode);
}, "~A,J.constant.EnumStereoMode,~N");
Clazz.defineMethod (c$, "isStereoDouble", 
function () {
return this.transformManager.stereoMode === J.constant.EnumStereoMode.DOUBLE;
});
Clazz.overrideMethod (c$, "getOperatingSystemName", 
function () {
return J.viewer.Viewer.strOSName;
});
Clazz.overrideMethod (c$, "getJavaVendor", 
function () {
return J.viewer.Viewer.strJavaVendor;
});
Clazz.overrideMethod (c$, "getJavaVersion", 
function () {
return J.viewer.Viewer.strJavaVersion;
});
Clazz.defineMethod (c$, "getGraphicsData", 
function () {
return this.gdata;
});
Clazz.overrideMethod (c$, "showModelSetDownload", 
function () {
return true;
});
Clazz.overrideMethod (c$, "getProperty", 
function (returnType, infoType, paramInfo) {
if (!"DATA_API".equals (returnType)) return this.getPropertyManager ().getProperty (returnType, infoType, paramInfo);
switch (("scriptCheck.........consoleText.........scriptEditor........scriptEditorState...getAppConsole.......getScriptEditor.....setMenu.............spaceGroupInfo......disablePopupMenu....defaultDirectory....getPopupMenu........shapeManager........").indexOf (infoType)) {
case 0:
return this.scriptCheckRet (paramInfo, true);
case 20:
return (this.appConsole == null ? "" : this.appConsole.getText ());
case 40:
this.getStateCreator ().showEditor (paramInfo);
return null;
case 60:
this.scriptEditorVisible = (paramInfo).booleanValue ();
return null;
case 80:
if (this.$isKiosk) {
this.appConsole = null;
} else if (Clazz.instanceOf (paramInfo, J.api.JmolAppConsoleInterface)) {
this.appConsole = paramInfo;
} else if (paramInfo != null && !(paramInfo).booleanValue ()) {
this.appConsole = null;
} else if (this.appConsole == null && paramInfo != null && (paramInfo).booleanValue ()) {
{
this.appConsole = J.api.Interface
.getOptionInterface("consolejs.AppletConsole");
if (this.appConsole != null) {
this.appConsole.start(this);
return this.appConsole;
}
}if (this.appConsole != null) this.appConsole.start (this);
}this.scriptEditor = (this.appConsole == null ? null : this.appConsole.getScriptEditor ());
return this.appConsole;
case 100:
if (this.appConsole == null && paramInfo != null && (paramInfo).booleanValue ()) {
this.getProperty ("DATA_API", "getAppConsole", Boolean.TRUE);
this.scriptEditor = (this.appConsole == null ? null : this.appConsole.getScriptEditor ());
}return this.scriptEditor;
case 120:
if (this.jmolpopup != null) this.jmolpopup.jpiDispose ();
this.jmolpopup = null;
return this.menuStructure = paramInfo;
case 140:
return this.getSpaceGroupInfo (null);
case 160:
this.global.disablePopupMenu = true;
return null;
case 180:
return this.global.defaultDirectory;
case 200:
if (Clazz.instanceOf (paramInfo, String)) return this.getMenu (paramInfo);
return this.getPopupMenu ();
case 220:
return this.shapeManager.getProperty (paramInfo);
}
J.util.Logger.error ("ERROR in getProperty DATA_API: " + infoType);
return null;
}, "~S,~S,~O");
Clazz.defineMethod (c$, "getPropertyManager", 
($fz = function () {
if (this.pm == null) (this.pm = J.api.Interface.getOptionInterface ("viewer.PropertyManager")).setViewer (this);
return this.pm;
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "getModelExtract", 
function (atomExpression, doTransform, isModelKit, type) {
return this.getPropertyManager ().getModelExtract (this.getAtomBitSet (atomExpression), doTransform, isModelKit, type);
}, "~O,~B,~B,~S");
Clazz.defineMethod (c$, "setTainted", 
function (TF) {
this.isTainted = this.axesAreTainted = (TF && (this.refreshing || this.creatingImage));
}, "~B");
Clazz.defineMethod (c$, "notifyMouseClicked", 
function (x, y, action, mode) {
var modifiers = J.viewer.binding.Binding.getModifiers (action);
var clickCount = J.viewer.binding.Binding.getClickCount (action);
this.global.setI ("_mouseX", x);
this.global.setI ("_mouseY", this.dimScreen.height - y);
this.global.setI ("_mouseAction", action);
this.global.setI ("_mouseModifiers", modifiers);
this.global.setI ("_clickCount", clickCount);
return this.statusManager.setStatusClicked (x, this.dimScreen.height - y, action, clickCount, mode);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "checkObjectClicked", 
function (x, y, modifiers) {
return this.shapeManager.checkObjectClicked (x, y, modifiers, this.getVisibleFramesBitSet ());
}, "~N,~N,~N");
Clazz.defineMethod (c$, "checkObjectHovered", 
function (x, y) {
return (x >= 0 && this.shapeManager != null && this.shapeManager.checkObjectHovered (x, y, this.getVisibleFramesBitSet (), this.getBondPicking ()));
}, "~N,~N");
Clazz.defineMethod (c$, "checkObjectDragged", 
function (prevX, prevY, x, y, action) {
var iShape = 0;
switch (this.getPickingMode ()) {
case 2:
iShape = 5;
break;
case 4:
iShape = 22;
break;
}
if (this.shapeManager.checkObjectDragged (prevX, prevY, x, y, action, this.getVisibleFramesBitSet (), iShape)) {
this.refresh (1, "checkObjectDragged");
if (iShape == 22) this.scriptEcho (this.getShapeProperty (22, "command"));
}}, "~N,~N,~N,~N,~N");
Clazz.defineMethod (c$, "rotateAxisAngleAtCenter", 
function (eval, rotCenter, rotAxis, degreesPerSecond, endDegrees, isSpin, bsSelected) {
var isOK = this.transformManager.rotateAxisAngleAtCenter (eval, rotCenter, rotAxis, degreesPerSecond, endDegrees, isSpin, bsSelected);
if (isOK) this.refresh (-1, "rotateAxisAngleAtCenter");
return isOK;
}, "J.api.JmolScriptEvaluator,J.util.P3,J.util.V3,~N,~N,~B,J.util.BS");
Clazz.defineMethod (c$, "rotateAboutPointsInternal", 
function (eval, point1, point2, degreesPerSecond, endDegrees, isSpin, bsSelected, translation, finalPoints) {
var isOK = this.transformManager.rotateAboutPointsInternal (eval, point1, point2, degreesPerSecond, endDegrees, false, isSpin, bsSelected, false, translation, finalPoints);
if (isOK) this.refresh (-1, "rotateAxisAboutPointsInternal");
return isOK;
}, "J.api.JmolScriptEvaluator,J.util.P3,J.util.P3,~N,~N,~B,J.util.BS,J.util.V3,java.util.List");
Clazz.defineMethod (c$, "getPickingSpinRate", 
function () {
return this.global.pickingSpinRate;
});
Clazz.defineMethod (c$, "startSpinningAxis", 
function (pt1, pt2, isClockwise) {
if (this.getSpinOn () || this.getNavOn ()) {
this.setSpinOn (false);
this.setNavOn (false);
return;
}this.transformManager.rotateAboutPointsInternal (null, pt1, pt2, this.global.pickingSpinRate, 3.4028235E38, isClockwise, true, null, false, null, null);
}, "J.util.P3,J.util.P3,~B");
Clazz.defineMethod (c$, "getModelDipole", 
function () {
return this.modelSet.getModelDipole (this.animationManager.currentModelIndex);
});
Clazz.defineMethod (c$, "calculateMolecularDipole", 
function () {
return this.modelSet.calculateMolecularDipole (this.animationManager.currentModelIndex);
});
Clazz.defineMethod (c$, "getDipoleScale", 
function () {
return this.global.dipoleScale;
});
Clazz.defineMethod (c$, "getAtomIdentityInfo", 
function (atomIndex, info) {
this.getPropertyManager ().getAtomIdentityInfo (atomIndex, info);
}, "~N,java.util.Map");
Clazz.defineMethod (c$, "setDefaultLattice", 
function (ptLattice) {
this.global.setDefaultLattice (ptLattice);
this.global.setS ("defaultLattice", J.util.Escape.eP (ptLattice));
}, "J.util.P3");
Clazz.defineMethod (c$, "getDefaultLattice", 
function () {
return this.global.getDefaultLattice ();
});
Clazz.defineMethod (c$, "getTaintedAtoms", 
function (type) {
return this.modelSet.getTaintedAtoms (type);
}, "~N");
Clazz.defineMethod (c$, "setTaintedAtoms", 
function (bs, type) {
this.modelSet.setTaintedAtoms (bs, type);
}, "J.util.BS,~N");
Clazz.defineMethod (c$, "getData", 
function (atomExpression, type) {
var exp = "";
if (type.equalsIgnoreCase ("MOL") || type.equalsIgnoreCase ("SDF") || type.equalsIgnoreCase ("V2000") || type.equalsIgnoreCase ("V3000") || type.equalsIgnoreCase ("XYZVIB") || type.equalsIgnoreCase ("CD")) return this.getModelExtract (atomExpression, false, false, type);
if (type.toLowerCase ().indexOf ("property_") == 0) exp = "{selected}.label(\"%{" + type + "}\")";
 else if (type.equalsIgnoreCase ("CML")) return this.getModelCml (this.getAtomBitSet (atomExpression), 2147483647, true);
 else if (type.equalsIgnoreCase ("PDB")) exp = "{selected and not hetero}.label(\"ATOM  %5i %-4a%1A%3.3n %1c%4R%1E   %8.3x%8.3y%8.3z%6.2Q%6.2b          %2e  \").lines+{selected and hetero}.label(\"HETATM%5i %-4a%1A%3.3n %1c%4R%1E   %8.3x%8.3y%8.3z%6.2Q%6.2b          %2e  \").lines";
 else if (type.equalsIgnoreCase ("XYZRN")) exp = "\"\" + {selected}.size + \"\n\n\"+{selected}.label(\"%-2e %8.3x %8.3y %8.3z %4.2[vdw] 1 [%n]%r.%a#%i\").lines";
 else if (type.startsWith ("USER:")) exp = "{selected}.label(\"" + type.substring (5) + "\").lines";
 else exp = "\"\" + {selected}.size + \"\n\n\"+{selected}.label(\"%-2e %10.5x %10.5y %10.5z\").lines";
if (!atomExpression.equals ("selected")) exp = J.util.TextFormat.simpleReplace (exp, "selected", atomExpression);
return this.evaluateExpression (exp);
}, "~S,~S");
Clazz.defineMethod (c$, "getModelCml", 
function (bs, nAtomsMax, addBonds) {
return this.modelSet.getModelCml (bs, nAtomsMax, addBonds);
}, "J.util.BS,~N,~B");
Clazz.defineMethod (c$, "getHelixData", 
function (bs, tokType) {
return this.modelSet.getHelixData (bs, tokType);
}, "J.util.BS,~N");
Clazz.defineMethod (c$, "getPdbData", 
function (bs, sb) {
if (bs == null) bs = this.getSelectionSet (true);
return this.modelSet.getPdbAtomData (bs, sb);
}, "J.util.BS,J.io.OutputStringBuilder");
Clazz.defineMethod (c$, "isJmolDataFrameForModel", 
function (modelIndex) {
return this.modelSet.isJmolDataFrameForModel (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "isJmolDataFrame", 
function () {
return this.modelSet.isJmolDataFrameForModel (this.animationManager.currentModelIndex);
});
Clazz.defineMethod (c$, "getJmolDataFrameIndex", 
function (modelIndex, type) {
return this.modelSet.getJmolDataFrameIndex (modelIndex, type);
}, "~N,~S");
Clazz.defineMethod (c$, "setJmolDataFrame", 
function (type, modelIndex, dataIndex) {
this.modelSet.setJmolDataFrame (type, modelIndex, dataIndex);
}, "~S,~N,~N");
Clazz.defineMethod (c$, "setFrameTitle", 
function (modelIndex, title) {
this.modelSet.setFrameTitle (J.util.BSUtil.newAndSetBit (modelIndex), title);
}, "~N,~S");
Clazz.defineMethod (c$, "setFrameTitleObj", 
function (title) {
this.loadShape (29);
this.modelSet.setFrameTitle (this.getVisibleFramesBitSet (), title);
}, "~O");
Clazz.defineMethod (c$, "getFrameTitle", 
function () {
return this.modelSet.getFrameTitle (this.animationManager.currentModelIndex);
});
Clazz.defineMethod (c$, "getJmolFrameType", 
function (modelIndex) {
return this.modelSet.getJmolFrameType (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "getJmolDataSourceFrame", 
function (modelIndex) {
return this.modelSet.getJmolDataSourceFrame (modelIndex);
}, "~N");
Clazz.defineMethod (c$, "setAtomProperty", 
function (bs, tok, iValue, fValue, sValue, values, list) {
if (tok == 1649412112) this.shapeManager.deleteVdwDependentShapes (bs);
this.clearMinimization ();
this.modelSet.setAtomProperty (bs, tok, iValue, fValue, sValue, values, list);
switch (tok) {
case 1112541185:
case 1112541186:
case 1112541187:
case 1112541188:
case 1112541189:
case 1112541190:
case 1112539151:
case 1112539152:
case 1112539153:
case 1087375365:
this.refreshMeasures (true);
}
}, "J.util.BS,~N,~N,~N,~S,~A,~A");
Clazz.defineMethod (c$, "checkCoordinatesChanged", 
function () {
this.modelSet.recalculatePositionDependentQuantities (null, null);
this.refreshMeasures (true);
});
Clazz.defineMethod (c$, "setAtomCoord", 
function (atomIndex, x, y, z) {
this.modelSet.setAtomCoord (atomIndex, x, y, z);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "setAtomCoordRelative", 
function (atomIndex, x, y, z) {
this.modelSet.setAtomCoordRelative (atomIndex, x, y, z);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "setAtomCoord", 
function (bs, tokType, xyzValues) {
if (bs.cardinality () == 0) return;
this.modelSet.setAtomCoord (bs, tokType, xyzValues);
this.checkMinimization ();
this.statusManager.setStatusAtomMoved (bs);
}, "J.util.BS,~N,~O");
Clazz.defineMethod (c$, "setAtomCoordRelative", 
function (offset, bs) {
if (bs == null) bs = this.getSelectionSet (false);
if (bs.cardinality () == 0) return;
this.modelSet.setAtomCoordRelative (offset, bs);
this.checkMinimization ();
this.statusManager.setStatusAtomMoved (bs);
}, "J.util.Tuple3f,J.util.BS");
Clazz.defineMethod (c$, "allowRotateSelected", 
function () {
return this.global.allowRotateSelected;
});
Clazz.defineMethod (c$, "invertAtomCoordPt", 
function (pt, bs) {
this.modelSet.invertSelected (pt, null, -1, null, bs);
this.checkMinimization ();
this.statusManager.setStatusAtomMoved (bs);
}, "J.util.P3,J.util.BS");
Clazz.defineMethod (c$, "invertAtomCoordPlane", 
function (plane, bs) {
this.modelSet.invertSelected (null, plane, -1, null, bs);
this.checkMinimization ();
this.statusManager.setStatusAtomMoved (bs);
}, "J.util.Point4f,J.util.BS");
Clazz.defineMethod (c$, "invertSelected", 
function (pt, plane, iAtom, invAtoms) {
var bs = this.getSelectionSet (false);
if (bs.cardinality () == 0) return;
this.modelSet.invertSelected (pt, plane, iAtom, invAtoms, bs);
this.checkMinimization ();
this.statusManager.setStatusAtomMoved (bs);
}, "J.util.P3,J.util.Point4f,~N,J.util.BS");
Clazz.defineMethod (c$, "moveAtoms", 
function (mNew, matrixRotate, translation, center, isInternal, bsAtoms) {
if (bsAtoms.cardinality () == 0) return;
this.modelSet.moveAtoms (mNew, matrixRotate, translation, bsAtoms, center, isInternal);
this.checkMinimization ();
this.statusManager.setStatusAtomMoved (bsAtoms);
}, "J.util.Matrix3f,J.util.Matrix3f,J.util.V3,J.util.P3,~B,J.util.BS");
Clazz.defineMethod (c$, "moveSelected", 
function (deltaX, deltaY, deltaZ, x, y, bsSelected, isTranslation, asAtoms) {
if (deltaZ == 0) return;
if (x == -2147483648) this.rotateBondIndex = -1;
if (this.isJmolDataFrame ()) return;
if (deltaX == -2147483648) {
this.showSelected = true;
this.loadShape (8);
this.refresh (6, "moveSelected");
return;
}if (deltaX == 2147483647) {
if (!this.showSelected) return;
this.showSelected = false;
this.refresh (6, "moveSelected");
return;
}if (this.movingSelected) return;
this.movingSelected = true;
this.stopMinimization ();
if (this.rotateBondIndex >= 0 && x != -2147483648) {
this.actionRotateBond (deltaX, deltaY, x, y);
} else {
bsSelected = this.setMovableBitSet (bsSelected, !asAtoms);
if (bsSelected.cardinality () != 0) {
if (isTranslation) {
var ptCenter = this.getAtomSetCenter (bsSelected);
this.transformManager.finalizeTransformParameters ();
var f = (this.global.antialiasDisplay ? 2 : 1);
var ptScreen = this.transformPt (ptCenter);
var ptScreenNew;
if (deltaZ != -2147483648) ptScreenNew = J.util.P3.new3 (ptScreen.x, ptScreen.y, ptScreen.z + deltaZ + 0.5);
 else ptScreenNew = J.util.P3.new3 (ptScreen.x + deltaX * f + 0.5, ptScreen.y + deltaY * f + 0.5, ptScreen.z);
var ptNew =  new J.util.P3 ();
this.unTransformPoint (ptScreenNew, ptNew);
ptNew.sub (ptCenter);
this.setAtomCoordRelative (ptNew, bsSelected);
} else {
this.transformManager.rotateXYBy (deltaX, deltaY, bsSelected);
}}}this.refresh (2, "");
this.movingSelected = false;
}, "~N,~N,~N,~N,~N,J.util.BS,~B,~B");
Clazz.defineMethod (c$, "highlightBond", 
function (index, isHover) {
if (isHover && !this.hoverEnabled) return;
var bs = null;
if (index >= 0) {
var b = this.modelSet.bonds[index];
var i = b.getAtomIndex2 ();
if (!this.isAtomAssignable (i)) return;
bs = J.util.BSUtil.newAndSetBit (i);
bs.set (b.getAtomIndex1 ());
}this.highlight (bs);
this.refresh (3, "highlightBond");
}, "~N,~B");
Clazz.defineMethod (c$, "highlight", 
function (bs) {
if (bs != null) this.loadShape (8);
this.setShapeProperty (8, "highlight", bs);
}, "J.util.BS");
Clazz.defineMethod (c$, "setRotateBondIndex", 
function (index) {
var haveBond = (this.rotateBondIndex >= 0);
if (!haveBond && index < 0) return;
this.rotatePrev1 = -1;
this.bsRotateBranch = null;
if (index == -2147483648) return;
this.rotateBondIndex = index;
this.highlightBond (index, false);
}, "~N");
Clazz.defineMethod (c$, "getRotateBondIndex", 
function () {
return this.rotateBondIndex;
});
Clazz.defineMethod (c$, "actionRotateBond", 
function (deltaX, deltaY, x, y) {
if (this.rotateBondIndex < 0) return;
var bsBranch = this.bsRotateBranch;
var atom1;
var atom2;
if (bsBranch == null) {
var b = this.modelSet.bonds[this.rotateBondIndex];
atom1 = b.getAtom1 ();
atom2 = b.getAtom2 ();
this.undoMoveActionClear (atom1.index, 2, true);
var pt = J.util.P3.new3 (x, y, Clazz.doubleToInt ((atom1.screenZ + atom2.screenZ) / 2));
this.transformManager.unTransformPoint (pt, pt);
if (atom2.getCovalentBondCount () == 1 || pt.distance (atom1) < pt.distance (atom2) && atom1.getCovalentBondCount () != 1) {
var a = atom1;
atom1 = atom2;
atom2 = a;
}if (J.util.Measure.computeAngleABC (pt, atom1, atom2, true) > 90 || J.util.Measure.computeAngleABC (pt, atom2, atom1, true) > 90) {
bsBranch = this.getBranchBitSet (atom2.index, atom1.index);
}if (bsBranch != null) for (var n = 0, i = atom1.getBonds ().length; --i >= 0; ) {
if (bsBranch.get (atom1.getBondedAtomIndex (i)) && ++n == 2) {
bsBranch = null;
break;
}}
if (bsBranch == null) {
bsBranch = this.getMoleculeBitSet (atom1.index);
}this.bsRotateBranch = bsBranch;
this.rotatePrev1 = atom1.index;
this.rotatePrev2 = atom2.index;
} else {
atom1 = this.modelSet.atoms[this.rotatePrev1];
atom2 = this.modelSet.atoms[this.rotatePrev2];
}var v1 = J.util.V3.new3 (atom2.screenX - atom1.screenX, atom2.screenY - atom1.screenY, 0);
var v2 = J.util.V3.new3 (deltaX, deltaY, 0);
v1.cross (v1, v2);
var degrees = (v1.z > 0 ? 1 : -1) * v2.length ();
var bs = J.util.BSUtil.copy (bsBranch);
bs.andNot (this.selectionManager.getMotionFixedAtoms ());
this.rotateAboutPointsInternal (this.eval, atom1, atom2, 0, degrees, false, bs, null, null);
}, "~N,~N,~N,~N");
Clazz.defineMethod (c$, "refreshMeasures", 
function (andStopMinimization) {
this.setShapeProperty (6, "refresh", null);
if (andStopMinimization) this.stopMinimization ();
}, "~B");
Clazz.defineMethod (c$, "setDynamicMeasurements", 
function (TF) {
this.global.dynamicMeasurements = TF;
}, "~B");
Clazz.defineMethod (c$, "getDynamicMeasurements", 
function () {
return this.global.dynamicMeasurements;
});
Clazz.defineMethod (c$, "functionXY", 
function (functionName, nX, nY) {
var data = null;
if (functionName.indexOf ("file:") == 0) data = this.getFileAsString (functionName.substring (5));
 else if (functionName.indexOf ("data2d_") != 0) return this.statusManager.functionXY (functionName, nX, nY);
nX = Math.abs (nX);
nY = Math.abs (nY);
var fdata;
if (data == null) {
fdata = this.getDataFloat2D (functionName);
if (fdata != null) return fdata;
data = "";
}fdata =  Clazz.newFloatArray (nX, nY, 0);
var f =  Clazz.newFloatArray (nX * nY, 0);
J.util.Parser.parseStringInfestedFloatArray (data, null, f);
for (var i = 0, n = 0; i < nX; i++) for (var j = 0; j < nY; j++) fdata[i][j] = f[n++];


return fdata;
}, "~S,~N,~N");
Clazz.defineMethod (c$, "functionXYZ", 
function (functionName, nX, nY, nZ) {
var data = null;
if (functionName.indexOf ("file:") == 0) data = this.getFileAsString (functionName.substring (5));
 else if (functionName.indexOf ("data3d_") != 0) return this.statusManager.functionXYZ (functionName, nX, nY, nZ);
nX = Math.abs (nX);
nY = Math.abs (nY);
nZ = Math.abs (nZ);
var xyzdata;
if (data == null) {
xyzdata = this.getDataFloat3D (functionName);
if (xyzdata != null) return xyzdata;
data = "";
}xyzdata =  Clazz.newFloatArray (nX, nY, nZ, 0);
var f =  Clazz.newFloatArray (nX * nY * nZ, 0);
J.util.Parser.parseStringInfestedFloatArray (data, null, f);
for (var i = 0, n = 0; i < nX; i++) for (var j = 0; j < nY; j++) for (var k = 0; k < nZ; k++) xyzdata[i][j][k] = f[n++];



return xyzdata;
}, "~S,~N,~N,~N");
Clazz.defineMethod (c$, "showNMR", 
function (smiles) {
this.showUrl (this.global.nmrUrlFormat + J.util.Escape.escapeUrl (this.getChemicalInfo (smiles, '/', "smiles")));
}, "~S");
Clazz.defineMethod (c$, "getHelp", 
function (what) {
if (this.global.helpPath.indexOf ("?") < 0) {
if (what.length > 0 && what.indexOf ("?") != 0) what = "?search=" + J.util.TextFormat.simpleReplace (what, " ", "%20");
what += (what.length == 0 ? "?ver=" : "&ver=") + J.viewer.JC.version;
} else {
what = "&" + what;
}this.showUrl (this.global.helpPath + what);
}, "~S");
Clazz.defineMethod (c$, "show2D", 
function (smiles) {
this.showUrl (this.setLoadFormat ("_" + smiles, '2', false));
}, "~S");
Clazz.defineMethod (c$, "getChemicalInfo", 
function (smiles, type, info) {
var s = this.setLoadFormat ("_" + smiles, type, false);
if (type == '/') s += J.util.TextFormat.simpleReplace (info, " ", "%20");
return this.getFileAsStringBin (s, 2147483647, false, false);
}, "~S,~S,~S");
Clazz.defineMethod (c$, "addCommand", 
function (command) {
if (this.autoExit || !this.haveDisplay || !this.getPreserveState ()) return;
this.commandHistory.addCommand (J.util.TextFormat.replaceAllCharacters (command, "\r\n\t", " "));
}, "~S");
Clazz.defineMethod (c$, "removeCommand", 
function () {
return this.commandHistory.removeCommand ();
});
Clazz.overrideMethod (c$, "getSetHistory", 
function (howFarBack) {
return this.commandHistory.getSetHistory (howFarBack);
}, "~N");
Clazz.defineMethod (c$, "getOutputStream", 
function (localName, fullPath) {
return this.getStateCreator ().getOutputStream (localName, fullPath);
}, "~S,~A");
Clazz.overrideMethod (c$, "writeTextFile", 
function (fileName, data) {
this.createImage (fileName, "txt", data, -2147483648, 0, 0);
}, "~S,~S");
Clazz.overrideMethod (c$, "clipImage", 
function (text) {
if (!this.isRestricted (J.viewer.Viewer.ACCESS.ALL)) return "no";
var c;
try {
c = this.getImageCreator ();
return c.clipImage (this, text);
} catch (er) {
if (Clazz.exceptionOf (er, Error)) {
return J.i18n.GT._ ("clipboard is not accessible -- use signed applet");
} else {
throw er;
}
}
}, "~S");
Clazz.defineMethod (c$, "createImageSet", 
function (fileName, type, text, bytes, scripts, quality, width, height, bsFrames, nVibes, fullPath) {
return this.getStateCreator ().createImageSet (fileName, type, text, bytes, scripts, quality, width, height, bsFrames, nVibes, fullPath);
}, "~S,~S,~S,~A,~A,~N,~N,~N,J.util.BS,~N,~A");
Clazz.defineMethod (c$, "createZip", 
function (fileName, type, stateInfo, scripts) {
return this.getStateCreator ().createImagePathCheck (fileName, type, stateInfo, null, scripts, null, -2147483648, -1, -1, null, true);
}, "~S,~S,~S,~A");
Clazz.defineMethod (c$, "createImage", 
function (fileName, type, text_or_bytes, quality, width, height) {
var text = (Clazz.instanceOf (text_or_bytes, String) ? text_or_bytes : null);
var bytes = (Clazz.instanceOf (text_or_bytes, Array) ? text_or_bytes : null);
return this.getStateCreator ().createImagePathCheck (fileName, type, text, bytes, null, null, quality, width, height, null, true);
}, "~S,~S,~O,~N,~N,~N");
Clazz.defineMethod (c$, "createImage", 
function (fileName, type, text, bytes, quality, width, height) {
return this.getStateCreator ().createImagePathCheck (fileName, type, text, bytes, null, null, quality, width, height, null, true);
}, "~S,~S,~S,~A,~N,~N,~N");
Clazz.defineMethod (c$, "getImageCreator", 
function () {
return (J.api.Interface.getOptionInterface (this.isJS2D ? "exportjs.JSImageCreator" : "export.image.AwtImageCreator")).setViewer (this, this.privateKey);
});
Clazz.defineMethod (c$, "setSyncTarget", 
($fz = function (mode, TF) {
switch (mode) {
case 0:
this.statusManager.syncingMouse = TF;
break;
case 1:
this.statusManager.syncingScripts = TF;
break;
case 2:
this.statusManager.syncSend (TF ? "GET_GRAPHICS" : "SET_GRAPHICS_OFF", "*", 0);
if (Float.isNaN (this.transformManager.stereoDegrees)) this.setFloatProperty ("stereoDegrees", -5);
if (TF) {
this.setBooleanProperty ("_syncMouse", false);
this.setBooleanProperty ("_syncScript", false);
}return;
}
if (!this.statusManager.syncingScripts && !this.statusManager.syncingMouse) this.refresh (-1, "set sync");
}, $fz.isPrivate = true, $fz), "~N,~B");
Clazz.overrideMethod (c$, "syncScript", 
function (script, applet, port) {
this.getStateCreator ().syncScript (script, applet, port);
}, "~S,~S,~N");
Clazz.defineMethod (c$, "getModelIndexFromId", 
function (id) {
return this.modelSet.getModelIndexFromId (id);
}, "~S");
Clazz.defineMethod (c$, "setSyncDriver", 
function (mode) {
this.statusManager.setSyncDriver (mode);
}, "~N");
Clazz.defineMethod (c$, "getPartialCharges", 
function () {
return this.modelSet.getPartialCharges ();
});
Clazz.defineMethod (c$, "getAtomicPotentials", 
function (isMep, bsSelected, bsIgnore, fileName) {
var potentials =  Clazz.newFloatArray (this.getAtomCount (), 0);
var m = J.api.Interface.getOptionInterface ("quantum.MlpCalculation");
var data = (fileName == null ? null : this.getFileAsString (fileName));
m.assignPotentials (this.modelSet.atoms, potentials, this.getSmartsMatch ("a", bsSelected), this.getSmartsMatch ("/noAromatic/[$(C=O),$(O=C),$(NC=O)]", bsSelected), bsIgnore, data);
return potentials;
}, "~B,J.util.BS,J.util.BS,~S");
Clazz.defineMethod (c$, "setProteinType", 
function (type, bs) {
this.modelSet.setProteinType (bs == null ? this.getSelectionSet (false) : bs, type);
}, "J.constant.EnumStructure,J.util.BS");
Clazz.overrideMethod (c$, "getBondPoint3f1", 
function (i) {
return this.modelSet.getBondAtom1 (i);
}, "~N");
Clazz.overrideMethod (c$, "getBondPoint3f2", 
function (i) {
return this.modelSet.getBondAtom2 (i);
}, "~N");
Clazz.defineMethod (c$, "getVibrationVector", 
function (atomIndex) {
return this.modelSet.getVibrationVector (atomIndex, false);
}, "~N");
Clazz.defineMethod (c$, "getVanderwaalsMar", 
function (i) {
return (this.dataManager.defaultVdw === J.constant.EnumVdw.USER ? this.dataManager.userVdwMars[i] : J.util.Elements.getVanderwaalsMar (i, this.dataManager.defaultVdw));
}, "~N");
Clazz.defineMethod (c$, "getVanderwaalsMarType", 
function (i, type) {
if (type == null) type = this.dataManager.defaultVdw;
 else switch (type) {
case J.constant.EnumVdw.USER:
if (this.dataManager.bsUserVdws == null) type = this.dataManager.defaultVdw;
 else return this.dataManager.userVdwMars[i];
break;
case J.constant.EnumVdw.AUTO:
case J.constant.EnumVdw.JMOL:
case J.constant.EnumVdw.BABEL:
case J.constant.EnumVdw.RASMOL:
if (this.dataManager.defaultVdw !== J.constant.EnumVdw.AUTO) type = this.dataManager.defaultVdw;
break;
}
return (J.util.Elements.getVanderwaalsMar (i, type));
}, "~N,J.constant.EnumVdw");
Clazz.defineMethod (c$, "setDefaultVdw", 
function (type) {
var vType = J.constant.EnumVdw.getVdwType (type);
if (vType == null) vType = J.constant.EnumVdw.AUTO;
this.dataManager.setDefaultVdw (vType);
this.global.setS ("defaultVDW", this.getDefaultVdwTypeNameOrData (-2147483648, null));
}, "~S");
Clazz.defineMethod (c$, "getDefaultVdwTypeNameOrData", 
function (iMode, vType) {
return this.dataManager.getDefaultVdwNameOrData (iMode, vType, null);
}, "~N,J.constant.EnumVdw");
Clazz.defineMethod (c$, "deleteAtoms", 
function (bs, fullModels) {
this.clearModelDependentObjects ();
if (!fullModels) {
this.modelSet.deleteAtoms (bs);
var n = this.selectionManager.deleteAtoms (bs);
this.setTainted (true);
return n;
}if (bs.cardinality () == 0) return 0;
this.setCurrentModelIndexClear (0, false);
this.animationManager.setAnimationOn (false);
var bsD0 = J.util.BSUtil.copy (this.getDeletedAtoms ());
var bsDeleted = this.modelSet.deleteModels (bs);
this.selectionManager.processDeletedModelAtoms (bsDeleted);
this.setAnimationRange (0, 0);
if (this.eval != null) this.eval.deleteAtomsInVariables (bsDeleted);
this.clearRepaintManager (-1);
this.animationManager.clear ();
this.animationManager.initializePointers (1);
this.setCurrentModelIndexClear (this.getModelCount () > 1 ? -1 : 0, this.getModelCount () > 1);
this.hoverAtomIndex = -1;
this.setFileLoadStatus (J.constant.EnumFileStatus.DELETED, null, null, null, null, null);
this.refreshMeasures (true);
if (bsD0 != null) bsDeleted.andNot (bsD0);
return J.util.BSUtil.cardinalityOf (bsDeleted);
}, "J.util.BS,~B");
Clazz.defineMethod (c$, "deleteBonds", 
function (bsDeleted) {
this.modelSet.deleteBonds (bsDeleted, false);
}, "J.util.BS");
Clazz.defineMethod (c$, "deleteModelAtoms", 
function (firstAtomIndex, nAtoms, bsDeleted) {
this.selectionManager.deleteModelAtoms (bsDeleted);
J.util.BSUtil.deleteBits (this.getFrameOffsets (), bsDeleted);
this.setFrameOffsets (this.getFrameOffsets ());
this.dataManager.deleteModelAtoms (firstAtomIndex, nAtoms, bsDeleted);
}, "~N,~N,J.util.BS");
Clazz.defineMethod (c$, "getDeletedAtoms", 
function () {
return this.selectionManager.getDeletedAtoms ();
});
Clazz.defineMethod (c$, "getQuaternionFrame", 
function () {
return this.global.quaternionFrame.charAt (this.global.quaternionFrame.length == 2 ? 1 : 0);
});
Clazz.defineMethod (c$, "getHelixStep", 
function () {
return this.global.helixStep;
});
Clazz.defineMethod (c$, "calculatePointGroup", 
function () {
return this.modelSet.calculatePointGroup (this.getSelectionSet (false));
});
Clazz.defineMethod (c$, "getPointGroupInfo", 
function (atomExpression) {
return this.modelSet.getPointGroupInfo (this.getAtomBitSet (atomExpression));
}, "~O");
Clazz.defineMethod (c$, "getPointGroupAsString", 
function (asDraw, type, index, scale) {
return this.modelSet.getPointGroupAsString (this.getSelectionSet (false), asDraw, type, index, scale);
}, "~B,~S,~N,~N");
Clazz.defineMethod (c$, "getPointGroupTolerance", 
function (type) {
switch (type) {
case 0:
return this.global.pointGroupDistanceTolerance;
case 1:
return this.global.pointGroupLinearTolerance;
}
return 0;
}, "~N");
Clazz.defineMethod (c$, "loadImage", 
function (pathName, echoName) {
this.fileManager.loadImage (pathName, echoName);
}, "~S,~S");
Clazz.defineMethod (c$, "loadImageData", 
function (image, nameOrError, echoName, sc) {
if (image == null) J.util.Logger.info (nameOrError);
if (echoName == null) {
this.setBackgroundImage ((image == null ? null : nameOrError), image);
} else {
this.setShapeProperty (29, "text", nameOrError);
if (image != null) this.setShapeProperty (29, "image", image);
}if (sc != null) {
sc.mustResumeEval = true;
this.eval.resumeEval (sc);
}}, "~O,~S,~S,J.script.ScriptContext");
Clazz.defineMethod (c$, "cd", 
function (dir) {
if (dir == null) {
dir = ".";
} else if (dir.length == 0) {
this.setStringProperty ("defaultDirectory", "");
dir = ".";
}dir = this.fileManager.getDefaultDirectory (dir + (dir.equals ("=") ? "" : dir.endsWith ("/") ? "X.spt" : "/X.spt"));
if (dir.length > 0) this.setStringProperty ("defaultDirectory", dir);
var path = this.fileManager.getFilePath (dir + "/", true, false);
if (path.startsWith ("file:/")) J.viewer.FileManager.setLocalPath (this, dir, false);
return dir;
}, "~S");
Clazz.defineMethod (c$, "setErrorMessage", 
function (errMsg, errMsgUntranslated) {
this.errorMessageUntranslated = errMsgUntranslated;
return (this.errorMessage = errMsg);
}, "~S,~S");
Clazz.overrideMethod (c$, "getErrorMessage", 
function () {
return this.errorMessage;
});
Clazz.overrideMethod (c$, "getErrorMessageUn", 
function () {
return this.errorMessageUntranslated == null ? this.errorMessage : this.errorMessageUntranslated;
});
Clazz.defineMethod (c$, "setShapeErrorState", 
function (shapeID, state) {
this.currentShapeID = shapeID;
this.currentShapeState = state;
}, "~N,~S");
Clazz.defineMethod (c$, "getShapeErrorState", 
function () {
if (this.currentShapeID < 0) return "";
if (this.modelSet != null) this.shapeManager.releaseShape (this.currentShapeID);
this.clearRepaintManager (this.currentShapeID);
return J.viewer.JC.getShapeClassName (this.currentShapeID, false) + " " + this.currentShapeState;
});
Clazz.defineMethod (c$, "handleError", 
function (er, doClear) {
try {
if (doClear) this.zapMsg ("" + er);
this.undoClear ();
if (J.util.Logger.getLogLevel () == 0) J.util.Logger.setLogLevel (4);
this.setCursor (0);
this.setBooleanProperty ("refreshing", true);
this.fileManager.setPathForAllFiles ("");
J.util.Logger.error ("viewer handling error condition: " + er);
this.notifyError ("Error", "doClear=" + doClear + "; " + er, "" + er);
} catch (e1) {
try {
J.util.Logger.error ("Could not notify error " + er + ": due to " + e1);
} catch (er2) {
}
}
}, "Error,~B");
Clazz.defineMethod (c$, "getAtomicCharges", 
function () {
return this.modelSet.getAtomicCharges ();
});
Clazz.defineMethod (c$, "getFunctions", 
function (isStatic) {
return (isStatic ? J.viewer.Viewer.staticFunctions : this.localFunctions);
}, "~B");
Clazz.defineMethod (c$, "removeFunction", 
function (name) {
var $function = this.getFunction (name);
if ($function == null) return;
J.viewer.Viewer.staticFunctions.remove (name);
this.localFunctions.remove (name);
}, "~S");
Clazz.defineMethod (c$, "getFunction", 
function (name) {
if (name == null) return null;
var $function = (J.viewer.Viewer.isStaticFunction (name) ? J.viewer.Viewer.staticFunctions : this.localFunctions).get (name);
return ($function == null || $function.geTokens () == null ? null : $function);
}, "~S");
c$.isStaticFunction = Clazz.defineMethod (c$, "isStaticFunction", 
($fz = function (name) {
return name.startsWith ("static_");
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "isFunction", 
function (name) {
return (J.viewer.Viewer.isStaticFunction (name) ? J.viewer.Viewer.staticFunctions : this.localFunctions).containsKey (name);
}, "~S");
Clazz.defineMethod (c$, "clearFunctions", 
function () {
J.viewer.Viewer.staticFunctions.clear ();
this.localFunctions.clear ();
});
Clazz.defineMethod (c$, "addFunction", 
function ($function) {
var name = $function.getName ();
(J.viewer.Viewer.isStaticFunction (name) ? J.viewer.Viewer.staticFunctions : this.localFunctions).put (name, $function);
}, "J.api.JmolScriptFunction");
Clazz.defineMethod (c$, "getFunctionCalls", 
function (selectedFunction) {
return this.getStateCreator ().getFunctionCalls (selectedFunction);
}, "~S");
Clazz.defineMethod (c$, "showMessage", 
function (s) {
if (!this.isPrintOnly) J.util.Logger.warn (s);
}, "~S");
Clazz.defineMethod (c$, "getMoInfo", 
function (modelIndex) {
return this.modelSet.getMoInfo (modelIndex);
}, "~N");
Clazz.overrideMethod (c$, "checkPrivateKey", 
function (privateKey) {
return privateKey == this.privateKey;
}, "~N");
Clazz.defineMethod (c$, "bindAction", 
function (desc, name, range1, range2) {
if (this.haveDisplay) this.actionManager.bindAction (desc, name, range1, range2);
}, "~S,~S,J.util.P3,J.util.P3");
Clazz.defineMethod (c$, "unBindAction", 
function (desc, name) {
if (this.haveDisplay) this.actionManager.unbindAction (desc, name);
}, "~S,~S");
Clazz.defineMethod (c$, "getMouseInfo", 
function () {
return (this.haveDisplay ? this.actionManager.getMouseInfo () : null);
});
Clazz.defineMethod (c$, "getFrontPlane", 
function () {
return this.transformManager.getFrontPlane ();
});
Clazz.defineMethod (c$, "getPlaneIntersection", 
function (type, plane, scale, flags) {
return this.modelSet.getPlaneIntersection (type, plane, scale, flags, this.animationManager.currentModelIndex);
}, "~N,J.util.Point4f,~N,~N");
Clazz.defineMethod (c$, "calculateStruts", 
function (bs1, bs2) {
return this.modelSet.calculateStruts (bs1 == null ? this.getSelectionSet (false) : bs1, bs2 == null ? this.getSelectionSet (false) : bs2);
}, "J.util.BS,J.util.BS");
Clazz.defineMethod (c$, "getStrutsMultiple", 
function () {
return this.global.strutsMultiple;
});
Clazz.defineMethod (c$, "getStrutSpacingMinimum", 
function () {
return this.global.strutSpacing;
});
Clazz.defineMethod (c$, "getStrutLengthMaximum", 
function () {
return this.global.strutLengthMaximum;
});
Clazz.defineMethod (c$, "getStrutDefaultRadius", 
function () {
return this.global.strutDefaultRadius;
});
Clazz.defineMethod (c$, "getPreserveState", 
function () {
return (this.global.preserveState && this.scriptManager != null);
});
Clazz.defineMethod (c$, "getDragSelected", 
function () {
return this.global.dragSelected && !this.global.modelKitMode;
});
Clazz.defineMethod (c$, "getLoadAtomDataTolerance", 
function () {
return this.global.loadAtomDataTolerance;
});
Clazz.defineMethod (c$, "getAllowGestures", 
function () {
return this.global.allowGestures;
});
Clazz.defineMethod (c$, "getLogGestures", 
function () {
return this.global.logGestures;
});
Clazz.defineMethod (c$, "allowMultiTouch", 
function () {
return this.global.allowMultiTouch;
});
Clazz.defineMethod (c$, "logCommands", 
function () {
return this.global.logCommands;
});
Clazz.defineMethod (c$, "getLogFile", 
function () {
return (this.logFile == null ? "" : this.logFile);
});
Clazz.defineMethod (c$, "setLogFile", 
($fz = function (value) {
var path = null;
if (this.logFilePath == null || value.indexOf ("\\") >= 0 || value.indexOf ("/") >= 0) {
value = null;
} else if (value.length > 0) {
if (!value.startsWith ("JmolLog_")) value = "JmolLog_" + value;
try {
path = (this.$isApplet ? this.logFilePath + value : ( new java.io.File (this.logFilePath + value).getAbsolutePath ()));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
value = null;
} else {
throw e;
}
}
}if (value == null || !this.isRestricted (J.viewer.Viewer.ACCESS.ALL)) {
J.util.Logger.info (J.i18n.GT._ ("Cannot set log file path."));
value = null;
} else {
if (path != null) J.util.Logger.info (J.i18n.GT._ ("Setting log file to {0}", path));
this.logFile = path;
}return value;
}, $fz.isPrivate = true, $fz), "~S");
Clazz.overrideMethod (c$, "log", 
function (data) {
if (data != null) this.getStateCreator ().log (data);
}, "~S");
Clazz.defineMethod (c$, "isKiosk", 
function () {
return this.$isKiosk;
});
Clazz.defineMethod (c$, "hasFocus", 
function () {
return (this.haveDisplay && (this.$isKiosk || this.apiPlatform.hasFocus (this.display)));
});
Clazz.defineMethod (c$, "setFocus", 
function () {
if (this.haveDisplay && !this.apiPlatform.hasFocus (this.display)) this.apiPlatform.requestFocusInWindow (this.display);
});
Clazz.defineMethod (c$, "getMinimizer", 
function (createNew) {
if (this.minimizer == null && createNew) {
this.minimizer = J.api.Interface.getOptionInterface ("minimize.Minimizer");
this.minimizer.setProperty ("viewer", this);
}return this.minimizer;
}, "~B");
Clazz.defineMethod (c$, "stopMinimization", 
function () {
if (this.minimizer != null) {
this.minimizer.setProperty ("stop", null);
}});
Clazz.defineMethod (c$, "clearMinimization", 
function () {
if (this.minimizer != null) this.minimizer.setProperty ("clear", null);
});
Clazz.defineMethod (c$, "getMinimizationInfo", 
function () {
return (this.minimizer == null ? "" : this.minimizer.getProperty ("log", 0));
});
Clazz.defineMethod (c$, "useMinimizationThread", 
function () {
return this.global.useMinimizationThread && !this.autoExit;
});
Clazz.defineMethod (c$, "checkMinimization", 
($fz = function () {
this.refreshMeasures (true);
if (!this.global.monitorEnergy) return;
this.minimize (0, 0, this.getModelUndeletedAtomsBitSet (-1), null, 0, false, true, false);
this.echoMessage (this.getParameter ("_minimizationForceField") + " Energy = " + this.getParameter ("_minimizationEnergy"));
}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "minimize", 
function (steps, crit, bsSelected, bsFixed, rangeFixed, addHydrogen, isSilent, isLoad2D) {
var ff = this.global.forceField;
var bsInFrame = this.getModelUndeletedAtomsBitSetBs (this.getVisibleFramesBitSet ());
if (bsSelected == null) bsSelected = this.getModelUndeletedAtomsBitSet (this.getVisibleFramesBitSet ().length () - 1);
 else bsSelected.and (bsInFrame);
if (rangeFixed <= 0) rangeFixed = 5.0;
var bsMotionFixed = J.util.BSUtil.copy (bsFixed == null ? this.selectionManager.getMotionFixedAtoms () : bsFixed);
var haveFixed = (bsMotionFixed.cardinality () > 0);
if (haveFixed) bsSelected.andNot (bsMotionFixed);
var bsNearby = this.getAtomsWithinRadius (rangeFixed, bsSelected, true, null);
bsNearby.andNot (bsSelected);
if (haveFixed) {
bsMotionFixed.and (bsNearby);
} else {
bsMotionFixed = bsNearby;
}bsMotionFixed.and (bsInFrame);
if (addHydrogen) bsSelected.or (this.addHydrogens (bsSelected, isLoad2D, isSilent));
if (bsSelected.cardinality () > 200) {
J.util.Logger.error ("Too many atoms for minimization (>200)");
return;
}try {
if (!isSilent) J.util.Logger.info ("Minimizing " + bsSelected.cardinality () + " atoms");
this.getMinimizer (true).minimize (steps, crit, bsSelected, bsMotionFixed, haveFixed, isSilent, ff);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
J.util.Logger.error ("Minimization error: " + e.toString ());
} else {
throw e;
}
}
}, "~N,~N,J.util.BS,J.util.BS,~N,~B,~B,~B");
Clazz.defineMethod (c$, "setMotionFixedAtoms", 
function (bs) {
this.selectionManager.setMotionFixedAtoms (bs);
}, "J.util.BS");
Clazz.defineMethod (c$, "getMotionFixedAtoms", 
function () {
return this.selectionManager.getMotionFixedAtoms ();
});
Clazz.defineMethod (c$, "useArcBall", 
function () {
return this.global.useArcBall;
});
Clazz.defineMethod (c$, "rotateArcBall", 
function (x, y, factor) {
this.transformManager.rotateArcBall (x, y, factor);
this.refresh (2, this.statusManager.syncingMouse ? "Mouse: rotateArcBall " + x + " " + y + " " + factor : "");
}, "~N,~N,~N");
Clazz.defineMethod (c$, "getAtomicPropertyState", 
function (commands, type, bs, name, data) {
this.getStateCreator ().getAtomicPropertyStateBuffer (commands, type, bs, name, data);
}, "J.util.SB,~N,J.util.BS,~S,~A");
Clazz.defineMethod (c$, "getCenterAndPoints", 
function (atomSets, addCenter) {
return this.modelSet.getCenterAndPoints (atomSets, addCenter);
}, "java.util.List,~B");
Clazz.defineMethod (c$, "getSmallMoleculeMaxAtoms", 
function () {
return this.global.smallMoleculeMaxAtoms;
});
Clazz.defineMethod (c$, "streamFileData", 
function (fileName, type, type2, modelIndex, parameters) {
return this.getStateCreator ().streamFileData (fileName, type, type2, modelIndex, parameters);
}, "~S,~S,~S,~N,~A");
Clazz.defineMethod (c$, "getPdbData", 
function (modelIndex, type, parameters) {
return this.modelSet.getPdbData (modelIndex, type, this.getSelectionSet (false), parameters, null);
}, "~N,~S,~A");
Clazz.defineMethod (c$, "getRepaintWait", 
function () {
return this.global.repaintWaitMs;
});
Clazz.defineMethod (c$, "getGroupsWithin", 
function (nResidues, bs) {
return this.modelSet.getGroupsWithin (nResidues, bs);
}, "~N,J.util.BS");
Clazz.defineMethod (c$, "getExecutor", 
function () {
if (this.executor != null || J.viewer.Viewer.nProcessors < 2) return this.executor;
try {
this.executor = (J.api.Interface.getOptionInterface ("parallel.ScriptParallelProcessor")).getExecutor ();
} catch (e$$) {
if (Clazz.exceptionOf (e$$, Exception)) {
var e = e$$;
{
this.executor = null;
}
} else if (Clazz.exceptionOf (e$$, Error)) {
var er = e$$;
{
this.executor = null;
}
} else {
throw e$$;
}
}
if (this.executor == null) J.util.Logger.error ("parallel processing is not available");
return this.executor;
});
Clazz.defineMethod (c$, "getShapeInfo", 
function () {
return this.shapeManager.getShapeInfo ();
});
Clazz.defineMethod (c$, "togglePickingLabel", 
function (bs) {
if (bs == null) bs = this.getSelectionSet (false);
this.loadShape (5);
this.shapeManager.setShapePropertyBs (5, "toggleLabel", null, bs);
}, "J.util.BS");
Clazz.defineMethod (c$, "loadShape", 
function (shapeID) {
this.shapeManager.loadShape (shapeID);
}, "~N");
Clazz.defineMethod (c$, "setShapeSize", 
function (shapeID, mad, bsSelected) {
if (bsSelected == null) bsSelected = this.getSelectionSet (false);
this.shapeManager.setShapeSizeBs (shapeID, mad, null, bsSelected);
}, "~N,~N,J.util.BS");
Clazz.defineMethod (c$, "setShapeSize", 
function (shapeID, rd, bsAtoms) {
this.shapeManager.setShapeSizeBs (shapeID, 0, rd, bsAtoms);
}, "~N,J.atomdata.RadiusData,J.util.BS");
Clazz.defineMethod (c$, "setShapeProperty", 
function (shapeID, propertyName, value) {
if (shapeID < 0) return;
this.shapeManager.setShapePropertyBs (shapeID, propertyName, value, null);
}, "~N,~S,~O");
Clazz.defineMethod (c$, "getShapeProperty", 
function (shapeType, propertyName) {
return this.shapeManager.getShapePropertyIndex (shapeType, propertyName, -2147483648);
}, "~N,~S");
Clazz.defineMethod (c$, "getShapePropertyData", 
function (shapeType, propertyName, data) {
return this.shapeManager.getShapePropertyData (shapeType, propertyName, data);
}, "~N,~S,~A");
Clazz.defineMethod (c$, "getShapePropertyIndex", 
function (shapeType, propertyName, index) {
return this.shapeManager.getShapePropertyIndex (shapeType, propertyName, index);
}, "~N,~S,~N");
Clazz.defineMethod (c$, "getShapePropertyAsInt", 
($fz = function (shapeID, propertyName) {
var value = this.getShapeProperty (shapeID, propertyName);
return value == null || !(Clazz.instanceOf (value, Integer)) ? -2147483648 : (value).intValue ();
}, $fz.isPrivate = true, $fz), "~N,~S");
Clazz.defineMethod (c$, "setModelVisibility", 
function () {
if (this.shapeManager == null) return;
this.shapeManager.setModelVisibility ();
});
Clazz.defineMethod (c$, "resetShapes", 
function (andCreateNew) {
this.shapeManager.resetShapes ();
if (andCreateNew) {
this.shapeManager.loadDefaultShapes (this.modelSet);
this.clearRepaintManager (-1);
}}, "~B");
Clazz.defineMethod (c$, "setAtomLabel", 
function (value, i) {
this.shapeManager.setAtomLabel (value, i);
}, "~S,~N");
Clazz.defineMethod (c$, "deleteShapeAtoms", 
function (value, bs) {
this.shapeManager.deleteShapeAtoms (value, bs);
}, "~A,J.util.BS");
Clazz.defineMethod (c$, "resetBioshapes", 
function (bsAllAtoms) {
this.shapeManager.resetBioshapes (bsAllAtoms);
}, "J.util.BS");
Clazz.defineMethod (c$, "getAtomShapeValue", 
function (tok, group, atomIndex) {
return this.shapeManager.getAtomShapeValue (tok, group, atomIndex);
}, "~N,J.modelset.Group,~N");
Clazz.defineMethod (c$, "mergeShapes", 
function (newShapes) {
this.shapeManager.mergeShapes (newShapes);
}, "~A");
Clazz.defineMethod (c$, "getShapeManager", 
function () {
return this.shapeManager;
});
Clazz.defineMethod (c$, "setParallel", 
function (TF) {
return (this.$isParallel = this.global.multiProcessor && TF);
}, "~B");
Clazz.defineMethod (c$, "isParallel", 
function () {
return this.global.multiProcessor && this.$isParallel;
});
Clazz.defineMethod (c$, "getRenderableBitSet", 
function () {
return this.shapeManager.getRenderableBitSet ();
});
Clazz.defineMethod (c$, "setAtomPickingOption", 
($fz = function (option) {
if (this.haveDisplay) this.actionManager.setAtomPickingOption (option);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "setBondPickingOption", 
($fz = function (option) {
if (this.haveDisplay) this.actionManager.setBondPickingOption (option);
}, $fz.isPrivate = true, $fz), "~S");
Clazz.defineMethod (c$, "undoClear", 
function () {
this.actionStates.clear ();
this.actionStatesRedo.clear ();
});
Clazz.defineMethod (c$, "undoMoveAction", 
function (action, n) {
this.getStateCreator ().undoMoveAction (action, n);
}, "~N,~N");
Clazz.defineMethod (c$, "undoMoveActionClear", 
function (taintedAtom, type, clearRedo) {
if (!this.global.preserveState) return;
this.getStateCreator ().undoMoveActionClear (taintedAtom, type, clearRedo);
}, "~N,~N,~B");
Clazz.defineMethod (c$, "assignBond", 
function (bondIndex, type) {
try {
var bsAtoms = this.modelSet.setBondOrder (bondIndex, type);
if (bsAtoms == null || type == '0') this.refresh (3, "setBondOrder");
 else this.addHydrogens (bsAtoms, false, true);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
J.util.Logger.error ("assignBond failed");
} else {
throw e;
}
}
}, "~N,~S");
Clazz.defineMethod (c$, "assignAtom", 
function (atomIndex, pt, type) {
if (type.equals ("X")) this.setRotateBondIndex (-1);
if (this.modelSet.atoms[atomIndex].modelIndex != this.modelSet.modelCount - 1) return;
this.clearModelDependentObjects ();
if (pt == null) {
this.modelSet.assignAtom (atomIndex, type, true);
this.modelSet.setAtomNamesAndNumbers (atomIndex, -1, null);
this.refresh (3, "assignAtom");
return;
}var atom = this.modelSet.atoms[atomIndex];
var bs = J.util.BSUtil.newAndSetBit (atomIndex);
var pts = [pt];
var vConnections =  new java.util.ArrayList ();
vConnections.add (atom);
try {
bs = this.addHydrogensInline (bs, vConnections, pts);
atomIndex = bs.nextSetBit (0);
this.modelSet.assignAtom (atomIndex, type, false);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
this.modelSet.setAtomNamesAndNumbers (atomIndex, -1, null);
}, "~N,J.util.P3,~S");
Clazz.defineMethod (c$, "assignConnect", 
function (index, index2) {
this.clearModelDependentObjects ();
var connections = J.util.ArrayUtil.newFloat2 (1);
connections[0] = [index, index2];
this.modelSet.connect (connections);
this.modelSet.assignAtom (index, ".", true);
this.modelSet.assignAtom (index2, ".", true);
this.refresh (3, "assignConnect");
}, "~N,~N");
Clazz.defineMethod (c$, "moveAtomWithHydrogens", 
function (atomIndex, deltaX, deltaY, deltaZ, bsAtoms) {
this.stopMinimization ();
if (bsAtoms == null) {
var atom = this.modelSet.atoms[atomIndex];
bsAtoms = J.util.BSUtil.newAndSetBit (atomIndex);
var bonds = atom.getBonds ();
if (bonds != null) for (var i = 0; i < bonds.length; i++) {
var atom2 = bonds[i].getOtherAtom (atom);
if (atom2.getElementNumber () == 1) bsAtoms.set (atom2.index);
}
}this.moveSelected (deltaX, deltaY, deltaZ, -2147483648, -2147483648, bsAtoms, true, true);
}, "~N,~N,~N,~N,J.util.BS");
c$.getInlineData = Clazz.defineMethod (c$, "getInlineData", 
function (loadScript, strModel, isAppend) {
J.viewer.DataManager.getInlineData (loadScript, strModel, isAppend, null);
}, "J.util.SB,~S,~B");
Clazz.defineMethod (c$, "isAtomPDB", 
function (i) {
return this.modelSet.isAtomPDB (i);
}, "~N");
Clazz.defineMethod (c$, "isModelPDB", 
function (i) {
return this.modelSet.models[i].isBioModel;
}, "~N");
Clazz.defineMethod (c$, "isAtomAssignable", 
function (i) {
return this.modelSet.isAtomAssignable (i);
}, "~N");
Clazz.overrideMethod (c$, "deleteMeasurement", 
function (i) {
this.setShapeProperty (6, "delete", Integer.$valueOf (i));
}, "~N");
Clazz.defineMethod (c$, "haveModelKit", 
function () {
return this.modelSet.haveModelKit ();
});
Clazz.defineMethod (c$, "getModelKitStateBitSet", 
function (bs, bsDeleted) {
return this.modelSet.getModelKitStateBitset (bs, bsDeleted);
}, "J.util.BS,J.util.BS");
Clazz.defineMethod (c$, "getSmiles", 
function (index1, index2, bsSelected, isBioSmiles, allowUnmatchedRings, addCrossLinks, addComment) {
var atoms = this.modelSet.atoms;
if (bsSelected == null) {
if (index1 < 0 || index2 < 0) {
bsSelected = this.getSelectionSet (true);
} else {
if (isBioSmiles) {
if (index1 > index2) {
var i = index1;
index1 = index2;
index2 = i;
}index1 = atoms[index1].getGroup ().firstAtomIndex;
index2 = atoms[index2].getGroup ().lastAtomIndex;
}bsSelected =  new J.util.BS ();
bsSelected.setBits (index1, index2 + 1);
}}var comment = (addComment ? J.viewer.Viewer.getJmolVersion () + " " + this.getModelName (this.getCurrentModelIndex ()) : null);
return this.getSmilesMatcher ().getSmiles (atoms, this.getAtomCount (), bsSelected, isBioSmiles, allowUnmatchedRings, addCrossLinks, comment);
}, "~N,~N,J.util.BS,~B,~B,~B,~B");
Clazz.defineMethod (c$, "connect", 
function (connections) {
this.modelSet.connect (connections);
}, "~A");
Clazz.defineMethod (c$, "prompt", 
function (label, data, list, asButtons) {
return (this.$isKiosk ? "null" : this.apiPlatform.prompt (label, data, list, asButtons));
}, "~S,~S,~A,~B");
Clazz.defineMethod (c$, "getColorEncoder", 
function (colorScheme) {
return this.colorManager.getColorEncoder (colorScheme);
}, "~S");
Clazz.defineMethod (c$, "displayBonds", 
function (bs, isDisplay) {
this.modelSet.displayBonds (bs, isDisplay);
}, "J.modelset.Bond.BondSet,~B");
Clazz.defineMethod (c$, "getModelAtomProperty", 
function (atom, text) {
return this.modelSet.getModelAtomProperty (atom, text);
}, "J.modelset.Atom,~S");
Clazz.defineMethod (c$, "setStateScriptVersion", 
function (version) {
if (version != null) {
try {
var tokens = J.util.Parser.getTokens (version.$replace ('.', ' ').$replace ('_', ' '));
var main = Integer.$valueOf (tokens[0]).intValue ();
var sub = Integer.$valueOf (tokens[1]).intValue ();
var minor = Integer.$valueOf (tokens[2]).intValue ();
if (minor == -2147483648) minor = 0;
this.stateScriptVersionInt = main * 10000 + sub * 100 + minor;
this.global.legacyAutoBonding = (this.stateScriptVersionInt < 110924);
return;
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
} else {
throw e;
}
}
}this.setBooleanProperty ("legacyautobonding", false);
this.stateScriptVersionInt = 2147483647;
}, "~S");
Clazz.defineMethod (c$, "checkAutoBondLegacy", 
function () {
return this.global.legacyAutoBonding;
});
Clazz.defineMethod (c$, "initializeExporter", 
function (type, fileName) {
if (this.jsExporter3D != null) {
this.jsExporter3D.initializeOutput (type, this, this.privateKey, this.gdata, null);
return this.jsExporter3D;
}var isJS = type.equals ("JS");
var output = (fileName == null ?  new J.util.SB () : fileName);
var export3D = null;
try {
var export3Dclass = Class.forName (isJS ? "J.exportjs.Export3D" : "J.export.Export3D");
export3D = export3Dclass.newInstance ();
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return null;
} else {
throw e;
}
}
var exporter = export3D.initializeExporter (type, this, this.privateKey, this.gdata, output);
if (isJS && exporter != null) this.jsExporter3D = export3D;
return (exporter == null ? null : export3D);
}, "~S,~S");
Clazz.defineMethod (c$, "setPrivateKeyForShape", 
function (iShape) {
this.setShapeProperty (iShape, "privateKey", Double.$valueOf (this.privateKey));
}, "~N");
Clazz.defineMethod (c$, "getMouseEnabled", 
function () {
return this.refreshing && !this.creatingImage;
});
Clazz.defineMethod (c$, "getPartialDots", 
function () {
return this.global.partialDots;
});
Clazz.defineMethod (c$, "setZslabPoint", 
function (pt) {
this.transformManager.setZslabPoint (pt);
}, "J.util.P3");
Clazz.overrideMethod (c$, "calcAtomsMinMax", 
function (bs, boxInfo) {
this.modelSet.calcAtomsMinMax (bs, boxInfo);
}, "J.util.BS,J.util.BoxInfo");
Clazz.overrideMethod (c$, "getObjectMap", 
function (map, withDollar) {
this.shapeManager.getObjectMap (map, withDollar);
}, "java.util.Map,~B");
Clazz.defineMethod (c$, "getPdbBondInfo", 
function (group3) {
if (this.htPdbBondInfo == null) this.htPdbBondInfo =  new java.util.Hashtable ();
var info = this.htPdbBondInfo.get (group3);
if (info != null) return info;
info = J.viewer.JC.getPdbBondInfo (J.modelset.Group.lookupGroupID (group3));
this.htPdbBondInfo.put (group3, info);
return info;
}, "~S");
Clazz.defineMethod (c$, "setPicked", 
function (iAtom) {
this.global.setPicked (iAtom);
}, "~N");
Clazz.defineMethod (c$, "runScriptImmediately", 
function (script) {
try {
if (this.getScriptManager () == null) return false;
this.eval.runScript (script);
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
return false;
} else {
throw e;
}
}
return true;
}, "~S");
Clazz.defineMethod (c$, "allowSpecAtom", 
function () {
return this.modelSet.allowSpecAtom ();
});
Clazz.defineMethod (c$, "getMinPixelSelRadius", 
function () {
return this.global.minPixelSelRadius;
});
Clazz.defineMethod (c$, "setFrameDelayMs", 
function (millis) {
this.modelSet.setFrameDelayMs (millis, this.getVisibleFramesBitSet ());
}, "~N");
Clazz.defineMethod (c$, "getFrameDelayMs", 
function (i) {
return this.modelSet.getFrameDelayMs (i);
}, "~N");
Clazz.defineMethod (c$, "getBaseModelBitSet", 
function () {
return this.modelSet.getModelAtomBitSetIncludingDeleted (this.getJDXBaseModelIndex (this.getCurrentModelIndex ()), true);
});
Clazz.defineMethod (c$, "getTimeouts", 
function () {
return this.timeouts;
});
Clazz.defineMethod (c$, "clearTimeouts", 
function () {
if (this.timeouts != null) J.thread.TimeoutThread.clear (this.timeouts);
});
Clazz.defineMethod (c$, "setTimeout", 
function (name, mSec, script) {
if (!this.haveDisplay || this.isHeadless () || this.autoExit) return;
if (name == null) {
this.clearTimeouts ();
return;
}if (this.timeouts == null) {
this.timeouts =  new java.util.Hashtable ();
}J.thread.TimeoutThread.setTimeout (this, this.timeouts, name, mSec, script);
}, "~S,~N,~S");
Clazz.defineMethod (c$, "triggerTimeout", 
function (name) {
if (!this.haveDisplay || this.timeouts == null) return;
J.thread.TimeoutThread.trigger (this.timeouts, name);
}, "~S");
Clazz.defineMethod (c$, "clearTimeout", 
function (name) {
this.setTimeout (name, 0, null);
}, "~S");
Clazz.defineMethod (c$, "showTimeout", 
function (name) {
return (this.haveDisplay ? J.thread.TimeoutThread.showTimeout (this.timeouts, name) : "");
}, "~S");
Clazz.defineMethod (c$, "calculatePartialCharges", 
function (bsSelected) {
if (bsSelected == null || bsSelected.cardinality () == 0) bsSelected = this.getModelUndeletedAtomsBitSetBs (this.getVisibleFramesBitSet ());
this.getMinimizer (true).calculatePartialCharges (this.modelSet.bonds, this.modelSet.bondCount, this.modelSet.atoms, bsSelected);
}, "J.util.BS");
Clazz.defineMethod (c$, "cachePut", 
function (key, data) {
this.fileManager.cachePut (key, data);
}, "~S,~O");
Clazz.defineMethod (c$, "cacheClear", 
function () {
this.fileManager.cacheClear ();
this.fileManager.clearPngjCache (null);
});
Clazz.defineMethod (c$, "setCurrentModelID", 
function (id) {
var modelIndex = this.getCurrentModelIndex ();
if (modelIndex >= 0) this.modelSet.setModelAuxiliaryInfo (modelIndex, "modelID", id);
}, "~S");
Clazz.defineMethod (c$, "setCentroid", 
function (iAtom0, iAtom1, minmax) {
this.modelSet.setCentroid (iAtom0, iAtom1, minmax);
}, "~N,~N,~A");
Clazz.defineMethod (c$, "getPathForAllFiles", 
function () {
return this.fileManager.getPathForAllFiles ();
});
Clazz.overrideMethod (c$, "cacheFile", 
function (fileName, bytes) {
this.fileManager.cachePut (fileName, bytes);
}, "~S,~A");
Clazz.defineMethod (c$, "cacheFileByName", 
function (fileName, isAdd) {
return this.fileManager.cacheFileByName (fileName, isAdd);
}, "~S,~B");
Clazz.defineMethod (c$, "cacheList", 
function () {
return this.fileManager.cacheList ();
});
Clazz.defineMethod (c$, "stopScriptDelayThread", 
($fz = function () {
if (this.scriptDelayThread != null) {
this.scriptDelayThread.interrupt ();
this.scriptDelayThread = null;
}}, $fz.isPrivate = true, $fz));
Clazz.defineMethod (c$, "delayScript", 
function (eval, millis) {
if (this.autoExit) return;
this.stopScriptDelayThread ();
this.scriptDelayThread =  new J.thread.ScriptDelayThread (eval, this, millis);
this.scriptDelayThread.run ();
}, "J.api.JmolScriptEvaluator,~N");
Clazz.defineMethod (c$, "clearThreads", 
function () {
this.stopScriptDelayThread ();
this.stopMinimization ();
this.setVibrationOff ();
this.setSpinOn (false);
this.setNavOn (false);
this.setAnimationOn (false);
});
Clazz.defineMethod (c$, "getEvalContextAndHoldQueue", 
function (jse) {
if (jse == null || !this.isJS) return null;
jse.pushContextDown ();
var sc = jse.getThisContext ();
var sc0 = sc;
while (sc0 != null) {
sc0.mustResumeEval = true;
sc0 = sc0.parentContext;
}
sc.isJSThread = true;
this.queueOnHold = true;
return sc;
}, "J.api.JmolScriptEvaluator");
Clazz.defineMethod (c$, "checkInheritedShapes", 
function () {
this.shapeManager.checkInheritedShapes ();
});
Clazz.overrideMethod (c$, "resizeInnerPanel", 
function (width, height) {
this.statusManager.resizeInnerPanel (width, height);
}, "~N,~N");
Clazz.defineMethod (c$, "getFontLineShapeState", 
function (s, myType, tickInfos) {
return this.getStateCreator ().getFontLineShapeState (s, myType, tickInfos);
}, "~S,~S,~A");
Clazz.defineMethod (c$, "getShapeSetState", 
function (atomShape, shape, monomerCount, monomers, bsSizeDefault, temp, temp2) {
this.getStateCreator ().getShapeSetState (atomShape, shape, monomerCount, monomers, bsSizeDefault, temp, temp2);
}, "J.shape.AtomShape,J.shape.Shape,~N,~A,J.util.BS,java.util.Map,java.util.Map");
Clazz.defineMethod (c$, "getMeasurementState", 
function (as, mList, measurementCount, font3d, ti) {
return this.getStateCreator ().getMeasurementState (as, mList, measurementCount, font3d, ti);
}, "J.shape.AtomShape,java.util.List,~N,J.util.JmolFont,J.modelset.TickInfo");
Clazz.defineMethod (c$, "getBondState", 
function (shape, bsOrderSet, reportAll) {
return this.getStateCreator ().getBondState (shape, bsOrderSet, reportAll);
}, "J.shape.Shape,J.util.BS,~B");
Clazz.defineMethod (c$, "getAtomShapeSetState", 
function (shape, shapes) {
return this.getStateCreator ().getAtomShapeSetState (shape, shapes);
}, "J.shape.Shape,~A");
Clazz.defineMethod (c$, "getShapeState", 
function (shape) {
return this.getStateCreator ().getShapeState (shape);
}, "J.shape.Shape");
Clazz.defineMethod (c$, "getAtomShapeState", 
function (shape) {
return this.getStateCreator ().getAtomShapeState (shape);
}, "J.shape.AtomShape");
Clazz.defineMethod (c$, "getDefaultPropertyParam", 
function (propertyID) {
return this.getPropertyManager ().getDefaultPropertyParam (propertyID);
}, "~N");
Clazz.defineMethod (c$, "getPropertyNumber", 
function (name) {
return this.getPropertyManager ().getPropertyNumber (name);
}, "~S");
Clazz.defineMethod (c$, "checkPropertyParameter", 
function (name) {
return this.getPropertyManager ().checkPropertyParameter (name);
}, "~S");
Clazz.defineMethod (c$, "extractProperty", 
function (property, args, pt) {
return this.getPropertyManager ().extractProperty (property, args, pt);
}, "~O,~A,~N");
Clazz.defineMethod (c$, "addHydrogens", 
function (bsAtoms, is2DLoad, isSilent) {
var doAll = (bsAtoms == null);
if (bsAtoms == null) bsAtoms = this.getModelUndeletedAtomsBitSet (this.getVisibleFramesBitSet ().length () - 1);
var bsB =  new J.util.BS ();
if (bsAtoms.cardinality () == 0) return bsB;
var modelIndex = this.modelSet.atoms[bsAtoms.nextSetBit (0)].modelIndex;
if (modelIndex != this.modelSet.modelCount - 1) return bsB;
var vConnections =  new java.util.ArrayList ();
var pts = this.getAdditionalHydrogens (bsAtoms, doAll, false, vConnections);
var wasAppendNew = false;
wasAppendNew = this.getAppendNew ();
if (pts.length > 0) {
this.clearModelDependentObjects ();
try {
bsB = (is2DLoad ? this.modelSet.addHydrogens (vConnections, pts) : this.addHydrogensInline (bsAtoms, vConnections, pts));
} catch (e) {
if (Clazz.exceptionOf (e, Exception)) {
System.out.println (e.toString ());
} else {
throw e;
}
}
if (wasAppendNew) this.setAppendNew (true);
}if (!isSilent) this.scriptStatus (J.i18n.GT._ ("{0} hydrogens added", pts.length));
return bsB;
}, "J.util.BS,~B,~B");
Clazz.defineMethod (c$, "addHydrogensInline", 
($fz = function (bsAtoms, vConnections, pts) {
if (this.getScriptManager () == null) return null;
return this.eval.addHydrogensInline (bsAtoms, vConnections, pts);
}, $fz.isPrivate = true, $fz), "J.util.BS,java.util.List,~A");
Clazz.overrideMethod (c$, "evalFunctionFloat", 
function (func, params, values) {
return (this.getScriptManager () == null ? 0 : this.eval.evalFunctionFloat (func, params, values));
}, "~O,~O,~A");
Clazz.defineMethod (c$, "evalParallel", 
function (context, shapeManager) {
this.displayLoadErrors = false;
var isOK = this.getScriptManager () != null && this.eval.evaluateParallel (context, (shapeManager == null ? this.shapeManager : shapeManager));
this.displayLoadErrors = true;
return isOK;
}, "J.script.ScriptContext,J.viewer.ShapeManager");
Clazz.overrideMethod (c$, "evaluateExpression", 
function (stringOrTokens) {
if (this.getScriptManager () == null) return null;
return this.eval.evaluateExpression (stringOrTokens, false);
}, "~O");
Clazz.defineMethod (c$, "evaluateExpressionAsVariable", 
function (stringOrTokens) {
if (this.getScriptManager () == null) return null;
return this.eval.evaluateExpression (stringOrTokens, true);
}, "~O");
Clazz.defineMethod (c$, "getAtomBitSet", 
function (atomExpression) {
if (Clazz.instanceOf (atomExpression, J.util.BS)) return atomExpression;
this.getScriptManager ();
return this.getAtomBitSetEval (this.eval, atomExpression);
}, "~O");
Clazz.defineMethod (c$, "getAtomBitSetVector", 
function (atomExpression) {
if (this.getScriptManager () == null) return null;
return this.eval.getAtomBitSetVector (this.getAtomCount (), atomExpression);
}, "~O");
Clazz.defineMethod (c$, "getContextVariables", 
function () {
if (this.getScriptManager () == null) return null;
return this.eval.getContextVariables ();
});
Clazz.defineMethod (c$, "getScriptContext", 
function () {
return (this.getScriptManager () == null ? null : this.eval.getScriptContext ());
});
Clazz.overrideMethod (c$, "getAtomDefs", 
function (names) {
return this.getStateCreator ().getAtomDefs (names);
}, "java.util.Map");
Clazz.pu$h ();
c$ = Clazz.declareType (J.viewer.Viewer, "ACCESS", Enum);
Clazz.defineEnumConstant (c$, "NONE", 0, []);
Clazz.defineEnumConstant (c$, "READSPT", 1, []);
Clazz.defineEnumConstant (c$, "ALL", 2, []);
c$ = Clazz.p0p ();
Clazz.defineStatics (c$,
"jsDocumentBase", "");
c$.strJavaVendor = c$.prototype.strJavaVendor = System.getProperty ("java.vendor", "j2s");
c$.strOSName = c$.prototype.strOSName = System.getProperty ("os.name", "j2s");
c$.strJavaVersion = c$.prototype.strJavaVersion = System.getProperty ("java.version", "0.0");
Clazz.defineStatics (c$,
"SYNC_GRAPHICS_MESSAGE", "GET_GRAPHICS",
"SYNC_NO_GRAPHICS_MESSAGE", "SET_GRAPHICS_OFF");
c$.staticFunctions = c$.prototype.staticFunctions =  new java.util.Hashtable ();
Clazz.defineStatics (c$,
"nProcessors", 1);
{
try {
($t$ = J.viewer.Viewer.nProcessors = Runtime.getRuntime ().availableProcessors (), J.viewer.Viewer.prototype.nProcessors = J.viewer.Viewer.nProcessors, $t$);
} catch (e) {
}
}});
