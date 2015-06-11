// populate.js

var chai = require('chai');
var expect = chai.expect;

var _ = require('underscore');

var Entity = require('../../models/entity');


// Shared state:

var INITIAL_ENTITIES;
var ENTITY_A, ENTITY_B, ENTITY_C, ENTITY_D;




// Tests:

describe('Populating the graph:', function () {



    it('Should create companies', function (next) {
    
      companies = ['fooCo','barCo'];

      companies.forEach(function(name){
        Entity.create({name: name}, function (err, entity) {
           if (err) return next(err);

  
            expect(entity.id).to.be.a('number');
            expect(entity.name).to.be.equal(name);
        });
      });

      return next();
    });

    it('Should create employees', function (next) {
    
      employees = ['fooEmp','barEmp'];

      employees.forEach(function(name){
        Entity.create({name: name}, function (err, entity) {
           if (err) return next(err);

  
            expect(entity.id).to.be.a('number');
            expect(entity.name).to.be.equal(name);
        });
      });

      return next();
    });

  
    // Two-entity following:

    it('Create entities B and C', function (next) {
        var nameB = 'Test Entity B';
        var nameC = 'Test Entity C';

        function callback(err, entity) {
            if (err) return next(err);

  
            switch (entity.name) {
                case nameB:
                    ENTITY_B = entity;
                    break;
                case nameC:
                    ENTITY_C = entity;
                    break;
                default:
                    // trigger an assertion error:
                    expect(entity.name).to.equal(nameB);
            }

            if (ENTITY_B && ENTITY_C) {
                return next();
            }
        }

        Entity.create({name: nameB}, callback);
        Entity.create({name: nameC}, callback);
    });

 

    it('Have entity B follow entity C', function (next) {
        ENTITY_B.follow(ENTITY_C, function (err) {
            return next(err);
        });
    });

 
    it('Have entity B unfollow entity C', function (next) {
        ENTITY_B.unfollow(ENTITY_C, function (err) {
            return next(err);
        });
    });

 

});
