const Snowman = require('../../../.');
const isDefinedAndNotNullValidator = require('../../../src/addons/validators/isDefinedAndNotNull');

describe('isDefinedAndNotNull', function() {

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
    const isDefinedAndNotNull = isDefinedAndNotNullValidator(['username', 'email', 'company.name', 'age', 'felonies'], {root:'_params'});
    snowman
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds without root', function() {
    const isDefinedAndNotNull = isDefinedAndNotNullValidator(['_params.username', '_params.email', '_params.company.name', '_params.age', '_params.felonies']);
    snowman
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds when the field is empty string', function() {
    const isDefinedAndNotNull = isDefinedAndNotNullValidator(['fname'], {root:'_params'});
    snowman
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails when the field is null', function() {
    const isDefinedAndNotNull = isDefinedAndNotNullValidator(['ssn'], {root:'_params'});
    snowman
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({ssn:'is undefined or null'});
  });

  it('fails when the field is undefined', function() {
    const isDefinedAndNotNull = isDefinedAndNotNullValidator(['dob'], {root:'_params'});
    snowman
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({dob:'is undefined or null'});
  });

  it('fails when the field is undefined and not present', function() {
    const isDefinedAndNotNull = isDefinedAndNotNullValidator(['random'], {root:'_params'});
    snowman
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({random:'is undefined or null'});
  });

  it('fails when the field is undefined and not present and nested', function() {
    const isDefinedAndNotNull = isDefinedAndNotNullValidator(['random.data'], {root:'_params'});
    snowman
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({random:{data:'is undefined or null'}});
  });

  it('puts the errors in a custom place', function() {
    const isDefinedAndNotNull = isDefinedAndNotNullValidator(['ssn'], {root:'_params', errorPath: 'errMap'});
    snowman
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData().errMap).toEqual({ssn:'is undefined or null'});
  });

  it('generates errors for multiple fields', function() {
    const isDefinedAndNotNull = isDefinedAndNotNullValidator(['username', 'ssn', 'email', 'dob', 'fname'], {root:'_params'});
    snowman
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({ssn:'is undefined or null',dob:'is undefined or null'});
  });
});
