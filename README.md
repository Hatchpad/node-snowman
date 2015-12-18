# node-snowman

An easier (in my opinion) way to handle asynchronous functionality. Use in place of callbacks or promises.

The basic idea is that a data payload will be maintained by the "Snowman". Each "snowball" can accumulate data.

## Installation

`npm install @hatchpad/node-snowman --save`

## Usage

### Include

`var Snowman = require('@hatchpad/node-snowman')`

### Examples
#### Success
```
  var buildNameAsync = function() {
    setTimeout(function() {
      this.getData().firstName = 'John';
      this.getData().lastName = 'Doe';
      this.resolve();
    }.bind(this));
  };
  var logName = function() {
    var greeting = this.getData().greeting;
    var firstName = this.getData().firstName;
    var lastName = this.getData().lastName;
    console.log(greeting + ', ' + firstName + ' ' + lastName);
    this.resolve();
  };
  new Snowman({greeting: 'Hello'})
  .$(buildNameAsync)  // one line steps
  .$(logName)
  .exec(
    function() {
      // success
    },
    function() {
      // failure
    }
  );
```
#### Failure
```
  var failFunc = function() {
    setTimeout(function() {
      this.reject();
    }.bind(this));
  };
  var logName = function() {
    console.log('will not get here');
    this.resolve();
  };
  new Snowman({greeting: 'Hello'})
  .$(failFunc)  // fails here
  .$(logName)
  .exec(
    function() {
      // success
    },
    function() {
      console.log('it failed');
    }
  );
```
