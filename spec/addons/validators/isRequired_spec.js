var Snowman = require('../../../.');
var isRequiredValidator = require('../../../src/addons/validators/isRequired');

describe('isRequired', function() {

  var snowman, execSpy;

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
    var isRequired = isRequiredValidator(['username', 'email', 'company.name', 'age', 'felonies'], {root:'_params'});
    snowman
    .pipe(isRequired)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds without root', function() {
    var isRequired = isRequiredValidator(['_params.username', '_params.email', '_params.company.name', '_params.age', '_params.felonies'], {root: null});
    snowman
    .pipe(isRequired)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails when the field is empty string', function() {
    var isRequired = isRequiredValidator(['fname'], {root:'_params'});
    snowman
    .pipe(isRequired)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({fname:'is required'});
  });

  it('fails when the field is null', function() {
    var isRequired = isRequiredValidator(['ssn'], {root:'_params'});
    snowman
    .pipe(isRequired)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({ssn:'is required'});
  });

  it('fails when the field is undefined', function() {
    var isRequired = isRequiredValidator(['dob'], {root:'_params'});
    snowman
    .pipe(isRequired)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({dob:'is required'});
  });

  it('fails when the field is undefined and not present', function() {
    var isRequired = isRequiredValidator(['random'], {root:'_params'});
    snowman
    .pipe(isRequired)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({random:'is required'});
  });

  it('fails when the field is undefined and not present and nested', function() {
    var isRequired = isRequiredValidator(['random.data'], {root:'_params'});
    snowman
    .pipe(isRequired)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({random:{data:'is required'}});
  });

  it('puts the errors in a custom place', function() {
    var isRequired = isRequiredValidator(['ssn'], {root:'_params', errorPath: 'errMap'});
    snowman
    .pipe(isRequired)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData().errMap).toEqual({ssn:'is required'});
  });

  it('generates errors for multiple fields', function() {
    var isRequired = isRequiredValidator(['username', 'ssn', 'email', 'dob', 'fname'], {root:'_params'});
    snowman
    .pipe(isRequired)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._errors).toEqual({ssn:'is required',dob:'is required', fname:'is required'});
  });
});
