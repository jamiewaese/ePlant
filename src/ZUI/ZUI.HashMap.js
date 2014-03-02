/**
 * HashMap class for ZUI framework
 * By Hans Yu
 */

ZUI.HashMap = function() {
	this.pairs = [];
};

/* Adds a new key-value pair or sets an existing key's value */
ZUI.HashMap.prototype.put = function(key, value) {
	for (var n = 0; n < this.pairs.length; n++) {
		if (this.pairs[n].key == key) {
			this.pairs[n].value = value;
			return;
		}
	}
	this.pairs.push({
		key: key,
		value: value
	});
};

/* Gets a key's value */
ZUI.HashMap.prototype.get = function(key) {
	for (var n = 0; n < this.pairs.length; n++) {
		if (this.pairs[n].key == key) {
			return this.pairs[n].value;
		}
	}
	return null;
};

/* Deletes a key-value pair */
ZUI.HashMap.prototype.delete = function(key) {
	for (var n = 0; n < this.pairs.length; n++) {
		if (this.pairs[n].key == key) {
			this.pairs.splice(n, 1);
			return;
		}
	}
};

/* Returns a list of keys */
ZUI.HashMap.prototype.getKeys = function() {
	var keys = [];
	for (var n = 0; n < this.pairs.length; n++) {
		keys.push(this.pairs[n].key);
	}
	return keys;
};

/* Returns the number of key:value pairs */
ZUI.HashMap.prototype.getSize = function() {
	return this.pairs.length;
};
