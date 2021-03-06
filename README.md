# Chilicorn Code Club

Chilicorn Code Club is a [Spice program](http://spiceprogram.org/) project aiming to introduce Finnish school kids to coding and to give schools & teachers tools for facilitating the learning. Exercises are currently developed by [Futurice](http://futurice.com/) employees.

Try out the application [here](http://codeclub.chilicorn.org/).

## Adding exercises

Write your exercise in Python and save it in one of the session folders in [examples](https://github.com/futurice/PythonInBrowser/blob/master/examples/). If you are creating a new session please add new folder for it.

After adding the file edit [examples.json](https://github.com/futurice/PythonInBrowser/blob/master/examples/examples.json) and add the details of your exercise.

That's it, next time you open the codeclub page you'll see your excercise in the list of exercises.

## Adding modules

If you want to add a module or hide some of your custom made code so that you can use it in the exercise and import it in the editor you can do that. You have to options for this.

### Python module

With Python modules you work much in the same way as with exercises. Write your module in Python and save it this time under [modules](https://github.com/futurice/PythonInBrowser/blob/master/public/modules/).

After adding the file edit [modules.json](https://github.com/futurice/PythonInBrowser/blob/master/examples/modules.json) IF you want to publish your module so that student can also see it. Otherwise no need to do this.

After this edit the run-function in [main.js](https://github.com/futurice/PythonInBrowser/blob/master/public/javascripts/main.js) to add your module to Skulpt.

Here is example on how to do it:

```
Sk.externalLibraries = {
        matter: {
          path: '/static/modules/matter/__init__.js',
          dependencies: ['/static/modules/matter/matter-0.8.0.min.js']
        },
        codeclub: {
          path: '/static/modules/codeclub.py'
        },
        coordinates: {
          path: '/static/modules/basic.py'
        },
        winter: {
          path: '/static/modules/winter.py'
        }
      };
```

### JS module

It's also possible to use JS-libraries as modules. How ever you need to write Python wrapper for it to use it. For example please see how `matter-0.8.0.min.js` and `__init__.js` are added.

## Adding learning material

If you want to add learning material please edit [material.json](https://github.com/futurice/PythonInBrowser/blob/master/examples/material.json).

## Technical details

* [Node.js](https://nodejs.org/) with [Express](http://expressjs.com/)
* [Handlebars](http://handlebarsjs.com/)
* [Skulpt](http://www.skulpt.org/)
* [CodeMirror](https://codemirror.net/)

## Start developing

* Clone this repo or take a fork
* In root of repo ```npm install```
* ```sudo npm install -g nodemon```
* Start the application with ```nodemon bin/www```
* Open a browser at http://localhost:3000/

## Deploying

The application is [hosted](http://codeclub.chilicorn.org/) on Heroku. Instructions for deploying a new version:

### Preparations

1. Ask an existing developer to make you a collaborator on the Heroku [codeclub app](https://dashboard.heroku.com/apps/codeclub)
2. Install the Heroku [CLI toolkit](https://devcenter.heroku.com/articles/heroku-command-line)
3. Login to your Heroku account: ```heroku login```
4. Add a new git remote: ```git remote add heroku https://git.heroku.com/codeclub.git```

note: if you are working in a fork, make sure you have pulled the changes from the main project master to local
```
git remote add futuorigin https://github.com/futurice/PythonInBrowser.git
git pull futuorigin master
```

### Deploy

1. ```git push heroku master```
2. Check that the [app](http://codeclub.chilicorn.org/) is running correctly

## License

The MIT License.

Parts of the code are covered by [PSF](https://docs.python.org/2/license.html). See the [license](https://github.com/futurice/PythonInBrowser/blob/master/LICENSE) file for more details.
