# node-snowman

An easier (in my opinion) way to handle asynchronous functionality. Use in place of callbacks or promises.

The basic idea is that a data payload will be maintained by the "Snowman". Each "snowball" can accumulate data.

This allows you to create a step by step (one line per step) execution block.

## Installation

`npm install node-snowman --save`

## Usage

### Include

`const Snowman = require('node-snowman');`

### Examples
#### Success
```
  const buildNameAsync = function() {
    setTimeout(function() {
      this.getData().firstName = 'John';
      this.getData().lastName = 'Doe';
      this.resolve();
    }.bind(this));
  };
  const logName = function() {
    var greeting = this.getData().greeting;
    var firstName = this.getData().firstName;
    var lastName = this.getData().lastName;
    console.log(greeting + ', ' + firstName + ' ' + lastName);
    this.resolve();
  };
  new Snowman({greeting: 'Hello'})
  .$(buildNameAsync)  // one line steps I call "snowballs"
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
  const failFunc = function() {
    setTimeout(function() {
      this.reject();
    }.bind(this));
  };
  const logName = function() {
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
#### Failure when abortOnReject === false
```
  const buildNameAsync = function() {
    setTimeout(function() {
      this.getData().firstName = 'John';
      this.getData().lastName = 'Doe';
      this.resolve();
    }.bind(this));
  };
  const failFunc = function() {
    setTimeout(function() {
      this.reject();
    }.bind(this));
  };
  const logName = function() {
    var greeting = this.getData().greeting;
    var firstName = this.getData().firstName;
    var lastName = this.getData().lastName;
    console.log(greeting + ', ' + firstName + ' ' + lastName);
    this.resolve();
  };
  new Snowman({greeting: 'Hello'})
  .$(buildNameAsync)
  .$(failFunc, {abortOnReject:false})  // fails but still moves on
  .$(logName)
  .exec(
    function() {
      // success (will not get here)
    },
    function() {
      console.log('it failed');
    }
  );
```
#### Array of snowballs
```
  const buildFirstName = function() {
    setTimeout(function() {
      this.getData().firstName = 'John';
      this.resolve();
    }.bind(this));
  };
  const buildLastName = function() {
    setTimeout(function() {
      this.getData().lastName = 'Doe';
      this.resolve();
    }.bind(this));
  };
  const logName = function() {
    var greeting = this.getData().greeting;
    var firstName = this.getData().firstName;
    var lastName = this.getData().lastName;
    console.log(greeting + ', ' + firstName + ' ' + lastName);
    this.resolve();
  };
  new Snowman({greeting: 'Hello'})
  .$([buildFirstName, buildLastName])  // execute asynchronously
  .$(logName)
  .exec();
```
#### Using "if" option to skip a snowball
```
  const buildFirstName = function() {
    setTimeout(function() {
      this.getData().firstName = 'John';
      this.resolve();
    }.bind(this));
  };
  const buildLastName = function() {
    setTimeout(function() {
      this.getData().lastName = 'Doe';
      this.resolve();
    }.bind(this));
  };
  const logName = function() {
    var greeting = this.getData().greeting;
    var firstName = this.getData().firstName;
    var lastName = this.getData().lastName;
    // will log "Hello, John Smith"
    console.log(greeting + ', ' + firstName + ' ' + lastName);
    this.resolve();
  };
  new Snowman({greeting: 'Hello', firstName:'Bob', lastName:'Smith'})
  .$(buildFirstName)
  .$(buildLastName, {if:'{{firstName}} === "John"'})
  .$(logName)
  .exec();
```
#### Using "skip" option to skip a snowball
```
  const skipFunc = function() {
    return this.getData().firstName === 'John';
  };
  const buildFirstName = function() {
    setTimeout(function() {
      this.getData().firstName = 'John';
      this.resolve();
    }.bind(this));
  };
  const buildLastName = function() {
    setTimeout(function() {
      this.getData().lastName = 'Doe';
      this.resolve();
    }.bind(this));
  };
  const logName = function() {
    var greeting = this.getData().greeting;
    var firstName = this.getData().firstName;
    var lastName = this.getData().lastName;
    // will log "Hello, John Smith"
    console.log(greeting + ', ' + firstName + ' ' + lastName);
    this.resolve();
  };
  new Snowman({greeting: 'Hello', firstName:'Bob', lastName:'Smith'})
  .$(buildFirstName)
  .$(buildLastName, {skip:skipFunc})
  .$(logName)
  .exec();
```
#### Using "do" in order to execute a normal function
```
  const normalFunction = function() {
    console.log('this function does not resolve or reject');
  };
  const buildFirstName = function() {
    setTimeout(function() {
      this.getData().firstName = 'John';
      this.resolve();
    }.bind(this));
  };
  const buildLastName = function() {
    setTimeout(function() {
      this.getData().lastName = 'Doe';
      this.resolve();
    }.bind(this));
  };
  const logName = function() {
    var greeting = this.getData().greeting;
    var firstName = this.getData().firstName;
    var lastName = this.getData().lastName;
    // will log "Hello, John Smith"
    console.log(greeting + ', ' + firstName + ' ' + lastName);
    this.resolve();
  };
  new Snowman({greeting: 'Hello', firstName:'Bob', lastName:'Smith'})
  .$(buildFirstName)
  .$(buildLastName)
  .do(normalFunction)
  .$(logName)
  .exec();
```
### Snowball options
| param         | Type          | Default | Description
| ------------- |:-------------:| :------:| ------------
| abortOnReject | Boolean       | true    | Whether to abort execution on failure
| if            | String        | null    | JS to be executed that should return a Boolean
| skip          | function      | null    | Function that returns a Boolean
