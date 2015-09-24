var Snowman = require('../../../.');
var isNumberValidator = require('../../../src/addons/validators/isNumber');

describe('isNumber', function() {

  var snowman, execSpy;

  beforeEach(function() {
    execSpy = {
      onResolve:function() {},
      onReject:function() {}
    };
    snowman = new Snowman({
      _params:{
        n1: null,
        n2: undefined,
        n3: 12,
        n4: 1.8,
        n5: 0,
        n6: '8',
        n7: '8.2',
        n8: 'what?',
        n9: [0, 1],
        n10: {an:'object'}
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('succeeds', function() {
    var isNumber = isNumberValidator(['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7'], {root:'_params'});
    snowman
    .pipe(isNumber)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails', function() {
    var isNumber = isNumberValidator(['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9', 'n10'], {root:'_params'});
    snowman
    .pipe(isNumber)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({
      n8:'is not a number',
      n9:'is not a number',
      n10:'is not a number'
    });
  });
});
