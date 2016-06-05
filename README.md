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