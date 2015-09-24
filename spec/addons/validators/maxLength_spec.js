var Snowman = require('../../../.');
var maxLengthValidator = require('../../../src/addons/validators/maxLength');

describe('maxLength', function() {

  var snowman, execSpy;

  beforeEach(function() {
    execSpy = {
      onResolve:function() {},
      onReject:function() {}
    };
    snowman = new Snowman({
      _params:{
        un1: null,
        un2: undefined,
        un3: '123',
        un4: '1234',
        un5: '12345'
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('succeeds', function() {
    var maxLength = maxLengthValidator(['un1', 'un2', 'un4', 'u5'], 4, {root:'_params'});
    snowman
    .pipe(maxLength)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails', function() {
    var maxLength = maxLengthValidator(['un1', 'un2', 'un3', 'un4', 'un5'], 4, {root:'_params'});
    snowman
    .pipe(maxLength)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({
      un5: 'is too long (max length is 4)'
    });
  });
});
