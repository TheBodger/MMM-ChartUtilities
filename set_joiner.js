//#### Set Joiner

//Will merge multiple single items that are related at the subject level into as many sets as there are unique subjects

//Parameters:

//Variable | Required | Description | Options | Default
//--------| --------| -----------| -------| -------
//`input`|No|The locator of the input JSON|any valid fs supported locator OR if the locator starts with HTTP, then a valid HTTP or HTTPS URL that points at JSON|./input.json
//  `subject` 
//    `object` 
//      `value` 
//        `timestamp` 
//          `rationalise` | No | produce minimal JSON by removing subjects and objects at child levels | true or false | false

const fs = require("fs");
const moment = require("moment");

// get required structures

const structures = require("./structures.js");
const utilities = require("./common.js");
const JSONutils = new utilities.JSONutils();
const configutils = new utilities.configutils();

const defaults = {
  input: "./input.json"    // | No | The locator of the input JSON | any valid fs locator / HTTP | ./input.json
  subject: null,           // | Yes | the combined subject identifier that will be used to combine same items into a set | any valid string | none
  object: null,            // | Yes | the combined subject object defining the relationship between the subject and the sets | any valid string | none
  value: null,             // | No | any value to attach to this combination of subjects | any valid JSON value | the number of sets
  type: "string",          // | No | the type of the value when added tot he item | numeric(will validate using parsefloat) or string | string
  timestamp: 0,            // | No | A timestamp to detail when the combined subject object was created, or when it first became valid | any valid timestamp(uses strict moment to validate) | the timestamp of running the module
  filename: null,           // | No | local file name(no paths) to save a serialised version of the extracted data as an array of items | any valid filename or not defined for no output.If not defined then the output is displayed to the console | none
  rationalise:false       //| No | produce minimal JSON by removing subjects and objects at child levels | true or false | false
}

let config = configutils.setconfig(defaults);