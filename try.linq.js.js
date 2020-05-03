// JavaScript source code

////
//Average
//Count
//Max
//Min
//MaxBy
//MinBy
//Sum


var linq = require("linq");

// An array of employees.
var employees = [
    { firstName: "John", lastName: "Doe", role: "Developer", rating: 4 },
    { firstName: "Jane", lastName: "Smith", role: "Manager", rating: 3 },
    { firstName: "Jxohn", lastName: "Doe", role: "Developer", rating: 4 },
    { firstName: "Jayne", lastName: "Smith", role: "Manager", rating: 3 },
    { firstName: "Jzohn", lastName: "Doe", role: "Developer", rating: 4 },
    { firstName: "Jaane", lastName: "Smith", role: "Manager", rating: 3 },
    { firstName: "Jbohn", lastName: "Doe", role: "Developer", rating: 4 },
    { firstName: "Jacne", lastName: "Smith", role: "Manager", rating: 3 },
];

var data = [
    {
    subject: 'Italy',
    timestamp: '2020-04-27T23:00:00.000Z',
    value: 0,
    JSONstring: [Function],
    JSONobj: [Function],
    subjectname: 'Country',
    valuename: 'Deaths',
    timestampname: 'timestamp',
    timestampformatted: '2020-04-27T23:00:00.000Z',
    timestampformat: '2020-04-28'
},
    {
        subject: 'Italy',
        timestamp: '2020-04-26T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-26T23:00:00.000Z',
        timestampformat: '2020-04-27'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-25T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-25T23:00:00.000Z',
        timestampformat: '2020-04-26'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-24T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-24T23:00:00.000Z',
        timestampformat: '2020-04-25'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-23T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-23T23:00:00.000Z',
        timestampformat: '2020-04-24'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-22T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-22T23:00:00.000Z',
        timestampformat: '2020-04-23'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-21T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-21T23:00:00.000Z',
        timestampformat: '2020-04-22'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-20T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-20T23:00:00.000Z',
        timestampformat: '2020-04-21'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-19T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-19T23:00:00.000Z',
        timestampformat: '2020-04-20'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-18T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-18T23:00:00.000Z',
        timestampformat: '2020-04-19'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-17T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-17T23:00:00.000Z',
        timestampformat: '2020-04-18'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-16T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-16T23:00:00.000Z',
        timestampformat: '2020-04-17'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-15T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-15T23:00:00.000Z',
        timestampformat: '2020-04-16'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-14T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-14T23:00:00.000Z',
        timestampformat: '2020-04-15'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-13T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-13T23:00:00.000Z',
        timestampformat: '2020-04-14'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-12T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-12T23:00:00.000Z',
        timestampformat: '2020-04-13'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-11T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-11T23:00:00.000Z',
        timestampformat: '2020-04-12'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-10T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-10T23:00:00.000Z',
        timestampformat: '2020-04-11'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-09T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-09T23:00:00.000Z',
        timestampformat: '2020-04-10'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-08T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-08T23:00:00.000Z',
        timestampformat: '2020-04-09'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-07T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-07T23:00:00.000Z',
        timestampformat: '2020-04-08'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-06T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-06T23:00:00.000Z',
        timestampformat: '2020-04-07'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-05T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-05T23:00:00.000Z',
        timestampformat: '2020-04-06'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-04T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-04T23:00:00.000Z',
        timestampformat: '2020-04-05'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-03T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-03T23:00:00.000Z',
        timestampformat: '2020-04-04'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-02T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-02T23:00:00.000Z',
        timestampformat: '2020-04-03'
  },
    {
        subject: 'Italy',
        timestamp: '2020-04-01T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-04-01T23:00:00.000Z',
        timestampformat: '2020-04-02'
  },
    {
        subject: 'Italy',
        timestamp: '2020-03-31T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-31T23:00:00.000Z',
        timestampformat: '2020-04-01'
  },
    {
        subject: 'Italy',
        timestamp: '2020-03-30T23:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-30T23:00:00.000Z',
        timestampformat: '2020-03-31'
  },
    {
        subject: 'Italy',
        timestamp: '2020-03-29T23:00:00.000Z',
        value: 2,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-29T23:00:00.000Z',
        timestampformat: '2020-03-30'
  },
    {
        subject: 'Italy',
        timestamp: '2020-03-29T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-29T00:00:00.000Z',
        timestampformat: '2020-03-29'
  },
    {
        subject: 'Italy',
        timestamp: '2020-03-28T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-28T00:00:00.000Z',
        timestampformat: '2020-03-28'
  },
    {
        subject: 'Italy',
        timestamp: '2020-03-27T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-27T00:00:00.000Z',
        timestampformat: '2020-03-27'
  },
    {
        subject: 'Italy',
        timestamp: '2020-03-26T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-26T00:00:00.000Z',
        timestampformat: '2020-03-26'
    },
    {
        subject: 'Italy',
        timestamp: '2020-03-25T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-25T00:00:00.000Z',
        timestampformat: '2020-03-25'
    },
    {
        subject: 'Germany',
        timestamp: '2020-03-25T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-25T00:00:00.000Z',
        timestampformat: '2020-03-25'
    },
    {
        subject: 'Belgium',
        timestamp: '2020-03-25T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-25T00:00:00.000Z',
        timestampformat: '2020-03-25'
    },
    {
        subject: 'GreatBritain',
        timestamp: '2020-03-25T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-25T00:00:00.000Z',
        timestampformat: '2020-03-25'
  },
    {
        subject: 'Italy',
        timestamp: '2020-03-24T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-24T00:00:00.000Z',
        timestampformat: '2020-03-24'
  },
    {
        subject: 'Italy',
        timestamp: '2020-03-23T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-23T00:00:00.000Z',
        timestampformat: '2020-03-23'
  },
    {
        subject: 'Italy',
        timestamp: '2020-03-22T00:00:00.000Z',
        value: 0,
        JSONstring: [Function],
        JSONobj: [Function],
        subjectname: 'Country',
        valuename: 'Deaths',
        timestampname: 'timestamp',
        timestampformatted: '2020-03-22T00:00:00.000Z',
        timestampformat: '2020-03-22'
  }
]


// use fourth argument to groupBy (compareSelector)
var teams = linq.from(data)
    .groupBy(
        "$.timestampformat",
        "'{'+$.subjectname+':'+$.subject+','+$.valuename+':'+$.value+'}'",
        function (key, group) { return { s:key, o:group.toJoinedString(',') } },
        function (key) { return key.toString() }).toArray();

console.info(teams);



// use fourth argument to groupBy (compareSelector)
var teams = linq.from(employees)
    .groupBy(
        "$.role",
        "$.firstName+ ' ' + $.lastName",
        function (key, group) { return { role: key, names: group.toJoinedString(',') } },
        function (key) { return key.toString() }).toArray();

console.info(teams);



// Function example.
var names = linq.from(employees)
    .select(function (employee) {
        return { name: employee.firstName + ' ' + employee.lastName };
    })
    .toArray();

console.info(names);

// Using functions as parameters.
var teams = linq.from(employees)
    .groupBy(
        function (employee) { return employee.role; },
        function (employee) { return { name: employee.firstName + ' ' + employee.lastName }; },
        function (key, grouping) { return { team: key, members: grouping.source }; }
    )
    .toArray();

console.info(teams);


var objects = [
    { Date: new Date(2000, 1, 1), Id: 1 },
    { Date: new Date(2010, 5, 5), Id: 2 },
    { Date: new Date(2000, 1, 1), Id: 3 }
]

// ref compare, cannot do grouping
var teams = linq.from(objects)
    .groupBy("$.Date", "$.Id",
        function (key, group) { return { date: key, ids: group.toJoinedString(',') } })
    .log("$.date + ':' + $.ids").toJoinedString();

console.log("------");

// use fourth argument to groupBy (compareSelector)
var teams = linq.from(objects)
    .groupBy("$.Date", "$.Id",
        function (key, group) { return { date: key, ids: group.toJoinedString(',') } },
        function (key) { return key.toString() }).toArray();

console.info(teams);
