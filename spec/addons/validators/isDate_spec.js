var Snowman = require('../../../.');
var isDateValidator = require('../../../src/addons/validators/isDate');

describe('isDate', function() {

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
        n4: new Date,
        n5: 'test',
        n6: {an:'object'}
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('succeeds', function() {
    var isDate = isDateValidator(['n1', 'n2', 'n3', 'n4'], {root:'_params'});
    snowman
    .pipe(isDate)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails', function() {
    var isDate = isDateValidator(['n1', 'n2', 'n3', 'n4', 'n5', 'n6'], {root:'_params'});
    snowman
    .pipe(isDate)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({
      n5:'is not a date',
      n6:'is not a date'
    });
  });
});
