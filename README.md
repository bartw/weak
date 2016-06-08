https://travis-ci.org/bartw/weak.svg?branch=master

# weak

## Introduction

This is a step by step guide for creating a simple web app using Webpack, Eslint, Angular and Karma.

## Quickstart

If you just want to see the result, you can clone this repo and run the following scripts.
After this you can browse to http://localhost:8080/src/ to see the app running.

```shell
npm install
npm start
```

## Setup

Start by creating a folder for your project and initalizing a git repo, an npm package and some useful files.

```shell
mkdir weak
cd weak
git init
npm init
touch .gitignore
touch README.md
```

.gitignore
```
node_modules
```

Use the README.md file to take notes. You will thank yourself later.

Also try to commit your changes every once in a while.

```shell
git add .
git commit -m"my commit message"
```

## Hello from angular

Basic setup is done. We will now create a hello world app using angular.
We will use npm to install angular and create an index.html file and a app.js file.

```shell
npm install angular --save
mkdir src
touch src/index.html
mkdir src/app
touch src/app/app.js
```

Copy the following to index.html.
We include angular and our app script.
Angular is initialized using "ng-app".
The ng-model attribute tells angular that we want to connect the variable name with the text inside the input.
The ng-show attribute tells angular to only display the h1 element if the name has some content.
The value "{{ name }}" tells angular that we want the value of the variable name.

```html
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title>weak</title>
    <script type="text/javascript" src="../node_modules/angular/angular.js" charset="utf-8"></script>
    <script type="text/javascript" src="app/app.js" charset="utf-8"></script>
</head>

<body>
    <div ng-app="app">
        <label>Name:
            <input type="text" ng-model="name" />
        </label>
        <h1 ng-show="name">Hello {{ name }}</h1>
    </div>
</body>

</html>
```

Our app.js can be very simple for now. It just defines a module named app.

```js
angular.module('app', [])
```

We can test our hello world app by starting a webserver and browsing to http://localhost:8000/src/. 
You can fill in your name and should see "Hello your name".

```shell
python -m SimpleHTTPServer
```

## Gittermezzo

We now have a functioning app. Maybe it's time to make sure our code gets saved somewhere safe.
Create an empty repo on your github account and commit your changes to it.

```shell
git remote add origin https://github.com/bartw/weak.git
git push origin master
```

## Webpack

As our app grows we will add more js files and use more libraries. 
Maintaining the script tags in our index.html will become almost impossible.
So let's introduce webpack to save us from all the crap.

```shell
npm install webpack --save-dev
touch webpack.config.js
```

We start by configuring webpack in webpack.config.js.
We tell webpack where our entry file is and where we want our bundled output to be saved.

```js
module.exports = {
    entry: './src/app/app.js',
    output: {
        filename: './src/bundle.js'
    }
};
``` 

Webpack wants us to require our dependencies.
Our only dependency for now is angular.

```js
require('angular');

angular.module('app', [])
```

Webpack will bundle all our js files in one file "bundle.js".
This will make maintaining index.html a breeze.

```html
<!--replace-->
<script type="text/javascript" src="../node_modules/angular/angular.js" charset="utf-8"></script>
<script type="text/javascript" src="app/app.js" charset="utf-8"></script>
<!--with-->
<script type="text/javascript" src="bundle.js" charset="utf-8"></script>
```

Don't forget to update the .gitignore so we don't check in our bundled file.

```
bundle.js
```

Now we can test it out, run webpack, start a server and browse to http://localhost:8000/src/.

```shell
webpack
python -m SimpleHTTPServer
```

## Components

Angular 1.5 introduced components. With components you can create your own html elements.
Let's create our own component.

First update the app.js.
In template we write the html of our component.
Each binding is an attribute of our own component.
The controller contains the logic of our component.

```js
require('angular');

angular.module('app', [])
    .component('helloWorld', {
        template: '<div ng-show="$ctrl.name"><span>Hey what\'s up {{$ctrl.name}}?</span> <span>{{$ctrl.reverse()}}</div>',
        bindings: { name: '<' },
        controller: function() {
            var ctrl = this;
            
            ctrl.reverse = function() {
                return ctrl.name ? ctrl.name.split('').reverse().join('') : '';
            };
        }
    });
```

Then we use our component in index.html, every capital is replaced with a dash.

```html
<!--replace-->
<h1 ng-show="name">Hello {{ name }}</h1>
<!--with-->
<hello-world name="name"></hello-world>
```

We made our own html element! Run webpack, start a server and browse to http://localhost:8000/src/ to check it out.

```shell
webpack
python -m SimpleHTTPServer
```

## Testing

How can we be sure that the logic in our component does what we think it does?
We write unit tests of course.

We will use karma and jasmine to run and write our tests.

```shell
npm install jasmine-core phantomjs-prebuilt karma karma-cli karma-jasmine karma-phantomjs-launcher karma-webpack karma-sourcemap-loader angular-mocks --save-dev
touch karma.config.js
touch src/tests.js
touch src/app.spec.js
```

Karma needs some configuration, this is stored in karma.config.js.
We will write a file that serves as an entry file for our tests.
We configure karma to build this using webpack and add sourcemaps to it.

```js
module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        reporters: ['progress'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        singleRun: false,
        autoWatchBatchDelay: 300,
        files: ['./src/tests.js'],
        preprocessors: { './src/tests.js': ['webpack', 'sourcemap'] },
        webpack: {
            devtool: 'inline-source-map',
        },
        webpackMiddleware: { noInfo: true }
    });
};
```

Our test entry file is tests.js.
We require angular and angular-mocks to be able to use angular with unit testing.
Then we add all test files eg files that end in .spec.js.

```js
require ('angular');
require ('angular-mocks');

var testsContext = require.context('.', true, /.spec$/);
testsContext.keys().forEach(testsContext);
```

We create a test for our component in app.spec.js.

```js
require('./app.js');

describe('app', function() {
    beforeEach(angular.mock.module('app'));

    describe('with $compile', function() {
        var $compile, $rootScope, element, scope;

        beforeEach(angular.mock.inject(function(_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        }));
        
        beforeEach(function() {
            scope = $rootScope.$new();
            element = angular.element('<hello-world name="name"></hello-world>');
            element = $compile(element)(scope);
            scope.name = 'bart';
            scope.$apply();
        });

        describe('Controller: helloWorld', function() {
            var controller;
            beforeEach(function() {
                controller = element.controller('helloWorld');
            });

            it('should reverse', function() {
                controller.name = 'bart'
                expect(controller.reverse()).toBe('trab');
            });
        });
    });
});
```

Now we kan run our tests and watch for changes.

```shell
karma start karma.config.js
```

## Linting

We always write perfect clean javascript. But what if we make a typo or just forget to use a semicolon?
We need something to keep an eye on us.
Say hello to Eslint.

```shell
npm install eslint eslint-loader eslint-config-angular eslint-plugin-angular --save-dev
touch .eslintrc.json
```

You can configure eslint yourself or extend some default rules.
We will extend the recommended and angular rules in .eslintrc.json.

```json
{
    "env": {
        "browser": true,
        "commonjs": true,
        "jasmine": true
    },
    "extends": ["eslint:recommended", "angular"],
    "rules": {
        "strict": [
            2,
            "global"
        ],
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "angular/dumb-inject": 2
    }
}
```

In our karma.config.js we add a module for eslint.

```js
webpack: {
            devtool: 'inline-source-map',
            module: {                
                loaders: [{
                    test: /\.js$/,
                    loader: "eslint-loader",
                    exclude: /node_modules/
                }]
            }
        },
```

Now run our tests and linting again and start fixing errors.
Everytime you save a file the linting and testing will run again.

```shell
karma start karma.config.js
```

## Serve with webpack and consolidate

Let's get rid of python's SimpleHTTPServer and also serve using webpack.

```shell
npm install webpack-dev-server --save-dev
```

In package.json create some scripts.
The "build" script will simply run webpack and create a bundle.js file.
The "serve" script will start a webpack dev server so we can test our app in the browser.
The "test" script will lint our code and run the tests.
The "start" script will start the "test" and "serve" scripts in parrallel.
You can start a script using "npm run script" or "npm script" for default scripts.

```json
"scripts": {
    "build": "webpack",
    "serve": "webpack-dev-server --progress -d --colors",
    "test": "karma start karma.config.js",
    "start": "npm run test & npm run serve"
  }
```

We can now start our project with the following command. Then we can browse to http://localhost:8080/src/.

```shell
npm start
```

## Cleaner angular

As our project grows we will need more components, controllers, services and stuff.
We can't just cram all of them in one single app.js file.
So let's cleanup our js.

We will start by creating the files and folders that we will use to organise our js files.
We also install a raw loader that we will use to load html from an external file.

```shell
npm install raw-loader --save-dev
mkdir src/app/components
touch src/app/components/components.js
mkdir src/app/components/helloworld
touch src/app/components/helloworld/helloWorld.js
touch src/app/components/helloworld/helloWorld.component.js
touch src/app/components/helloworld/helloWorld.controller.js
touch src/app/components/helloworld/helloWorld.html
```

Now let's extract our component from app.js and cut it up into small files.

We will put our template in helloWorld.html.

```html
<div ng-show="$ctrl.name">
    <span>Hey what's up {{$ctrl.name}}?</span> <span>{{$ctrl.reverse()}}</span>
</div>
```

Our controller function belongs in helloWorld.controller.js

```js
'use strict';

module.exports = function HelloWorldController() {
    var helloWorldController = this;

    helloWorldController.reverse = function() {
        return helloWorldController.name ? helloWorldController.name.split('').reverse().join('') : '';
    };
};
```

In the helloWorld.component.js file we require the controller, the template and configure the rest of the component.

```js
'use strict';

var controller = require('./helloWorld.controller');

module.exports = {
    template: require('./helloWorld.html'),
    bindings: { name: '<' },
    controller: controller
};
```

We create a helloWorld module and add the helloWorldComponent to it in helloWorld.js

```js
'use strict';

require('angular');

var helloWorldComponent = require('./helloWorld.component');

module.exports = angular.module('helloWorld', [])
    .component('helloWorld', helloWorldComponent);
```

In components.js we require the helloworld module and add it to the app.components module.

```js
'use strict';

require('angular');

var HelloWorld = require('./helloworld/helloWorld');

angular.module('app.components', [
    HelloWorld.name
]);

module.exports = angular.module('app.components');
```

Now we can cleanup the app.js and require our components module.

```js
'use strict';

require('angular');

var Components = require('./components/components');

angular.module('app', [ Components.name ]);
```

We still have to add the raw loader to our webpack config in webpack.config.js 

```js
module.exports = {
    entry: './src/app/app.js',
    output: {
        filename: './src/bundle.js'
    },
    module: {
        loaders: [
            { test: /\.html$/, loader: 'raw' }
        ]
    }
};
```

and karma.config.js.

```js
webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    { test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/ },
                    { test: /\.html$/, loader: 'raw' }
                ]
            }
        },
```

There seems to be a little duplication going on there.
Maybe we can fix that later.

We can now start our project with the following command. Then we can browse to http://localhost:8080/src/.
Everything should work as before and our tests should still be green.

```shell
npm start
```

## Automating tests with Travis CI

We can automate our tests on github using Travis CI.

First we create a config file and specify that we have a nodejs project and what version we use.

```shell
touch .travis.yml
```

```yml
language: node_js
node_js:
  - "4.4.1"
```

We create a new karma configuration file  for the travis tests.

```shell
touch karma.travis.config.js
```

```js
```

Then we have to update our test script in package.json so that it tests only once.

```json
"scripts": {
    "build": "webpack",
    "serve": "webpack-dev-server --progress -d --colors",
    "test": "karma start karma.travis.config.js",
    "start": "npm run test & npm run serve"
  },
```

After we commit and push to github we can go to https://travis-ci.org/ and login with github.
Now we can enable travis for our repo. And it will start a build for our repo! 
