'use strict';

Object.defineProperty(Array.prototype, "remove", {
	enumerable: false,
	value: function (remove) {
		this.splice( this.indexOf(remove), 1 );
	}
});

Object.defineProperty(Array.prototype, "exists", {
	enumerable: false,
	value: function (exists) {
		return this.indexOf(exists) > -1;
	}
});