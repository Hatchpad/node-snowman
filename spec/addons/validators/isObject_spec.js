const Snowman = require('../../../.');
const isObjectValidator = require('../../../src/addons/validators/isObject');

describe('isObject', function() {

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
        em4: 12,
        em6: {},
        em7: {an:'object'},
        em8: [0, 1, 2, 3]
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('succeeds', function() {
    const isEmail = isObjectValidator(['em1', 'em2', 'em6', 'em7'], {root:'_params'});
    snowman
    .pipe(isEmail)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails for string', function() {
    const isEmail = isObjectValidator(['em3'], {root:'_params'});
    snowman
    .pipe(isEmail)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({em3:'is not an object'});
  });

  it('fails for number', function() {
    const isEmail = isObjectValidator(['em4'], {root:'_params'});
    snowman
    .pipe(isEmail)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({em4:'is not an object'});
  });

  it('fails for array', function() {
    const isEmail = isObjectValidator(['em8'], {root:'_params'});
    snowman
    .pipe(isEmail)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({em8:'is not an object'});
  });
});
