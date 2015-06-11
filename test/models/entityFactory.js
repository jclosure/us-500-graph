// populate.js

var chai = require('chai');
var expect = chai.expect;

var _ = require('underscore');

//this gets setup global singleton
global.EntityFactory =  global.EntityFactory || require('../../models/entityFactory');

// Tests:

describe('Making different types of entities:', function () {


  it('Create different instances of same Entity Type', function (next) {

    var E1 = new EntityFactory().build();

    var props = { prop1: "asdf",
                  prop2: "qwer" };

    
    E1.create("City", props, function (err, entity) {
      if (err) return next(err);
      debugger;
      expect(entity.id).to.be.a('number');
      expect(entity.name).to.be.equal(props.name);
      expect(entity.prop1).to.be.equal(props.prop1);
      expect(entity.prop2).to.be.equal(props.prop2);


      //make another

      
      var props2 = { name: "Babbler",
                     prop1: "Homer",
                     prop3: "zocky" };
      
      E1.create("City", props2, function (err, entity) {
        if (err) return next(err);
        debugger;
        expect(entity.id).to.be.a('number');
        expect(entity.name).to.be.equal(props2.name);
        expect(entity.prop1).to.be.equal(props2.prop1);
        expect(entity.prop3).to.be.equal(props2.prop3);
        expect(entity.prop2).to.be.undefined;
        
        return next();
        
      });
          
    });
  });

  it('Same factory creates different instances of different Entity types', function (next) {

    var factory = new EntityFactory();
    
    var E1 = new factory.build();

    var props = { name: "Boulder",
                  prop1: "asdf",
                  prop2: "qwer" };

    
    E1.create("County", props, function (err, entity) {
      if (err) return next(err);
      debugger;
      expect(entity.id).to.be.a('number');
      expect(entity.name).to.be.equal(props.name);
      expect(entity.prop1).to.be.equal(props.prop1);
      expect(entity.prop2).to.be.equal(props.prop2);


      //make another type from same factory this time

      var E2 = factory.build();


      expect(E1).to.be.equal(E2);

      
      var props2 = { name: "Babbler",
                     prop1: "Homer",
                     prop3: "zocky" };

      
      
      E2.create("County", props2, function (err, entity) {
        if (err) return next(err);
        debugger;
        expect(entity.id).to.be.a('number');
        expect(entity.name).to.be.equal(props2.name);
        expect(entity.prop1).to.be.equal(props2.prop1);
        expect(entity.prop3).to.be.equal(props2.prop3);
        expect(entity.prop2).to.be.undefined;

        return next();
        
      });
      
    });

  });
});    
      

