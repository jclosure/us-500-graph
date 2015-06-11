// populate.js

County = require('../../models/county');
State = require('../../models/state');

var chai = require('chai');
var expect = chai.expect;

var _ = require('underscore');

var props = {
      name: "Ohio",
      population: 888
    };


// Tests:

describe('Populating county:', function () {

  it('Should have class of type County', function (next) {
    
    
    expect(State).to.exist; 
    
    County.create('State', props, function (err, entity, State) {
      if (err) return next(err);

            
      expect(entity.id).to.be.a('number');
      expect(entity.name).to.be.equal(props.name);
      expect(entity.population).to.be.equal(props.population);


      return next();
    });
  
    
  });


  it('Counties belong to States', function(next){

    State.create('State', {name: "Texas"}, function (err, state, State) {
      if (err) return next(err);
      
      County.create('County', {name: "Austin"}, function (err, county, State) {
        if (err) return next(err);
        
        // county.follow(state, function(err) {
        //   debugger;
        // });
        
        county.relate('BELONGS_TO', state, function(err) {  
          return next();  
        });

      });
    });
    
  });
});
