// JavaScript source code

//common utilities V2.0, use HTPPand HTTPS instead of sync-request becaseu that kills electron on the pi

//const request = require('sync-request');
const fs = require("fs");
const HTTP = require("http");
const HTTPS = require("https");

exports.configutils = function () {

    this.setconfig = function (defaults,paramsrequired) {

        var modulename = global.process.mainModule.filename.replace(global.process.mainModule.path, "");

        const configfile = _getJSONfile("." + modulename.replace(".js", ".json").replace("\\", "/"));

        //validate we can JSON,parse it
        //check it has at least one params entry

        if (configfile == null) { process.exit(1); }

        let inconfig = configfile;

        if (paramsrequired) {

            if (inconfig.params == null) {
                console.error("No parameters found in config file");
                process.exit(1);
            }

            if (inconfig.params.length == 0) {
                console.error("No parameters found in config file");
                process.exit(1);
            }

        }

        // merge any defaults with the config file

        var tempconfig = { ...defaults, ...inconfig };

        //add any other common details if a variable is present that would require it

        if (tempconfig.input != null) {

            tempconfig.useHTTP = false;

            // work out if we need to use a HTTP processor

            if (tempconfig.input.substring(0, 4).toLowerCase() == "http") { tempconfig.useHTTP = true; }
        }

        return (tempconfig);

    };

}

exports.JSONutils = function () {

    this.putJSON = function (filename, JSONobject) { //writes async to file or anything we feel like

        fs.writeFileSync(filename, JSON.stringify(JSONobject));

    };

    this.getJSON = function (config) {

        var tempJSON = ''

        if (config.useHTTP) {

            tempJSON = this.getJSONURL(config.input);
        }

        else {

            tempJSON = this.getJSONstring(fs.readFileSync(config.input).toString()); //returns a buffer, so convert to string

        }

        if (tempJSON == null) {
            console.error("failed to obtain valid data");
        }

        return tempJSON;

    };

    this.getJSONnew = function (JSONconfig) { // a config that may or may not be for a json pull

        //uses either http, https or fs to get data and process it through the callback.
        //because of the various read options, the config is passed deeper and deeper, hopefully returning at some point still intact

        if (JSONconfig.config.useHTTP) { // HTTP or HTTPS

            this.getJSONURLnew(JSONconfig);
        }

        else {

            this.getJSONfilenew(JSONconfig);

        }

    };

    this.getJSONfilenew = function (JSONconfig) {

        tempJSON = this.getJSONstring(fs.readFileSync(JSONconfig.config.input).toString()); //returns a buffer, so convert to string

        JSONconfig.callback(JSONconfig, tempJSON)

    };

    this.getJSONstring = function (JSONstring) { //check and load a json string
        try {
            const JSONObject = JSON.parse(JSONstring);

            return JSONObject;

        } catch (err) {
            console.error("Invalid JSON string");
            console.error("String:", JSONstring);
            console.error(err);
        }
        return (null);
    };

    this.getJSONURLnew = function (JSONconfig) { //check and load json from url

        var JSONbody = '';

        const req = HTTPS.request(JSONconfig.options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (data) => {
                //process.stdout.write(d);
                //console.log(data.toString());
                JSONbody = JSONbody + data.toString();
            });
            res.on('end', () => {
                JSONconfig.callback(JSONconfig, JSON.parse(JSONbody));
            });
        });

        req.on('error', (e) => {
            console.error(e);
        });

        req.end();

    };

    this.getTEXT = function (config) {

        var tempTEXT = ''

        if (config.useHTTP) {

            tempTEXT = this.getTEXTURL(config.input);
        }

        else {

            tempTEXT = fs.readFileSync(config.input).toString(); //returns a buffer, so convert to string

        }

        if (tempTEXT == null) {
            console.error("failed to obtain valid data");
        }

        return tempTEXT;

    };

    this.getTEXTURL = function (url) { //load text from url

        try {
            var res = request('GET', url);

            if (res.statusCode == 200) {

                return res.getBody("utf8"); // TODO will need to drop html somewhere 
            }
            else {
                return null;
            }

        } catch (err) {
            console.error(err);
            return null;
        }

    };

    this.getTEXTnew = function (JSONconfig) { // a config that may or may not be for a json pull

        //uses either http, https or fs to get data and process it through the callback.
        //because of the various read options, the config is passed deeper and deeper, hopefully returning at some point still intact

        if (JSONconfig.config.useHTTP) { // HTTP or HTTPS

            this.getTEXTURLnew(JSONconfig);
        }

        else {

            this.getTEXTfilenew(JSONconfig);

        }

    };

    this.getTEXTURLnew = function (JSONconfig) { //load text from url

        var TEXTbody = '';

        const req = HTTPS.request(JSONconfig.options, (res) => {
            console.log('statusCode:', res.statusCode);
            console.log('headers:', res.headers);

            res.on('data', (data) => {
                TEXTbody = TEXTbody + data.toString();
            });
            res.on('end', () => {
                JSONconfig.callback(JSONconfig, TEXTbody);
            });
        });

        req.on('error', (e) => {
            console.error(e);
        });

        req.end();

    };

    this.getTEXTfilenew = function (JSONconfig) {

        tempTEXT = fs.readFileSync(JSONconfig.config.input).toString(); //returns a buffer, so convert to string

        JSONconfig.callback(JSONconfig, tempTEXT)

    };

    this.getJSONfile = function (filename) { //check and load a json file

        return _getJSONfile(filename);

    };

}

exports.getkeyedJSON = function (jsonobject, dotdelimitedkeys) {

    //split the dotdelimitedkeys into key names

    var keynames = dotdelimitedkeys.split(".");

    var tempJSONobj = jsonobject[keynames[0]];

    for (var kidx = 1; kidx < keynames.length; kidx++) {

        tempJSONobj = tempJSONobj[keynames[kidx]];

    }

    return tempJSONobj;

}

var _getJSONfile = function (filename) {

    //why doesnt this work ??
    //need to put try catch here or return thee require

    try {
        const JSONObject = require(filename)

        return JSONObject;

    } catch (err) {
        console.error("File:", filename)
        console.error(err)
    }
    return (null);

};

