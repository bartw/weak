# weak

## Introduction

This is a step by step guide for creating a simple web app using Webpack Eslint Angular and Karma.

## Setup

Start by creating a folder for your project and initalizing a git repo and npm package.

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

Now we will try and create a hello world app using angular

```shell
npm install angular --save
mkdir src
touch src/index.html
mkdir src/app
touch src/app/app.js
```

index.html
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

app.js
```js
angular.module('app', [])
```

We can test this super simple app by starting a webserver and browsing to http://localhost:8000/src/. 
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

As our app grows we will add more js files and use more libraries. Deploying will become a big messy pile of crap.
So let's introduce webpack to save us from all the crap.

```shell
npm install webpack --save-dev
touch webpack.config.js
```

We start by configuring webpack in webpack.config.js
```js
module.exports = {
    entry: './src/app/app.js',
    output: {
        filename: './src/bundle.js'
    }
};
``` 

Then tell webpack to use angular in our app.js

```js
require('angular');

angular.module('app', [])
```

Use our newly created bundle.js in our index.html

```html
<!--replace-->
<script type="text/javascript" src="../node_modules/angular/angular.js" charset="utf-8"></script>
<script type="text/javascript" src="app/app.js" charset="utf-8"></script>
<!--with-->
<script type="text/javascript" src="bundle.js" charset="utf-8"></script>
```

Don't forget to update your .gitignore so we don't check in our bundled file.
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

Then index.html
```html
<!--replace-->
<h1 ng-show="name">Hello {{ name }}</h1>
<!--with-->
<hello-world name="name"></hello-world>
```

We made our own html element! Run webpack, start a server and browse to http://localhost:8000/src/.
```shell
webpack
python -m SimpleHTTPServer
```

## Testing

How can we be sure that the logic in our component does what we think it does?
We write unit tests of course.

We will use karma and jasmine to run and write our tests.

```shell
npm install karma karma-cli karma-jasmine karma-phantomjs-launcher karma-webpack karma-sourcemap-loader angular-mocks --save-dev
touch karma.config.js
touch src/tests.js
touch src/app.spec.js
```

karma.config.js
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

tests.js

```js
require ('angular');
require ('angular-mocks');

var testsContext = require.context('.', true, /.spec$/);
testsContext.keys().forEach(testsContext);
```

app.spec.js

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

.eslintrc.json
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

karma.config.js
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