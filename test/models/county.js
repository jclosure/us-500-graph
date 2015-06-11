// populate.js

var chai = require('chai');
var expect = chai.expect;

var _ = require('underscore');



// Tests:

describe('Populating county:', function () {

  it('Should have class of type County', function (next) {

    County = require('../../models/county');
    
    var props = {
      name: "Ohio",
      population: 888
    };

    expect(State).to.exist; 
    
    County.create('State', props, function (err, entity, State) {
      if (err) return next(err);

      console.log("made it");
      
      expect(entity.id).to.be.a('number');
      expect(entity.name).to.be.equal(props.name);
      expect(entity.population).to.be.equal(props.population);

      debugger;

      return next();
    });
  
    
  });

});
