const Snowman = require('../../../.');
const isArrayValidator = require('../../../src/addons/validators/isArray');

describe('isArray', function() {

  let snowman, execSpy;

  beforeEach(function() {
    execSpy = {
      onResolve:function() {},
      onReject:function() {}
    };
    snowman = new Snowman({
      _params:{
        a1: null,
        a2: undefined,
        a3: [],
        a4: [1,2,3],
        a5: [1,2,3,4],
        a6: [1,2,3,4,5],
        a7: [1,2,3,4,5,6],
        a8: 'str',
        a9: 4,
        a10: {an:'object'}
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('succeeds', function() {
    const isArray = isArrayValidator(['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'], {root:'_params'});
    snowman
    .pipe(isArray)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails', function() {
    const isArray = isArrayValidator(['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'a10'], {root:'_params'});
    snowman
    .pipe(isArray)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({
      a8:'is not an array',
      a9:'is not an array',
      a10:'is not an array'
    });
  });

  it('succeeds with length', function() {
    const isArray = isArrayValidator(['a5'], {root:'_params', length:4});
    snowman
    .pipe(isArray)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails with length', function() {
    const isArray = isArrayValidator(['a4', 'a5'], {root:'_params', length: 4});
    snowman
    .pipe(isArray)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({
      a4:'must be an array of 4 elements'
    });
  });

  it('succeeds with maxLength', function() {
    const isArray = isArrayValidator(['a1', 'a2', 'a3', 'a4', 'a5', 'a6'], {root:'_params', maxLength:5});
    snowman
    .pipe(isArray)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails with maxLength', function() {
    const isArray = isArrayValidator(['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'], {root:'_params', maxLength: 5});
    snowman
    .pipe(isArray)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({
      a7:'must be an array with a max of 5 elements'
    });
  });

  it('succeeds with minLength', function() {
    const isArray = isArrayValidator(['a1', 'a2', 'a5', 'a6', 'a7'], {root:'_params', minLength:4});
    snowman
    .pipe(isArray)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails with minLength', function() {
    const isArray = isArrayValidator(['a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7'], {root:'_params', minLength: 4});
    snowman
    .pipe(isArray)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({
      a3:'must be an array with a min of 4 elements',
      a4:'must be an array with a min of 4 elements'
    });
  });
});
