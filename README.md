# MMM-ChartUtilities
Helper and definitions for the MMM-Chartxxx interrelated modules


The Chart modules are based on the Feed interrelated modules and much of the design is common (most of the code is copied!!)

The key differences are:

the data transfer format is loosely based on Resource Description Framework (RDF) simplified by Me (definitions below with structures and helpers and data sources in the repository)

the MMM-ChartDisplay module relies on the AMCharts v4 library with helpers copied and further developed to enable it's usage within nodejs and MagicMirror

there is an additional MMM-ChartCommon module that needs to be included into the magicmirror as it enables all the common clientside code required by AMCharts


### NDTF - Neils Data Transfer Format.

#### base schema: 

(using RDF notation ish https://www.w3.org/TR/2004/REC-rdf-concepts-20040210/ https://cran.r-project.org/web/packages/rdflib/vignettes/rdf_intro.html one way to represent the notion "The sky has the color blue" in RDF is as the triple: a subject denoting "the sky", a predicate denoting "has the color", and an object denoting "blue". Therefore, RDF uses subject instead of object (or entity) in contrast to the typical approach of an entity–attribute–value model in object-oriented design: entity (sky), attribute (color), and value (blue). )

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
timestamp = 1980-12-12	// at the end of the 1980's
```

As this is a rather inefficient though very clear way of expressing information, a final extension is added that is of **sets**.

The concept of the set allows any particular entry to inherit its subject and object from its parent. the value must always be present along with the timestamp.

This enables the creation of the concept of a **combined subject** from one or more individual items for sharing across applications or storing data in more efficient ways when serialised. Any set must be capable of being uncombined back into individual items. 

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
an example of a combined subject, note no value or timestamp is present as they aren't mandatory at a parent level

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

and as a fully formed single combined subject example, held in JSON notation as it should be (not all quotes are included nor full timestamps for brevity)

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

Note that instead of using the Varibale name *set*, it is replaced by a relative index at that level within the json hierarchy. this ensures that valid json is created. so the first set will be called "1", the second at the same level "2" and so on. As soon as a new hierachy is created the index starts back at "1"

```
https://cdn.githubusercontent.com/TheBodger/MMM-ChartUtilities/master/example1.json?token=AJ4QC4H4MYCZOKLOSAZDHJK6VLRP6
```
*(example1.json)*


From these examples, it can be seen that it is up to the programmer to determine from the object names how to use the items presented as there is no differentiation between what is a descriptive item and what is an observation.
