// this is a utility module that can be run using nodejs
//
//  1) read the config file and store locally, setting any defaults for missing entries
//  2) read the input file and check it is JSON.parse compatible
//  3) process all the entries at the specified rootkey level to try and match any of the keys at that level for extraction
//  4) build a new item for each key match found from any passed subject,object,timestamp.
//  5) either display to console or write to file as a JSON.stringify all of the items as an array of items


var getJSON = function (JSONstring) { //validate if the provided number is valid 
    try {
        const JSONObject = JSON.parse(JSONstring)

        return JSONObject;

    } catch (err) {
        console.error(err)
    }
    return (null);
};

    const defaults = {
        infile:"input.json" // | No | The filename of the input JSON | any valid filename local to the module | input.json
    }

    const paramdefaults = {
        rootkey: '',             // | No | the key value to determine at what level to extract data | a valid string | the first level
        subject: null,           // | Yes | the KEY name to use as a subject for an item | any valid string | none
        object: null,            // | Yes | the object to insert into the item | any valid string | none
        value: null,             // | Yes | the KEY name to use to for the value field of the item | any valid string | none
        type: "string",          // | No | the type of the value when added tot he item | numeric(will validate using parsefloat) or string | string
        timestamp: new Date(),   // | No | the KEY name of a timestamp to use for the timestamp field value in the item, or an offset from the runtime of the module as a number | any valid string(timestamp uses loose moment to validate) Or a negaitive or positive integer of seconds to offset from the tun time | the timestamp of running the module
        filename: null           // | No | local file name(no paths) to save a serialised version of the extracted data as an array of items | any valid filename or not defined for no output.If not defined then the output is displayed to the console | none
}

    // get required scripts

const fs = require("fs");

    // get required structures

const structures = require("./structures.js");

    // get config file
//and validates it is json at the same time ??

    const configfile = require("./JSON_splitter.json");

    //validate we can JSON,parse it
    //check it has at least one params entry

var isJSON = getJSON(JSON.stringify(configfile)); 

    if (isJSON == null) { process.exit(1); }

    let inconfig = isJSON;

    if (inconfig.params == null) {
        console.error("No parameters found in config file");
        process.exit(1);
    }

    if (inconfig.params.length == 0) {
        console.error("No parameters found in config file");
        process.exit(1);
    }

    // merge any defaults with the config file

let config = { ...defaults, ...inconfig };
 config.params = [];

    // for each of the parameters found, merge with the defaults

const cpl = inconfig.params.length;

for (var idx = 0; idx < cpl; idx++) {

    var t = Object.assign({}, paramdefaults, inconfig.params[idx]);

        config.params.push (t );

    }


const a = " dfg ";

