var Snowman = require('../../../.');
var isUsernameValidator = require('../../../src/addons/validators/isUsername')();

describe('isEmail', function() {

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
        un3: 'john22',
        un4: 'john_doe_22',
        un5: 'john.doe@hatchpad.io',
        un6: 'john.doe',
        un7: '_johndoe',
        un8: 'john$'
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('succeeds', function() {
    var isUsername = isUsernameValidator(['un1', 'un2', 'un3', 'un4'], {root:'_params'});
    snowman
    .pipe(isUsername)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails', function() {
    var isUsername = isUsernameValidator(['un1', 'un2', 'un3', 'un4', 'un5', 'un6', 'un7', 'un8'], {root:'_params'});
    snowman
    .pipe(isUsername)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({
      un5: 'is not a valid username',
      un6: 'is not a valid username',
      un7: 'is not a valid username',
      un8: 'is not a valid username'
    });
  });
});
