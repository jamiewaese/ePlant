/**
 * Event class for ZUI framework
 * By Hans Yu
 */

ZUI.Event = function(type, target, data) {
	this.type = type;
	this.target = target;
	this.data = data;
	this.timestamp = (new Date()).getTime();
};