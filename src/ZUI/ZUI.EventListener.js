/**
 * EventListener class for ZUI framework
 * By Hans Yu
 */

ZUI.EventListener = function(type, target, callback, data) {
	this.type = type;
	this.target = target;
	this.callback = callback;
	this.data = data;
};