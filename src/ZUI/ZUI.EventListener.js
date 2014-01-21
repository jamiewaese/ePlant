/**
 * EventListener class for ZUI framework
 * By Hans Yu
 */

ZUI.EventListener = function(type, target, callback) {
	this.type = type;
	this.target = target;
	this.callback = callback;
};