# MMM-ChartUtilities
Helper and definitions for the MMM-Chartxxx interrellated modules


The Chart modules are based on the Feed interellated modules and much of the design is common (most of the code is copied!!)

The key differences are:

the data transfor format is loosley based on Resource Description Framework (RDF) simplified by Me (definitions below with structures and helpers and data sources in the repository)

the MMM-ChartDisplay module relies on the AMCharts v4 library with helpers copied and further developed to enable it's usage within nodejs and MagicMirror

there is an additional MMM-ChartCommon module that needs to be included into the magicmirror as it enables all the common clientside code required by AMCharts


### NDTF - Neils Data Transfer Format.

base schema: 

(using RDF notation ish https://www.w3.org/TR/2004/REC-rdf-concepts-20040210/ https://cran.r-project.org/web/packages/rdflib/vignettes/rdf_intro.html one way to represent the notion "The sky has the color blue" in RDF is as the triple: a subject denoting "the sky", a predicate denoting "has the color", and an object denoting "blue". Therefore, RDF uses subject instead of object (or entity) in contrast to the typical approach of an entity–attribute–value model in object-oriented design: entity (sky), attribute (color), and value (blue). )

```
Subject: The what, as expressed as a code that can be further expanded if required
Object: The predicate (i use object here instead of predicate - see below how the color example would be expressed
Timestamp: when the information is "valid" from
Value: The object or literal linked to the subject in this triple
```

So for the example we would have:

```
subject = sky
object = colour
value = blue
timestamp = when i last checked

or

subject = grass
object = colour
value = green
timestamp = the first time someone worked this out
```

to extend the schema, there are two types of information, observations and descriptions.

a description enhances a subject with further details



