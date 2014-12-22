# Learn Newell - A Web app for learning tutorial

This project is an application base on [AngularJS](http://angularjs.org/) + [Express - Nodejs platform](http://expressjs.com/)


## How to run

### Install Dependencies

```
npm install
```

Behind the scenes this will also call `bower install`.  You should find that you have two new
folders in your project.

* `node_modules` - contains the npm packages for the tools we need
* `app/bower_components` - contains the angular framework files

*Note that the `bower_components` folder would normally be installed in the root folder but

### Run the Application

This project use nodemon as monitor when deploying server, run server by:

```
nodemon server.js
```

Now browse to the app at `http://localhost:8080/index.html`.