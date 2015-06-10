// tests.js



var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;

describe('General Testing', function(){
  describe('Array', function(){
    describe('#indexOf()', function(){
      it('should return -1 when the value is not present', function(){
        assert.equal(-1, [1,2,3].indexOf(5));  // START TESTS
        assert.equal(-1, [1,2,3].indexOf(0));
        expect(true).to.equal(true);
      });
    });
  });
});



