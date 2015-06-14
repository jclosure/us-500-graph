// populate.js

var _ = require('underscore'),
    async = require('async'),
    Converter=require("csvtojson").core.Converter,
    fs=require("fs"),
    domain = require('../models/domain.js');


(function main() { importCsv("./data/us-500.csv"); })();


function importCsv(csvFileName, number) {
  
  var fileStream=fs.createReadStream(csvFileName);
  var csvConverter=new Converter({});
  
  csvConverter.on("end_parsed",function(jsonObj){

    var records = jsonObj.map(function(obj){ return destructure(obj); });

    if (number)
      records = _.take(records, number);

    processSeries(records,
                  populateRecord,
                  function(record) { console.log("processing: " + record.company.name); },
                  function(record) { console.log("processed: " + record.company.name); },
                  function(results) { results.forEach(function(result) { console.log("finished: " + result.company.name); }); });

  });
  
  //read from file
  fileStream.pipe(csvConverter);
}


function populateRecord(record, collect) {
  domain.State.getByPropertyOrCreate("name", record.state.name, record.state, function (err, state) {
    domain.County.getByPropertyOrCreate("name", record.county.name, record.county, function (err, county) {
      domain.City.getByPropertyOrCreate("name", record.city.name, record.city, function (err, city) {
        domain.Address.getByPropertyOrCreate("line", record.address.line, record.address, function (err, address) {
          domain.Zipcode.getByPropertyOrCreate("number", record.zipcode.number, record.zipcode, function (err, zipcode) {
            domain.Company.getByPropertyOrCreate("name", record.company.name, record.company, function (err, company) {
              domain.Person.getByPropertyOrCreate("name", record.person.name, record.person, function (err, person) {
                        
                // compose graph relations

                if (company) {
                  
                  // employee<-->company
                  person.employed_by(company, noop);
                  company.employ(person, noop);
                  
                  // composing address model graph
                  company.located_at(address, noop);
                  address.belong_to(city, noop);
                  city.belong_to(county, noop);
                  county.belong_to(state, noop);

                  // zipcode mutual belonging
                  address.belong_to(zipcode, noop);
                  zipcode.belong_to(address, noop);
                  city.belong_to(zipcode, noop);
                  zipcode.belong_to(city, noop);
                  county.belong_to(zipcode, noop);
                  zipcode.belong_to(county, noop);
                  state.belong_to(zipcode, noop);
                  zipcode.belong_to(state, noop);

                  collect({
                    company: company,
                    person: person,
                    address: address,
                    city: city,
                    county: county,
                    state: state,
                    zipcode: zipcode
                  });
                }
                else
                  console.log("models not created, check database connection");
              });
            });
          });
        });
      });
    });
  });
}


function destructure(obj) {

  //exemplar:
  // { employee_first_name: 'Tiera',
  //   employee_last_name: 'Frankel',
  //   company_name: 'Roland Ashcroft',
  //   company_address: '87 Sierra Rd',
  //   company_city: 'El Monte',
  //   company_county: 'Los Angeles',
  //   company_state: 'CA',
  //   company_zip: 91731,
  //   company_phone1: '626-636-4117',
  //   personal_phone2: '626-638-4241',
  //   personal_email: 'tfrankel@aol.com',
  //   company_web: 'http://www.rolandashcroft.com' }
  
  return {
    state: {
      name: obj.company_state
    },
    county: {
      name: obj.company_county
    },
    city: {
      name: obj.company_city
    },
    zipcode: {
      number: obj.company_zip
    },
    address: {
      line: obj.company_address, 
    },
    company: {
      name: obj.company_name,
      website: obj.company_web,
      phone: obj.company_phone1
    },
    person: {
      name: obj.employee_first_name + " " + obj.employee_last_name,
      first_name: obj.employee_first_name,
      last_name: obj.employee_last_name,
      personal_email: obj.personal_email,
      personal_phone: obj.personal_phone2,
      company_phone: obj.company_phone1
    }
  };
}


// Helpers

function processSeries(records, work, before, after, done){

  // A simple async series:
  
  var results = [];
  function series(record) {
    debugger;
    if(record) {
      before(record);
      work(record, function(result) {
        after(record);
        results.push(result);
        return series(records.shift());
      });
    } else {
      done(results);
      console.log("Done...");
    }
  }
  series(records.shift());
}

function noop(){};
