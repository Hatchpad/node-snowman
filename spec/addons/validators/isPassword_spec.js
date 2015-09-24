var Snowman = require('../../../.');
var isPasswordValidator = require('../../../src/addons/validators/isPassword');

describe('isPassword', function() {

  var snowman, execSpy;

  beforeEach(function() {
    execSpy = {
      onResolve:function() {},
      onReject:function() {}
    };
    snowman = new Snowman({
      _params:{
        pw1: null,
        pw2: undefined,
        pw3: 'abc',
        pw4: 'abcd',
        pw5: 'abcde',
        pw6: 'AbCd',
        pw7: 'AbOpRRYYaa39389%#%@%^fsdf@#$%sfjffj1079656',
        pw8: 'as39gjij98AA$%',
        pw9: 'boot',
        pw10: 'BooDaddy'
      }
    });
    spyOn(execSpy, 'onResolve');
    spyOn(execSpy, 'onReject');
  });

  it('succeeds', function() {
    var isPassword = isPasswordValidator(['pw6', 'pw7', 'pw8'], {root:'_params'});
    snowman
    .pipe(isPassword)
    .exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(execSpy.onReject).not.toHaveBeenCalled();
  });

  it('is simple word', function() {
    var isPassword = isPasswordValidator('pw6', {root:'_params'});
    snowman.$(isPassword).exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(snowman.getData()._meta.pw6.valid).toBe(true);
    expect(snowman.getData()._meta.pw6.strength).toBe('simple');
  });

  it('is medium word', function() {
    var isPassword = isPasswordValidator('pw10', {root:'_params'});
    snowman.$(isPassword).exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(snowman.getData()._meta.pw10.valid).toBe(true);
    expect(snowman.getData()._meta.pw10.strength).toBe('medium');
  });

  it('is strong word', function() {
    var isPassword = isPasswordValidator('pw8', {root:'_params'});
    snowman.$(isPassword).exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
    expect(snowman.getData()._meta.pw8.valid).toBe(true);
    expect(snowman.getData()._meta.pw8.strength).toBe('strong');
  });

  it('is invalid', function() {
    var isPassword = isPasswordValidator('pw3', {root:'_params'});
    snowman.$(isPassword).exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._meta.pw3.valid).toBe(false);
    expect(snowman.getData()._meta.pw3.strength).toBe('simple');
    expect(snowman.getData()._errors.pw3).toBe('is too short');
  });

  it('ignores undefined', function() {
    var isPassword = isPasswordValidator('pw2', {root:'_params'});
    snowman.$(isPassword).exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onResolve).toHaveBeenCalled();
  });

  it('is invalid', function() {
    var isPassword = isPasswordValidator('pw4', {root:'_params'});
    snowman.$(isPassword).exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._meta.pw4.valid).toBe(false);
    expect(snowman.getData()._meta.pw4.strength).toBe('simple');
    expect(snowman.getData()._errors.pw4).toBe('is too simple');
  });

  it('is invalid by setting min manually', function() {
    var isPassword = isPasswordValidator('pw5', {root:'_params', min: 6});
    snowman.$(isPassword).exec(execSpy.onResolve, execSpy.onReject);
    expect(execSpy.onReject).toHaveBeenCalled();
    expect(snowman.getData()._meta.pw5.valid).toBe(false);
    expect(snowman.getData()._meta.pw5.strength).toBe('simple');
    expect(snowman.getData()._errors.pw5).toBe('is too short');
  });
});
