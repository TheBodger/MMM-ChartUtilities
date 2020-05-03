# MMM-ChartUtilities
Helper and definitions for the MMM-Chartxxx interrelated modules


The Chart modules are based on the Feed interrelated modules and much of the design is common (most of the code is copied!!)

The key differences are:

the data transfer format is loosely based on Resource Description Framework (RDF) simplified by Me (definitions below with structures and helpers and data sources in the repository)

the MMM-ChartDisplay module relies on the AMCharts v4 library with helpers copied and further developed to enable it's usage within nodejs and MagicMirror

there is an additional MMM-ChartCommon module that needs to be included into the magicmirror as it enables all the common clientside code required by AMCharts

## Principle

The core principle is that the provider must produce information in such a way that the aggregator has everything it needs and it can start passing meaningful information to the display as soon as it receives and aggregates it. 

In practice this means that the provider most extract and merge all data required to meet the requirements of the consumer, and the consumer will never need to add to this data, merely format it ready for display as each set of data arrives from the provider.

Considering the richness of data that may be required, in terms of both breadth and depth and that this data will be a mix of live and static, then the provider should make use of previously locally stored data as part of its inputs to the process of creating the data to provide to the consumer.

However, as long as the requisite data is all provided within a single payload, even if further data will be sent later, then the aggregator can carry out a merge/formatting process if required. __The key principle is that the aggregator must receive the breadth of data required to meet the demands of the display.__

To illustrate this, consider a time series graph of all countrie's death rate by populations from a particular set of diseases. As a minimum the aggregator needs the current death rate and population from a single country of one of the diseases in question. As long as this data is provided in a single payload, then the aggregator can merge/format the data and the display can create a graph. As subsequent countries/diseases/time entries arrive, they can be added to the aggregated set and displayed successfully.

In practice, this example can be met with a live capture of current disease deaths merged with locally held/cached population figures, from one provider, whilst another caches and sends the relevant data for the historical period.

The management of the cached data can be carried out by the provider, such that when it is started it checks for the cached data's relevance and refreshs it accordingly and from that point on uses the cached data only. It is not a necessity to have caching, as long as all required data can be found in a live source that can be converted to NDTF for consumption.

### NDTF - Neils Data Transfer Format.

#### base schema: see notes below on extracts on RDF

```
Subject: The what, as expressed as a code that can be further expanded if required
Object: The predicate (i use object here instead of predicate - see below how the color example would be expressed
Time stamp: when the information is "valid" from
Value: The object or literal linked to the subject in this triple
```

So for the example we would have:

```
subject = sky
object = colour
value = blue
time stamp = when i last checked

or

subject = grass
object = colour
value = green
time stamp = the first time someone worked this out
```

to extend the schema, there are two types of information, **observations** and **descriptions**.

a description enhances a subject with further details and an observation is a specific value captured about a subject.

i.e.

#### description

```
subject = GB			// a keyed value
object = shortname		// a vague description
value = GreatBritain	// the value
timestamp = 1970-01-01	// since forever
```

#### observation

```
subject = GB			// a keyed value
object = population		// a vague description
value = 62,124,982		// the value at this point
timestamp = 1980-12-12	// at the end of 1980
```

As this is a rather inefficient, though very clear, way of expressing information, a final extension is added, that is of **sets**.

The concept of the set allows any particular entry to inherit information from its parent. This in theory can be any of the 4  data descriptors (Subject, object, Timestamp, value). Normally the value will be present along with the timestamp for observational data, for descriptive data any combinations may be presented (i.e. set{subject=coutries population in year, timestamp=year,array of (object=countryname,value=population)

This enables the creation of the concept of a **combined subject** from one or more individual items for sharing across applications or storing data in more efficient ways when serialised. Any set must be capable of being uncombined back into individual items. 

The set is implemented in JSON as an array, with a unique index identifying each set at the same level within the JSON hierarchy. The set identifier will be an increasting value starting at 1, however, enhanced sets may have a setid that represents a subject, object value or timestamp.

#### combined subject and sets

an example of an observation **set**

```
subject = GB
object = population
"set" = one or more
	value = 10000000
	timestamp = 1600
	value = 11000000
	timestamp = 1700
	value = 12000000
	timestamp = 1800
	value = 13000000
	timestamp = 1900
```
an example of a combined subject, note no value or timestamp is present at the parent level as they aren't mandatory and hence can be excluded.

```
subject = GB
Object = country
"set" = one or more descriptions
"set" = one or more observations
```

and as a final extension to this, there is the combined subject of combined subjects

```
subject = world
object = countries
timestamp = now or at some point in time that this combined subject was created
value = 254 - not necessary, as the actual count should be calculated from the included country combined subjects
"set" = one or more combined subject sets
```

and as a fully formed single combined subject example, 

```
{subject:GB, 
object:country,
set:
{ //start of set
{object:isoxxxx_name,value:Great Britain and northern island},
{object:population,value:65001232,timestamp:2010-10-02 00:00:00}
}, //end of set
set:
{  //start of set
{object:birthrate,
set:
{  //start of set
{timestamp:1900,value:6498},
{timestamp:1901,value:6398},
{timestamp:1902,value:6698},
{timestamp:1903,value:7298},
{timestamp:1904,value:6998},
}  //end of set
}  //end of set
}  //end of combined subject
```

and as a fully formed multiple combined subject example, held in JSON notation as it should be (not all full timestamps are entered for brevity)

Note that instead of using the Varibale name *set*, it is replaced by a relative index at that level within the json hierarchy. this ensures that valid json is created. so the first set will be called "1", the second at the same level "2" and so on. As soon as a new child hierarchy level is spawned, the index starts back at "1" for that particular branch. In an enhanced set, these setids can be replaced any of the 4 descriptors, for example a formatted timestamp. 

```JSON

{
  "subject": "Europe",
  "object": "PoliticalEntities",
  "1": [
    {
      "subject": "GB",
      "object": "country",
      "1": [
        {
          "object": "birthrate",
          "1": [
            {
              "timestamp": "1910-12-31 23:59:59",
              "value": 23
            },
            {
              "timestamp": "1911-12-31 23:59:59",
              "value": 26
            },
            {
              "timestamp": "1912-12-31 23:59:59",
              "value": 66
            },
            {
              "timestamp": "1913-12-31 23:59:59",
              "value": 99
            }
          ]
        },
        {
          "object": "population",
          "1": [
            {
              "timestamp": "1910-12-31 23:59:59",
              "value": 23000000
            },
            {
              "timestamp": "1911-12-31 23:59:59",
              "value": 26000000
            }
          ]
        }
      ],
      "2":[
        {
          "object": "countryname",
          "value": "Great Britain"
        },
        {
          "object": "countrytype",
          "value": "multiparty"
        }
      ]
      
    },
    {
      "subject": "FR",
      "object": "country",
      "1": [
        {
          "object": "birthrate",
          "1": [
            {
              "timestamp": "1910-12-31 23:59:59",
              "value": 23
            },
            {
              "timestamp": "1911-12-31 23:59:59",
              "value": 26
            },
            {
              "timestamp": "1912-12-31 23:59:59",
              "value": 66
            },
            {
              "timestamp": "1913-12-31 23:59:59",
              "value": 99
            }
          ]
        }
      ],
      "2":[
        {
          "object": "countryname",
          "value": "France"
        },
        {
          "object": "countrytype",
          "value": "single"
        }
      ]
    }
  ]
}

```

*(example1.json)*

#### enhanced set ####

the enhanced set further reduces the data by combining data with a setid that equals one of the four descriptors. This in essence acts as a super parent. The enhanced set is initially designed to replicate data input formats for timeseries graphs. 

definition and Example:

note no information is included at the parent level and the subject is excluded as common accross all children. The consumer will know that the conents meet their requirements aon trust from the provider. At some points additional meta data may be added to the enhanced set.

```JSON

{
  "timestamp": [
	    {
	      "object": "xx",
	      "value": nn
	    }
	]
}

{ "2003":["country":"GB","Births":2543},"country":"FR","Births":1234}]}


#### ----------------------------------------------------------------------------------------------------------

From all these examples, it can be seen that it is up to the programmer to determine from the object names how to use the items presented as there is no differentiation between what is a descriptive item and what is an observation. Also the sets of data can contin a mix of information.

### Helper code

#### Set Joiner

Will merge multiple single items that are related at the subject level into as many sets as there are unique subjects

Parameters:

Variable|Required|Description|Options|Default
--------|--------|-----------|-------|-------
`input`|No|The locator of the input JSON|any valid fs supported locator OR if the locator starts with HTTP, then a valid HTTP or HTTPS URL that points at a NDTF format json array|./input.json
`subject`|Yes|the combined subject identifier|any valid string|none
`object`|Yes|the combined subject object defining the relationship between the subject and the sets|any valid string|none
`value`|No|any value to attach to this combination of subjects|any valid JSON value|the number of sets
`timestamp`|No|A timestamp to detail when the combined subject object was created, or when it first became valid|any valid timestamp (uses strict moment to validate)|the timestamp of running the module
`rationalise`|No|produce minimal JSON by removing subjects and objects at child levels|true or false|false
`filename`|No|local file name (no paths) to save a serialised version of the extracted data as an array of sets|any valid filename or not defined for no output. If not defined then the output is displayed to the console|none


#### Subject joiner

Will merge sets and items into a combined subject, as long as they are related at the subject level

Parameters:

Parameter|Required|Description|Options|Default
--------|--------|-----------|-------|-------
`subject`|Yes|the combined subject identifier|any valid string|none
`object`|Yes|the combined subject object defining the relationship between the subject and the sets|any valid string|none
`value`|No|any value to attach to this combination of subjects|any valid JSON value|the number of entries in the set
`timestamp`|No|A timestamp to detail when the combined subject object was created, or when it first became valid|any valid timestamp (uses strict moment to validate)|the timestamp of running the module
`rationalise`|No|produce minimal JSON by removing subjects and objects at child levels|true or false|false

#### Combine joiner

Will merge combined subjects into a combined subject with a single set of the combined subjects

Parameters:

Parameter|Required|Description|Options|Default
--------|--------|-----------|-------|-------
`subject`|Yes|the combined subjects subject identifier|any valid string|none
`object`|Yes|the combined subjects object defining the relationship identifies|any valid string|none
`value`|No|any value to attach to this combination of subjects|any valid JSON value|the number of entries in the set
`timestamp`|No|A timestamp to detail when the combined subjects object was created, or when it first became valid|any valid timestamp (uses strict moment to validate)|the timestamp of running the module

#### Set Grouper

Will use a NDTF file as input and use rules to create a JSON output that can be used by amchart4

for the following, there is a group by on a formatted timstamp, and then an array of subject and values, with the subject renamed and the value renamed

which is similar to the set joiner but for the setid it uses the formatted timestamp and the grouping is at that level and not the subject level.
and instead of an array of sets we have a list of sets

so lets leverage that 

//{
//    "2003": [
//        {
//            "network": "Facebook",
//            "MAU": 0
//        },
//        {
//            "network": "Flickr",
//            "MAU": 0
//        },
//        {
//            "network": "Google Buzz",
//            "MAU": 0
//        }


//    ],
//        "2004": [
//            {
//                "network": "Facebook",
//                "MAU": 0

//      ....



Parameters:

Parameter|Required|Description|Options|Default
--------|--------|-----------|-------|-------
`input`|No|The locater of the input JSON|any valid fs supported locater OR if the locater starts with HTTP, then a valid HTTP or HTTPS URL that points at a NDTF format json array|./input.json
`setid`|Yes|the key to use for the setid instead of the default 1,2,3, this key is automatically removed from the child items. if reformatted, then use this instead of raw|any valid key|`subject`
`groupby`|No|if not null, any items within a set that has the same key values (not the value) processed|`null` or `avg` or `sum`|`null`
`subjectAKA`|No|rename the subject key to this value|any valid string|`null` - use subject
`objectAKA`|No|rename the object key to this value|any valid string|`null` - use object
`valueAKA`|No|rename the value key to this value|any valid string|`null` - use value
`dropkey`|No|dont include this key|any valid string|`null` - ignore rule
`dropvalues`|No|dont include any item with a value lower than this, ignored if the value key isnt numeric|any valid number|`null` - ignore rule
`keepsubjects`|No|an array of subject entries to keep|any valid array of strings|`null` - ignore rule
`timestamp_reformat`|No|reformat the timestamp to this string format|any valid moment string format|`null` - ignore rule
`timestamp_min`|No|ignore any items older than this timestamp|any valid moment string format|`null` - ignore rule

`filename`|No|local file name (no paths) to save a serialised version of the extracted data as an array of sets|any valid filename or not defined for no output. If not defined then the output is displayed to the console|none

#### JSON splitter

Will split a JSON file into items based on provided keys. File must be compatible with JSON.parse

will read the parameters from the JSON_splitter.json file local to the JSON_splitter.js.

Parameters:

Parameter|Required|Description|Options|Default
--------|--------|-----------|-------|-------
`input`|No|The locator of the input JSON|any valid fs supported locator OR if the locator starts with HTTP, then a valid HTTP or HTTPS URL that points at JSON|./input.json
`params`|Yes|an array of one or more sets of the following parameters in JSON format||none
`rootkey`|No|the key value to determine at what level to extract data|a valid string|the first level
`subject`|Yes|the KEY name to use as a subject for an item|any valid string|none
`object`|Yes|the object to insert into the item|any valid string|none
`value`|Yes|the KEY name to use to for the value field of the item|any valid string|none
`type`|No|the type of the value when added to the item|numeric (will validate using parsefloat) or string|string
`timestamp`|No|the KEY name of a timestamp to use for the timestamp field value in the item, or an offset from the runtime of the module as a number|any valid string (timestamp uses loose moment to validate - https://momentjs.com/docs/) Or a negative or positive integer of seconds to offset from the run time|the timestamp of running the module
`timestampformat`|No|a moment compatible timestamp format used to validate any dates found|timestamp string|None - dont use any format
`filename`|No|local file name (no paths) to save a serialised version of the extracted data as an array of items|any valid filename or not defined for no output. If not defined then the output is displayed to the console|none

how to handle variable named keys where the key name is the subject ?
how to determine if there is something we can extract to determine time zone
how to pass a timezone through config so times are corrected for UTC

need to ensure there is always an object at the parent level when we output


### Structures

#### NDTF Item

{
"subject": "",
"object": "",
"timestamp": "", //created from a new Date(timestamp), where timestamp has been validated by moment
"value": "" // can be string or numeric
}

#### NDTF combined subject

{
"subject": "",
"object": "",
"timestamp": "", //created from a new Date(timestamp), where timestamp has been validated by moment/optional
"value": "", // can be string or numeric/optional
"setidx":[] // will start at "1" on the current hierarchy 
}

## Notes

####RDF extracts

(using RDF notation ish https://www.w3.org/TR/2004/REC-rdf-concepts-20040210/ https://cran.r-project.org/web/packages/rdflib/vignettes/rdf_intro.html one way to represent the notion "The sky has the color blue" in RDF is as the triple: a subject denoting "the sky", a predicate denoting "has the color", and an object denoting "blue". Therefore, RDF uses subject instead of object (or entity) in contrast to the typical approach of an entity–attribute–value model in object-oriented design: entity (sky), attribute (color), and value (blue). )
