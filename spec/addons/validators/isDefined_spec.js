var Dirtball = require('../../../.');
var isDefinedValidator = Dirtball.addons.validators.isDefined;

describe('isDefined', function() {

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
    var isDefined = isDefinedValidator(['username', 'email', 'company.name', 'age', 'felonies'], {root:'_params'});
    dirtball
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds without root', function() {
    var isDefined = isDefinedValidator(['_params.username', '_params.email', '_params.company.name', '_params.age', '_params.felonies']);
    dirtball
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds when the field is empty string', function() {
    var isDefined = isDefinedValidator(['fname'], {root:'_params'});
    dirtball
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('succeeds when the field is null', function() {
    var isDefined = isDefinedValidator(['ssn'], {root:'_params'});
    dirtball
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('fails when the field is undefined', function() {
    var isDefined = isDefinedValidator(['dob'], {root:'_params'});
    dirtball
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData()._errors).toEqual({dob:'is undefined'});
  });

  it('fails when the field is undefined and not present', function() {
    var isDefined = isDefinedValidator(['random'], {root:'_params'});
    dirtball
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData()._errors).toEqual({random:'is undefined'});
  });

  it('fails when the field is undefined and not present and nested', function() {
    var isDefined = isDefinedValidator(['random.data'], {root:'_params'});
    dirtball
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData()._errors).toEqual({random:{data:'is undefined'}});
  });

  it('puts the errors in a custom place', function() {
    var isDefined = isDefinedValidator(['dob'], {root:'_params', errorPath: 'errMap'});
    dirtball
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData().errMap).toEqual({dob:'is undefined'});
  });

  it('generates errors for multiple fields', function() {
    var isDefined = isDefinedValidator(['username', 'ssn', 'email', 'dob', 'fname', 'not_present'], {root:'_params'});
    dirtball
    .pipe(isDefined)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).not.toHaveBeenCalled();
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(dirtball.getData()._errors).toEqual({dob:'is undefined', not_present:'is undefined'});
  });
});
