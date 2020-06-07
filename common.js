// JavaScript source code

//common utilities V2.0, use HTPPand HTTPS instead of sync-request becaseu that kills electron on the pi

//const request = require('sync-request');
const fs = require("fs");
const ms = require('memfs');

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
            //console.log('statusCode:', res.statusCode);
            //console.log('headers:', res.headers);

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
            //console.log('statusCode:', res.statusCode);
            //console.log('headers:', res.headers);

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

exports.mergeutils = function () {

    //default is 
    //  to merge all sets using subject as the key and then use the keyset(1st setid) to drive a < = > merge with all other sets
    //  no sort
    //  in memory using fsmem (memfs)
    //
    //  if there is a sort, there may be sort on multiple keys, so we can do multiple key matching
    //  i.e. stock then date
    //
    //  sort date within stock
    //
    //  main match is on stock, if stocks equal then process dates
    //  if key stock is less than all other stocks, then we have finised this stock and move onto next stock
    //  if key stock matches an other stock then check at dates level and determine < = >
    //
    //  matching occurs at lowest level, unless 1st level, then the data gets stored as new entries in the array
    //  change of higher level keys means that a new entry is created at the setid level
    //
    //


    var _storedsetids = [];
    var _setkeys = {};
    var _keyset;
    var _path = '';
    var _fs = fs;
    var _presort;
    var _casesensitive;

    
    this.init = function (config) {

        //config is the merge part of the overall confg

        //
//				merge {
//					fileprocess: true/false					// if true will serialise all the data to disk and use file processing instead of in memory prior to building the ouput
//					input: [setids]							// list of the setids to monitor/store/process
//					sort: true/false						// use the matchkeys to sort each setid
//					casesensitive:true/false				//sorting and matching is sensitive/insensitive to case
//					matchkeys: [[setid.key,setid.key,..]]	// multiple key levels matching from left to right
//															// key is the AKA name of a field, the first one will provide the setid.key in the output
//															// the first key is king and everything must match that record by record or get discarded
//					output: [setid.field,setid.field,setid.field,..] // will produce a [setid.key:{setid.filed,etc,etc}]
//															// if left blank will copy over any field not present already in the ouput from the setid key/values
//					

        if (config.fileprocess) {
            _fs = ms;
            _path = '/';
        }

        _presort = config.sort;

        _casesensitive = config.casesensitive;



    }

    this.mergesets = function () {

        //todo - add option to choose the key set and not just use default of the first one

        var _mergesets = {};
        var _mergedsets = {};
        var _mergekeyvalues = {};
        var _mergesetindexes = {};
        var _maxkeyvalue;
        var _processedsetcount = 0;
        var _output = {};

        //recall all setids stored, use the 1st set to drive, all will be loaded back into set format
        //and preload the current key

        for (var _setid in _storedsetids) {

            _mergesets[_setid] = this.recallset(_setid);
            _mergekeyvalues[_setid] = _mergesets[_setid][0][_setkeys[_setid]] //should return the setkey of the first entry in a set of array
            _mergesetindexes[_setid] = 0;

        }

        //create a maximum key value to enable processing below

        _maxkeyvalue = _mergesets[_keyset][_mergesets[_keyset].length-1][_setkeys[_keyset]];

        if (typeof (_maxkeyvalue) == 'number') {
            _maxkeyvalue++;
        } //increase so always greater than highest value (always assumed to be the last entry) TODO add max()
        else
            if (typeof (_maxkeyvalue) == 'string') {
                _maxkeyvalue = "X" + _maxkeyvalue;
            } //increase so always greater than highest value (always assumed to be the last entry) ignoring case sensitivity


        //each set is an array of NDTF objects
        //may have been already reformatted and renamed 

        //store the initial key set details in the _output object

        this.mergeoutput(_keyset);

        //do until the key set records have all been processed

        while (_mergesetindexes[_keyset] < _mergesets[_setid].length) {

            //if we are less than all keys then write out the data and read the next key record
            //if we match any key then store the data and read the next none key record
            //if we are greater than any key then read the next none key record

            for (var _setid in _storedsetids) {

                if (_setid != _keyset) {

                    if (_mergekeyvalues[_setid] < _mergekeyvalues[_keyset]) {
                        _mergesetindexes[_setid]++;
                    }
                    else if (_mergekeyvalues[_setid] = _mergekeyvalues[_keyset]) {
                        //merge this keys data into the output
                        this.mergeoutput(_setid);
                        //increment the index for this key
                        _mergesetindexes[_setid]++;

                        if (_mergesetindexes[_setid] < _mergesets[_setid].length) {
                            _mergekeyvalues[_setid] = _mergesets[_setid][_mergesetindexes[_setid]]
                        }
                        else { //set this key value to be greater than the highest value in the keyset
                            _mergekeyvalues[_setid] = _maxkeyvalue;
                        }
                    }

                    if (_mergekeyvalues[_setid] > _mergekeyvalues[_keyset]) {_processedsetcount++ }

                }

            }

            //have we processed all the data ?
            //merge the keyset data into the output, and move to the next key value

            if (_processedsetcount > _storedsetids.length - 2 ) { //-2 as we ignore the keyset and need to take one from length

                //merge key data

                //store into the new output set
                _mergedsets.push();

                //read the next one
                _mergesetindexes[_keyset]++


                //reset the processed count to 0
                _processedsetcount = 0;
            }

        } 

        return _mergedsets;

    }

    this.mergeoutput = function (setid) {

        //_output will be:
        // {setid:{},setid:{}}
        //
        // i.e. the stock set:
        // {'TJX':{close:value,open:value,etc:value,date:timestamp},'stock';{}}


        //here we merge the data in the _output object with the relevant data from the setid 

        if (setid == _keyset) { //this is the key set so we store the key which will hold the array of values
            _output['setid'] = {};
        }

        //now store the other fields we have requested
        //output: [setid.field, setid.field, setid.field,..] // will produce a [setid.key:{setid.filed,etc,etc}]
        //or null and just whatever hasn't been copied so far 
        //the fields are entries in multiple arrays, keyed on any subsequent match keys





    }

    multi key sort 

    homes.sort(
        function (a, b) {
            if (a.city === b.city) {
                // Price is only important when cities are the same
                return b.price - a.price;
            }
            return a.city > b.city ? 1 : -1;
        });

    this.sortset = function (sortkey, set) {

        //determine key data type

        if (typeof (a[sortkey]) == 'number')

            //numeric sort
            {
                set.sort(function (a, b) {
                    return a[sortkey] - b[sortkey];
                });
            }
        
        else {
            //string sort - case insensitive
            if (_casesensitive) {
                set.sort(function (a, b) {
                    var x = a[sortkey];
                    var y = b[sortkey];
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0;
                });
            }

            //string sort - case sensitive
            else {
                set.sort(function (a, b) {
                    var x = a[sortkey].toLowerCase();
                    var y = b[sortkey].toLowerCase();
                    if (x < y) { return -1; }
                    if (x > y) { return 1; }
                    return 0;
                });
            }
        }

        return set;

    };

    this.storeset = function (setid, set, sortkey = 'subject') {

        //the timestamp value must be passed in numeric format (the provider should have already done that)

        var result = _fs.writeFileSync(_path + setid + '.json', JSON.stringify((_presort) ? this.sortset(sortkey, set) : set));

        //if we haven't stored a set add it to list and the sort/merge key

        if (_storedsetids.indexOf(setid) == -1) {
            _storedsetids.push(setid);
            _setkeys[setid] = sortkey;
        }

        if (_keyset == null) { _keyset = setid;} //first stored set is the key set // 

        return result;

    }

    this.recallset = function (setid,deleteonread=true) {

        var recalledset = JSON.parse(_fs.readFileSync(_path + setid + '.json', 'utf8')); 

        if (deleteonread) { //clean out the memory as we just loaded another copy !!
            _fs.unlinkSync(_path + setid + '.json');
        }

        return recalledset;

    }

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

