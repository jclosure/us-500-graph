// populate.js

var chai = require('chai');
var expect = chai.expect;

var _ = require('underscore');

var EntityFactory = require('../../models/entityFactory');


// Tests:

describe('Making different types of entities:', function () {


    it('Should create specified entity type', function (next) {

      var factory = new EntityFactory(function (_node) { this._node = _node; }, ['prop1','prop2']);
      
      var City = factory.build();

      var props = { name: "Boulder",
                    prop1: "asdf",
                    prop2: "qwer" };


       City.create(props, function (err, entity) {
        if (err) return next(err);

        expect(entity.id).to.be.a('number');
        expect(entity.name).to.be.equal(props.name);
        expect(entity.prop1).to.be.equal(props.prop1);
        expect(entity.prop2).to.be.equal(props.prop2);
        
      });
      
      
      // Entity.create(props, function (err, entity) {
      //   if (err) return next(err);

      //   expect(entity.id).to.be.a('number');
      //   expect(entity.name).to.be.equal(props.name);
      //   expect(entity.prop1).to.be.equal(props.prop1);
      //   expect(entity.prop2).to.be.equal(props.prop2);
        
      // });


      return next();
    });

  
 

});
