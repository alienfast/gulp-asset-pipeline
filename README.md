# gulp-pipeline
Meta gulp plugin recipes modularized as ES2015 classes. Fully configurable. Fully extensible. Full pipeline in a few lines of code.

ES2015, reusable, modular, extensible gulp recipes.  This **is not** just for rails, it's agnostic and works for anything (node, angular, etc).

## Usage
Here's a `gulpfile.babel.js` that provides tasks to build and watch an ES2015/SCSS project.  Simple enough?
 
```javascript
// Assuming project named: acme

import { ScssLint, Sass, RollupEs, RollupIife, TaskSequence } from 'gulp-pipeline'
import gulp from 'gulp'

// Utilize one of the common configs
let platform = Platform.nodeSrc() // other pre-configured platforms: nodeLib, rails - see platform.js and submit PRs with other common configs

// instantiate ordered array of recipes (for each instantiation the tasks will be created e.g. sass and sass:watch)
let recipes = [
  new ScssLint(gulp),
  new Sass(gulp),
  new RollupEs(gulp, platform, {options: {dest: 'dist/acme.es.js'}}),                        // es
  new RollupCjs(gulp, platform, {options: {dest: 'dist/acme.cjs.js'}}),                      // commonjs
  new RollupIife(gulp, platform, {options: {dest: 'dist/acme.iife.js', moduleName: 'acme'}}) // iife self executing bundle for the browser
]


// Simple helper to create the default and watch tasks as a sequence of the recipes already defined
new TaskSequence(gulp, 'default', recipes)
new TaskSequence(gulp, 'watch', recipes, {watch: true})
```

Run it with `gulp`.

## Recipes
- Autoprefixer
- EsLint
- Rollup (variations include amd, cjs, es, iife, umd)
- Sass
- ScssLint

## Why?

### Too many different tools
The javascript community is iterating on asset tooling faster than others, indeed they own many of the tools.  In moving back and forth between node based projects and rails, we found at a minimum we were working with different configurations, and at most we were dealing with completely different or out of date tools.

Why don't we just use the same tools for the asset pipeline?  Now we can.  

### Reuse, modularity, extensibility
We are certainly not the first to consider this.  What we did see is that noone was actually reusing shared code in a way that benefits many.  We have seen people share code in a repository, but only in a way that could be cloned or copied.  We want actual reuse, in that we never want to copy code again. When we transpile ES6, we want check it with EsLint.  When we transpile SCSS, we want to check it with ScssLint...and we never want to copy that code again.  That error handling gotcha?  Don't create a gist, update and share the recipe.

## Who is this for?
**Any project** that wants gulp recipes in a reusable/extensible/modular way (node, rails, angular, etc, etc).  While we certainly want to provide recipes that can be reused and replace the conveniences of a full rails pipeline, these recipes are modular enough that any project (node, angular, etc) can utilize them.

## Error handling
Error handling is baked into the recipes and the `Base.notifyError()` sends messages to you through [`gulp-notify`](https://github.com/mikaelbr/gulp-notify) with some nice console colors, a beep, and an OS notification (if possible).

## How it works

### Recipes
Each recipe is an ES2015 class having configurable options that registers a task as well as a watch task if applicable.  These are simply common gulp build configurations.

### Common config
Each recipe depends on a common configuration for the `source` and `watch` that can be fed directly to `gulp.src`, this is the `node-glob` format with options.  Even when interfacing with other libraries that don't use `gulp.src` directly (such as rollup), these recipes use a common config for ease of use and to enable generic platform definitions.

### Platform definitions
Common platform definitions are maintained in [platform.js](src/platform.js).  These are simply common configurations for different structures found in common stacks such as node, rails, etc.  Recipes will fallback on these for configurations such as the `node-glob` `cwd`.  One example would be the `cwd` for all javascript.

### Merged configurations
Each recipe's ultimate configuration is merged with your overrides - this provides a great deal of flexibility since any configuration you provide will override the defaults.  This is all provided via the [`node-extend`](https://github.com/justmoon/node-extend#usage) library.  Familiarity with how this works should allow you to specify just about anything.

## Debugging
Initialize any recipe with `{debug: true}` and additional information can be found in the log.
                                                                                     
## I want it to work different...what can I do?

There are many things you can do here (not an exhaustive list):

1. Configure the options which are passed into the recipe that is instantiated.

1. Extend the class and customize it to your liking

1. Extend the `BaseRecipe` class to create your own recipe

1. Create your own gulp task and simpy `#run` the recipe without registering tasks:
  ```javascript
  gulp.task('foo', () => {
    // do stuff
  
    // run the recipe
    new Sass(gulp, {task: false, watch: false}).run()
    
    // do other stuff
  })
  ```
1. Submit a PR to change the existing recipe to a better one!


## You don't have a recipe that does ______
Submit a PR and we'll include it!
