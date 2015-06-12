// populate.js

var _ = require('underscore');

var domain = require('../models/domain.js');


(function main() {

  process.on('uncaughtException', function (er) {
    console.error(er.stack)
    process.exit(1)
  })
  
  try {
    aquireRecords("./data/us-500.csv", function(msg) { console.log(msg); });
  } catch (er) {
    console.error('Unable to process csv', er)
  }
  
})();


// Helpers

function noop(){};

function populateRecord(record, signaler) {
  domain.State.create(record.state, function (err, state) {
    domain.County.create(record.county, function (err, county) {
      domain.City.create(record.city, function (err, city) {
        domain.Address.create(record.address, function (err, address) {
          domain.Zipcode.create(record.zipcode, function (err, zipcode) {
            domain.Company.create(record.company, function (err, company) {
              domain.Person.create(record.person, function (err, person) {
                
                // compose graph relations

                               
                // employee--company
                person.employed_by(company, noop);
                company.employ(person, noop);

                // composing address model graph
                company.located_at(address, noop);
                address.belong_to(city, noop);
                city.belong_to(county, noop);
                county.belong_to(state, noop);

                // // zipcode mutual belonging
                address.belong_to(zipcode, noop);
                zipcode.belong_to(address, noop);
                city.belong_to(zipcode, noop);
                zipcode.belong_to(city, noop);
                county.belong_to(zipcode, noop);
                zipcode.belong_to(county, noop);
                state.belong_to(zipcode, noop);
                zipcode.belong_to(state, noop);

                signaler.report("successfully populated: " + record.company.name);
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

function aquireRecords(csvFileName, report) {
  //CSV Converter Class
  var Converter=require("csvtojson").core.Converter;
  var fs=require("fs");
    
  var fileStream=fs.createReadStream(csvFileName);

  //new converter instance
  var param={};
  var csvConverter=new Converter(param);
  
  csvConverter.on("end_parsed",function(jsonObj){

    var records = jsonObj.map(function(obj){ return destructure(obj); });
     
    _.take(records, 5).forEach(function(record, idx){
      report("submitting record for company: " + record.company.name);
      populateRecord(record, { report: report });
    });

    report("\nPlease wait while I finish your import...\n");

  });
  
  //read from file
  fileStream.pipe(csvConverter);
}
