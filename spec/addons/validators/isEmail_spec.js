const Snowman = require('../../../.');
const isEmailValidator = require('../../../src/addons/validators/isEmail');

describe('isEmail', function() {

  let snowman, execSpy;

  beforeEach(function() {
    execSpy = {
      onResolve:function() {},
      onReject:function() {}
    };
    snowman = new Snowman({
      _params:{
        em1: null,
        em2: undefined,
        em3: 'jason.mullins@hatchpad.io',
        em4: 'test@gmail.com',
        em5: 'without-at'
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('succeeds', function() {
    const isEmail = isEmailValidator(['em1', 'em2', 'em3', 'em4'], {root:'_params'});
    snowman
    .pipe(isEmail)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails', function() {
    const isEmail = isEmailValidator(['em1', 'em2', 'em3', 'em4', 'em5'], {root:'_params'});
    snowman
    .pipe(isEmail)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({em5:'is not a valid email address'});
  });
});
