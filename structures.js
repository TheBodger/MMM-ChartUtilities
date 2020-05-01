// this contains the basic structures and any helper code for NDTF item

var moment = require("moment");

exports.NDTFItem = function (subject, object, timestamp, value) {
	this.subject = subject;				
	this.object = object;
	this.timestamp = timestamp;
	this.value = value;

	this.JSONstring = function () { //returns a serialised version of the item
		return JSON.stringify(this);
	};

	this.JSONobj = function () { //returns JSON only part of this object (no prototypes etc)
		return JSON.parse(this.JSONstring());
	};

}

exports.NDTFSet = function (subject, object, timestamp, value, setid) {
	this.subject = subject;
	this.object = object;
	this.timestamp = timestamp;
	this.value = value;
	//this.set = {};

	if (setid != null) { this[setid] = []; }

	this.addset = function (setid) {
		if (setid != null) { this.set[setid] = []; }
    }

	this.JSONstring = function () { //returns a serialised version of the item
		return JSON.stringify(this);
		};

	this.JSONobj = function () { //returns JSON only part of this object (no prototypes etc)
		return JSON.parse(this.JSONstring());
	};

}

var checkdate = function (timestamp) { //validate if the provided timestamp is valid 
	const regex = /\.(jpeg|jpg|gif|png|bmp|tiff)$/;
	//console.log(imgurl);
	//console.log(imgurl.match(regex));
	return (imgurl.match(regex) != null);
};

var checknumeric = function (number) { //validate if the provided number is valid 
	const regex = /\.(jpeg|jpg|gif|png|bmp|tiff)$/;
	//console.log(imgurl);
	//console.log(imgurl.match(regex));
	return (imgurl.match(regex) != null);
};