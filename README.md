# MMM-ChartUtilities
Helper and definitions for the MMM-Chartxxx interrellated modules


The Chart modules are based on the Feed interellated modules and much of the design is common (most of the code is copied!!)

The key differences are:

the data transfor format is loosley based on Resource Description Framework (RDF) simplified by Me (definitions below with structures and helpers and data sources in the repository)

the MMM-ChartDisplay module relies on the AMCharts v4 library with helpers copied and further developed to enable it's usage within nodejs and MagicMirror

there is an additional MMM-ChartCommon module that needs to be included into the magicmirror as it enables all the common clientside code required by AMCharts


### NDTF - Neils Data Transfer Format.

base schema: (using RDF notation ish https://www.w3.org/TR/2004/REC-rdf-concepts-20040210/)

Subject: The what, as expressed as a code that can be further expanded
Object: The predicate
Timestamp: when the information is "valid" from
Value: The object
