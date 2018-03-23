// populate.js

State = require('../../models/state');
County = require('../../models/county');
City = require('../../models/city');


var chai = require('chai');
var expect = chai.expect;

var _ = require('underscore');

var texasProps = {
  name: "Texas",
  population: 100000000
},
travisProps = {
  name: "Travis",
  population: 1000000
},
austinProps = {
  name: "Austin",
  population: 1000000000
};

// Tests:

describe('Entity model testing:', function () {

   it('Should not overlap properties between instances.', function (next) {

    expect(County).to.exist;

    var props = { name: "Orangutan",
                  prop1: "Yorker",
                  prop2: "Wormple" };


    County.create(props, function (err, entity) {
      if (err) return next(err);

      expect(entity.id).to.be.a('number');
      expect(entity.name).to.be.equal(props.name);
      expect(entity.prop1).to.be.equal(props.prop1);
      expect(entity.prop2).to.be.equal(props.prop2);


      //make another type from same factory this time



      var props2 = { name: "Babbler",
                     prop1: "Homer",
                     prop3: "Zocky" };


      County.create(props2, function (err, entity) {
        if (err) return next(err);

        expect(entity.id).to.be.a('number');
        expect(entity.name).to.be.equal(props2.name);
        expect(entity.prop1).to.be.equal(props2.prop1);
        expect(entity.prop3).to.be.equal(props2.prop3);
        expect(entity.prop2).to.be.undefined;

        return next();

      });

    });


  });



  it('Should have class of type County', function (next) {

    expect(County).to.exist;

    County.create(travisProps, function (err, entity) {

      if (err) return next(err);

      expect(entity.id).to.be.a('number');
      expect(entity.name).to.be.equal(travisProps.name);
      expect(entity.population).to.be.equal(travisProps.population);

      return next();
    });

  });



  it('Should be able to get from the graph', function (next) {

    expect(County).to.exist;

    County.create(travisProps, function (err, entity) {

      if (err) return next(err);
      debugger;
      County.get(entity.id, function(err, found){
        debugger;
        expect(found).to.exist;
        return next();
      })
    });

  });


  it('Should be able to get all Counties from the graph', function (next) {

    expect(County).to.exist;

    County.create(travisProps, function (err, entity) {

      if (err) return next(err);
      debugger;
      County.getAll(function(err, found){
        debugger;

        expect(found).to.exist;
        return next();
      })
    });

  });

  it('Should be able to get matching Counties from the graph', function (next) {

    expect(County).to.exist;

    County.create(travisProps, function (err, entity) {

      if (err) return next(err);
      debugger;
      var where = "entity.name = 'Travis'";
      County.getAllWhere(where, function(err, found){
        debugger;

        expect(found).to.exist;
        return next();
      })
    });

  });


  it('Should be able to get Counties by property or create one', function (next) {

    expect(County).to.exist;

    var monkeyProps = { name: "Monkey" };

    County.getByPropertyOrCreate("name","Monkey",monkeyProps, function (err, entities) {
      if (err) return next(err);
      debugger;
      expect(entities).to.exist;
      expect(entities).to.have.members;
      return next();
    });
  });



  it('Cities belong to Counties, Counties belog to States', function(next){

    State.create(texasProps, function (err, state) {
      if (err) return next(err);
      debugger;
      County.create(travisProps, function (err, county) {
        if (err) return next(err);
        debugger;
        county.belong_to(state, function(err) {
          debugger;
          City.create(austinProps, function (err, city) {
            if (err) return next(err);
            debugger;
            city.belong_to(county, function(err) {
              debugger;
              return next();
            });
          });
        });
      });
    });

  });



});
