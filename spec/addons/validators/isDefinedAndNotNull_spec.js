var Dirtball = require('../../../.');
var isDefinedAndNotNullValidator = Dirtball.addons.validators.isDefinedAndNotNull;

describe('isDefinedAndNotNull', function() {

  var dirtball, execSpy;

  beforeEach(function() {
    execSpy = {
      onResolve:function() {},
      onReject:function() {}
    };
    dirtball = new Dirtball({
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
    var isDefinedAndNotNull = isDefinedAndNotNullValidator(['username', 'email', 'company.name', 'age', 'felonies'], {root:'_params'});
    dirtball
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds without root', function() {
    var isDefinedAndNotNull = isDefinedAndNotNullValidator(['_params.username', '_params.email', '_params.company.name', '_params.age', '_params.felonies']);
    dirtball
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds when the field is empty string', function() {
    var isDefinedAndNotNull = isDefinedAndNotNullValidator(['fname'], {root:'_params'});
    dirtball
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails when the field is null', function() {
    var isDefinedAndNotNull = isDefinedAndNotNullValidator(['ssn'], {root:'_params'});
    dirtball
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData()._errors).toEqual({ssn:'is undefined or null'});
  });

  it('fails when the field is undefined', function() {
    var isDefinedAndNotNull = isDefinedAndNotNullValidator(['dob'], {root:'_params'});
    dirtball
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData()._errors).toEqual({dob:'is undefined or null'});
  });

  it('fails when the field is undefined and not present', function() {
    var isDefinedAndNotNull = isDefinedAndNotNullValidator(['random'], {root:'_params'});
    dirtball
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData()._errors).toEqual({random:'is undefined or null'});
  });

  it('fails when the field is undefined and not present and nested', function() {
    var isDefinedAndNotNull = isDefinedAndNotNullValidator(['random.data'], {root:'_params'});
    dirtball
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData()._errors).toEqual({random:{data:'is undefined or null'}});
  });

  it('puts the errors in a custom place', function() {
    var isDefinedAndNotNull = isDefinedAndNotNullValidator(['ssn'], {root:'_params', errorPath: 'errMap'});
    dirtball
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData().errMap).toEqual({ssn:'is undefined or null'});
  });

  it('generates errors for multiple fields', function() {
    var isDefinedAndNotNull = isDefinedAndNotNullValidator(['username', 'ssn', 'email', 'dob', 'fname'], {root:'_params'});
    dirtball
    .pipe(isDefinedAndNotNull)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData()._errors).toEqual({ssn:'is undefined or null',dob:'is undefined or null'});
  });
});
