// JavaScript source code

const request = require('sync-request');
const fs = require("fs");

exports.configutils = function () {

    this.setconfig = function (defaults) {

        var modulename = global.process.mainModule.filename.replace(global.process.mainModule.path, "");

        const configfile = _getJSONfile("." + modulename.replace(".js", ".json").replace("\\", "/"));

        //validate we can JSON,parse it
        //check it has at least one params entry

        if (configfile == null) { process.exit(1); }

        let inconfig = configfile;

        if (inconfig.params == null) {
            console.error("No parameters found in config file");
            process.exit(1);
        }

        if (inconfig.params.length == 0) {
            console.error("No parameters found in config file");
            process.exit(1);
        }

        // merge any defaults with the config file

        var tempconfig = { ...defaults, ...inconfig };

        return (tempconfig);

    };

}

exports.JSONutils = function () {

    this.putJSON = function (filename, JSONobject) { //writes async to file or anything we feel like

        fs.writeFileSync(filename, JSON.stringify(JSONobject));

    };

    this.getJSON = function (JSONstring) { //check and load a json string
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

    this.getJSONURL = function (url) { //check and load json from url

        try {
            var res = request('GET', url);

            if (res.statusCode == 200) {

                return JSON.parse(res.getBody("utf8"));
            }
            else {
                return null;
            }

        } catch (err) {
            console.error(err);
            return null;
        }

    };

    this.getJSONfile = function (filename) { //check and load a json file

        return _getJSONfile(filename);

    };

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

