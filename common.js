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

    //TODO handle duplicate records with all keys the same

    var _storedsetids = [];
    var _setkeys = {};
    var _keyset;                //store the first matchkey setid or if blank, the first set passed for storage regardless
    var _path = '';
    var _fs = fs;
    var _presort;
    var _casesensitive;
    var _matchkeys = [];
    var _sortkeys = [];
    var _output = {};
    var _mergesets = {};
    var _mergesetindexes = {};

    this.storedsetids = function () {
        return _storedsetids;
    }

    this.init = function (config) {

        //config is the merge part of the overall confg

        //
        //				merge {
        //					fileprocess: true/false					// if true will serialise all the data to disk and use file processing instead of in memory prior to building the ouput
        //					input: [setids]							// list of the setids to monitor/store/process
        //					sort: true/false						// use the matchkeys to sort each setid
        //					casesensitive:true/false				//sorting and matching is sensitive/insensitive to case
        //					matchkeys: [setid.key, setid.key,..]	// multiple key levels matching from left to right
        //															// key is the AKA name of a field, the first one will provide the setid.key in the output
        //															// the first key is king and everything must match that record by record or get discarded
        //					output: [setid.field,setid.field,setid.field,..] // will produce a [setid.key:{setid.filed,etc,etc}]
        //															// if left blank will copy over any field not present already in the ouput from the setid key/values
        //					

        if (!config.fileprocess) {
            _fs = ms;
            _path = '/';
        }

        _presort = config.sort;
        _casesensitive = config.casesensitive || false;
        _matchkeys = config.matchkeys;

        //setup the default sortkey

        if (_matchkeys == null) { _matchkeys.push('subject'); } //add subject as the default key
        else if (_matchkeys.length == 0) { _matchkeys.push('subject'); } //add subject as the default key
        else if (_keyset == null) {
            _keyset = _matchkeys[0].split(".")[0];//get the keyset from the first key in matchkeys setid.key
            for (var idx = 0; idx < _matchkeys.length; idx++) {
                _matchkeys[idx] = _matchkeys[idx].split(".")[1]; //remove the setid as we have stored it
            }
        }

        return _matchkeys;
    }

    this.mergesets = function () {

        var self = this;

        //todo - add option to choose the key set and not just use default of the first one

        var _mergedsets = {};
        var _processedsetcount = 0;

        var self = this;

        //recall all setids stored, use the 1st set to drive, all will be loaded back into set format
        //and preload the current key

        _storedsetids.forEach(function (_setid) {

            _mergesets[_setid] = self.recallset(_setid);
            _mergesetindexes[_setid] = 0;

        });

        //each set is an array of NDTF objects
        //may have been already reformatted and renamed 

        //store the initial key set details in the _output object in case we need them

        this.mergeoutput(_keyset);

        //do until the key set records have all been processed

        while (_mergesetindexes[_keyset] < _mergesets[_keyset].length) {

            //if we are less than all keys then write out the data and read the next key record
            //if we match any key then store the data and read the next none key record
            //if we are greater than any key then read the next none key record

            _storedsetids.forEach(function (_setid) {

                if (_setid != _keyset) { //ignore the keyset as it will be matched against all the other sets

                    //if a < b = -1, = = 0 > = 1

                    //only match if the setid hasnt gone past end of array

                    if (_mergesetindexes[_setid] < _mergesets[_setid].length) {

                        switch (self.comparekeys(_mergesets[_keyset][_mergesetindexes[_keyset]], _mergesets[_setid][_mergesetindexes[_setid]])) {
                            case -1:
                                _mergesetindexes[_keyset]++
                                _output = {};
                                self.mergeoutput(_keyset);
                                //console.log("<")
                                break;
                            case 1:
                                _mergesetindexes[_setid]++;
                                //console.log(">")
                                break;
                            default: // 0
                                self.mergeoutput(_setid);
                                _mergesetindexes[_setid]++;
                                _processedsetcount++;
                            //console.log("=")

                        }
                    }
                    else { //as we dont process this set as it has got the end we set it to processed
                        _processedsetcount = 99999; //if we hit a situation where any set ends before the key then there cant be any more matches 
                    }

                }

            });

            //have we processed all the data ?
            //merge the keyset data into the output, and move to the next key value

            if (_processedsetcount > _storedsetids.length - 2) { //-2 as we ignore the keyset and need to take one from length

                //we have a valid output for this key so push it and reset unless we hit end of data on one of the sets
                //first check to see if need to creat it before push

                if (_processedsetcount < 99999) {

                    if (_mergedsets[Object.keys(_output)[0]] == null) {
                        _mergedsets[Object.keys(_output)[0]] = []
                    }

                    _mergedsets[Object.keys(_output)[0]].push(_output[Object.keys(_output)[0]])

                }

                //read the next one and store it in output if we haven't hit the end of data
                _output = {};
                _mergesetindexes[_keyset]++

                if (_mergesetindexes[_keyset] < _mergesets[_keyset].length) { this.mergeoutput(_keyset); }

                //reset the processed count to 0
                _processedsetcount = 0;
            }

        }

        //TODO clean out all the saved data quick 

        return _mergedsets;

    };

    this.mergeoutput = function (setid) {

        //_output will be:
        // {setid:{},setid:{}}
        //
        // i.e. the stock set:
        // {'TJX':{close:value,open:value,etc:value,date:timestamp},'stock';{}}


        //here we merge the data in the _output object with the relevant data from the setid 

        if (setid == _keyset) { //this is the key set so we store the key which will hold the array of values if it isn't present
            if (_output[_mergesets[setid][_mergesetindexes[setid]][_matchkeys[0]]] == null) {
                _output[_mergesets[setid][_mergesetindexes[setid]][_matchkeys[0]]] = {}; //should return the 1st key of the set value
            }
        }

        //now store the other fields we have requested
        //output: [setid.field, setid.field, setid.field,..] // will produce a [setid.key:{setid.filed,etc,etc}]
        //or null and just whatever hasn't been copied so far 
        //the fields are entries in multiple arrays, keyed on any subsequent match keys

        for (var keyname in _mergesets[setid][_mergesetindexes[setid]]) {
            if (keyname != _matchkeys[0]) { //ignore the first entry as that is the setid keyname
                _output[_mergesets[setid][_mergesetindexes[setid]][_matchkeys[0]]][keyname] = _mergesets[setid][_mergesetindexes[setid]][keyname];
            }
        }

    };

    //multi key sort - each set is sorted by the keys in the config, the keys must be present in all sets
    //at the end of the sort, all sets including the key set are sorted into multikey order, i.e.a within b within c etc
    //each level has to be assessed for type primarily because string representation of numbers wont probably work !!
    //_matchkeys is array of keyname,etc (setid was removed in init)

    this.sortset = function (set) {

        set.sort(this.comparekeys);

        return set;

    };

    this.comparekeys = function (a, b) {

        const sortkeys = _sortkeys;

        //based on the sortkeys, we return -1,0,1 
        //            if (a < b) { return -1; }
        //            if (a > b) { return 1; }
        //            return 0;

        // from left to right 

        // if = then check next level, else sort this level

        // for each key, if not equal sort and return, if equal and last key return 0

        for (var idx = 0; idx < sortkeys.length; idx++) {

            var key = sortkeys[idx];
            var keyvalue = { a: a[_matchkeys[idx]], b: b[_matchkeys[idx]] };
            var lastkey = (idx == sortkeys.length - 1);

            if (key.keytype == 'n') {
                if (keyvalue.a < keyvalue.b) { return -1; }
                if (keyvalue.a > keyvalue.b) { return 1; }
            }

            if (key.keytype == 's') {
                if (key.casesensitive) {
                    if (keyvalue.a.toLowerCase() < keyvalue.b.toLowerCase()) { return -1; }
                    if (keyvalue.a.toLowerCase() > keyvalue.b.toLowerCase()) { return 1; }
                }
                else {
                    if (keyvalue.a < keyvalue.b) { return -1; }
                    if (keyvalue.a > keyvalue.b) { return 1; }
                }
            }

            if (lastkey) { return 0;}

        }

    };

    //function to prepare all the parameters to carry out a sort on a set that is passed to the sort
    //and isn't stored or merged
    //replaces the need to call init

    this.preparesort = function (setid, item, sortkeys,casesensitive) {

        var tempkeys = [];

        sortkeys.forEach(key => tempkeys.push(setid + '.' + key));

        this.init({ matchkeys: tempkeys, casesensitive: casesensitive })

        if (_keyset == null) { //first stored set is the key set if not already set in init// 
            _keyset = setid;
        }

        //build the sort based on the first entry in the key data set

        if (_keyset == setid) {

            _matchkeys.forEach(function (key) {

                if (typeof (item[key]) == 'number') { _sortkeys.push({ keytype: 'n' }); } //if a number
                else if (typeof (item[key]) == 'string') {//if a string, check sensitivity
                    _sortkeys.push({ keytype: 's', casesensitive: _casesensitive });
                }
                else { console.error("sort key requested on value that is not string or numeric"); }
            });

        }



    };

    this.storeset = function (setid, set) {

        if (_keyset == null) { //first stored set is the key set if not already set in init// 
            _keyset = setid;
        }

        //build the sort based on the first entry in the key data set

        if (_keyset == setid) {

            _matchkeys.forEach(function (key) {

                if (typeof (set[0][key]) == 'number') { _sortkeys.push({ keytype: 'n' }); } //if a number
                else if (typeof (set[0][key]) == 'string') {//if a string, check sensitivity
                    _sortkeys.push({ keytype: 's', casesensitive: _casesensitive });
                }
                else { console.error("sort key requested on value that is not string or numeric"); }
            });

        }

        //the timestamp value must be passed in numeric format (the provider should have already done that)

        var result = _fs.writeFileSync(_path + setid + '.json', JSON.stringify((_presort) ? this.sortset(set) : set));

        //if we haven't stored a set add it to list and the sort/merge key

        if (_storedsetids.indexOf(setid) == -1) {
            _storedsetids.push(setid);
        }

        return result;

    }

    this.recallset = function (setid,deleteonread=false) {

        var recalledset = JSON.parse(_fs.readFileSync(_path + setid + '.json', 'utf8')); 

        if (deleteonread) { //clean out the memory
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

