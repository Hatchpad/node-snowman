const Snowman = require('../../../.');
const isDefinedValidator = require('../../../src/addons/validators/isDefined');

describe('isDefined', function() {

  let snowman, execSpy;

  beforeEach(function() {
    execSpy = {
      onResolve:function() {},
      onReject:function() {}
    };
    snowman = new Snowman({
      _params:{
        username:'john',
        email:'doe',
        ssn: null,
        dob: undefined,
        fname: '',
        company: {
          name: 'hatchpad.io'
        },
        age: 18,
        felonies: 0
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('succeeds', function() {
    const isDefined = isDefinedValidator(['username', 'email', 'company.name', 'age', 'felonies'], {root:'_params'});
    snowman
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds without root', function() {
    const isDefined = isDefinedValidator(['_params.username', '_params.email', '_params.company.name', '_params.age', '_params.felonies']);
    snowman
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds when the field is empty string', function() {
    const isDefined = isDefinedValidator(['fname'], {root:'_params'});
    snowman
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds when the field is null', function() {
    const isDefined = isDefinedValidator(['ssn'], {root:'_params'});
    snowman
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails when the field is undefined', function() {
    const isDefined = isDefinedValidator(['dob'], {root:'_params'});
    snowman
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({dob:'is undefined'});
  });

  it('fails when the field is undefined and not present', function() {
    const isDefined = isDefinedValidator(['random'], {root:'_params'});
    snowman
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({random:'is undefined'});
  });

  it('fails when the field is undefined and not present and nested', function() {
    const isDefined = isDefinedValidator(['random.data'], {root:'_params'});
    snowman
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({random:{data:'is undefined'}});
  });

  it('puts the errors in a custom place', function() {
    const isDefined = isDefinedValidator(['dob'], {root:'_params', errorPath: 'errMap'});
    snowman
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData().errMap).toEqual({dob:'is undefined'});
  });

  it('generates errors for multiple fields', function() {
    const isDefined = isDefinedValidator(['username', 'ssn', 'email', 'dob', 'fname', 'not_present'], {root:'_params'});
    snowman
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({dob:'is undefined', not_present:'is undefined'});
  });
});
