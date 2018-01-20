var utils = require('../src/utils.js');
var expect = require('chai').expect;

describe('加法函数的测试', function() {
  it('1 加 1 应该等于 2', function() {
    expect(utils.add(1, 1)).to.be.equal(2);
  });
});