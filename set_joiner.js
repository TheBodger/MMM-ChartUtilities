//#### Set Joiner

const moduleruntime = new Date();

//Will merge multiple single items that are related at the subject level into as many sets as there are unique subjects

const fs = require("fs");
const moment = require("moment");

// get required structures

const structures = require("./structures.js");
const utilities = require("./common.js");
const JSONutils = new utilities.JSONutils();
const configutils = new utilities.configutils();

const defaults = {
  input: "./input.json",   // | No | The locator of the input JSON | any valid fs locator / HTTP | ./input.json
  subject: null,           // | Yes | the combined subject identifier that will be used to combine same items into a set | any valid string | none
  object: null,            // | Yes | the combined subject object defining the relationship between the subject and the sets | any valid string | none
  value: null,             // | No | any value to attach to this combination of subjects | any valid JSON value | the number of sets
  timestamp: 0,            // | No | A timestamp to detail when the combined subject object was created, or when it first became valid | any valid timestamp(uses strict moment to validate) | the timestamp of running the module
  filename: null,          // | No | local file name(no paths) to save a serialised version of the extracted data as an array of items | any valid filename or not defined for no output.If not defined then the output is displayed to the console | none
  rationalise:false        // | No | produce minimal JSON by removing subjects and objects at child levels | true or false | false
}

// build the config

let config = configutils.setconfig(defaults, false);

config["useruntime"] = false;
config["usenumericoutput"] = false;

if (config.type == 'numeric') { config["usenumericoutput"] = true; }

if (typeof config.timestamp == "number") { //wants an offset of the runtime, provided in seconds, or it was blank

  config["useruntime"] = true;
  config["runtime"] = new Date(moduleruntime.getTime() + (config.timestamp * 1000));

}

//load the array of items

var inputjson = JSONutils.getJSON(config);

//process the items based on the config rules

// group all the items based on the subject field
// add items to the set
// loose object (if same as parent) and subject if rationalise is true, otherwise we get a fat file

//get a set structure for every subject we find

//too keep things a little quicker, we track the found subjects in an array that we use a quick search to find if they exist
// and also we look for a change of subject to trigger the search / add 
// so if found, we know we have a set in the set array withi this subject
// if not found then we have to create a new array entry and start populating it

var subjectarray = [];
var setidarray = [];
var setarray = [];
var prevsubject = null;
var currentidx = -1;

for (itemidx = 0; itemidx < inputjson.length; itemidx++) {

  var subject = inputjson[itemidx].subject;
  var object = inputjson[itemidx].object;
  var value = inputjson[itemidx].value;
  var timestamp = inputjson[itemidx].timestamp;

  var item = new structures.NDTFItem(subject, object, timestamp, value);

  if (subject != prevsubject) {

  // change of subject so see if we are processing it otherwise create a new one
  // gets all the corerct indexes for the push below

    prevsubject = subject;

    var subjectfound = false;

    for (var sidx = 0; sidx < subjectarray.length; sidx++) {

      //get index from subject array and use it to access to the set in the setarray, and add the additioanl item details/

      if (subjectarray[sidx] == subject) {
        subjectfound = true;
        currentidx = sidx;
        break;
      }

    }

    if (!subjectfound) {

      var setstructure = new structures.NDTFSet(subject, object, config.timestamp, null, null); //need to track which set this is in future
      setstructure["1"] = [];
      setarray.push(setstructure.JSONobj());
      subjectarray.push(subject);
      setidarray.push("1");
      currentidx = setarray.length - 1;

    }

  }

  if (config.rationalise) {

    // as long as the subject and object match the parent, we drop them from this item
    // in theory we can aslo lose the timestamp in some circumstances

    if (subject == setarray[currentidx].subject) { delete item.subject; }
    if (object == setarray[currentidx].object) { delete item.object; }
    if (timestamp == setarray[currentidx].timestamp) { delete item.timestamp; }

  }

  setarray[currentidx][setidarray[currentidx]].push(item.JSONobj());

}

// finally complete the values in the sets that cant be set until the end
// and write them out or wahatever.

for (var sidx = 0; sidx < setarray.length; sidx++) {

  if (config.value == null) {
    setarray[sidx].value = setarray[sidx][setidarray[sidx]].length;
  }

  if (config.useruntime) { setarray[sidx].timestamp = config.runtime; }

}

//now determine what to do next


  if (config.filename == null) {
    console.info(setarray);
  }
  else {

    // write out to a file

    JSONutils.putJSON("./" + config.filename, setarray);

    console.info(setarray.length);

  }

