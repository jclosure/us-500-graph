// populate.js

var chai = require('chai');
var expect = chai.expect;

var _ = require('underscore');

var State = require('../../models/state');


// Tests:

describe('Populating state:', function () {

  it('Should have class of type State', function (next) {

    var props = {
      name: "Ohio",
      population: 888
    };
    
    Entity.create(props, function (err, entity, State) {
      if (err) return next(err);

      expect(entity.id).to.be.a('number');
      expect(entity.name).to.be.equal(props.name);
      expect(entity.population).to.be.equal(props.population);
      expect(entity._class.name).to.be.equal("State");
    });
  
    return next();
  });

});
