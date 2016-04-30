import BaseGulp from './baseGulp'
import Util from 'gulp-util'
import unique from 'array-unique'

const Default = {
  debug: false,
  watch: true  // register a watch task that aggregates all watches and runs the full sequence
}

const Aggregate = class extends BaseGulp {

  /**
   *
   * @param gulp - gulp instance
   * @param configs - customized overrides
   */
  constructor(gulp, taskName, recipes, ...configs) {
    super(gulp, Default, {task: {name: taskName}}, ...configs)

    if (Array.isArray(recipes)) {
      this.notifyError(`recipes must not be an array, but a function, series, or parallel, found: ${recipes}`)
    }

    // track recipes as taskFn so that aggregates can be included and resolved as part of other aggregates just like recipes
    this.taskFn = recipes

    // track recipes as `recipes` like series/parallel so metadata can be discovered
    //this.taskFn.recipes = recipes

    this.registerTask(this.taskName())

    if (this.config.watch) {
      this.registerWatchTask(this.watchTaskName())
    }
  }

  createHelpText() {
    //let taskNames = new Recipes().toTasks(this.taskFn)
    //
    //// use the config to generate the dynamic help
    //return `Runs [${taskNames.join(', ')}]`
    return ''
  }

  createWatchHelpText() {
    let taskNames = this.watchableRecipes().reduce((a, b) => {
      return a.concat(b.taskName())
    }, [])

    return Util.colors.grey(`|___ aggregates watches from [${taskNames.join(', ')}] and runs all tasks on any change`)
  }

  registerTask(taskName) {
    //let tasks = this.toTasks(this.taskFn)
    //this.debug(`Registering task: ${Util.colors.green(taskName)} for ${stringify(tasks)}`)
    this.gulp.task(taskName, this.taskFn)
    this.taskFn.description = this.createHelpText()
  }

  watchToGlobs(recipe) {
    // glob could be array
    let fullGlobs = []
    if(recipe.config.watch.glob === undefined){
      return fullGlobs
    }
    let globs = recipe.config.watch.glob
    if(!Array.isArray(recipe.config.watch.glob)){
      globs = [recipe.config.watch.glob]
    }

    for(let glob of globs) {
      fullGlobs.push(`${recipe.config.watch.options.cwd}/${glob}`)
    }
    return fullGlobs
  }

  registerWatchTask(watchTaskName) {
    let coloredTask = `${Util.colors.green(watchTaskName)}`
    // generate watch task
    if (this.watchableRecipes().length < 1) {
      this.debug(`No watchable recipes for task: ${coloredTask}`)
      return
    }

    this.debug(`Registering task: ${coloredTask}`)

    // on error ensure that we reset the flag so that it runs again
    this.gulp.on('error', () => {
      this.debug(`Yay! listened for the error and am able to reset the running flag!`)
      this.taskFn.running = false
    })

    // aggregate all globs into an array for a single watch fn call
    let globs = []
    for (let recipe of this.watchableRecipes()) {
      globs = globs.concat(this.watchToGlobs(recipe))
    }

    globs = unique(globs)
    this.debugDump('globs', globs)

    let watchFn = (done) => {
      this.log(`${coloredTask} watching ${globs.join(', ')}`)
      let watcher = this.gulp.watch(globs, {}, this.taskFn)
      watcher.on('error', (a, b) => {
        this.notifyError(`${coloredTask} ${error}`)
      })

      watcher.on('add', (path) => {
        if (!this.taskFn.running) {
          this.log(`${coloredTask} ${path} was added, running...`)
        }
      })

      watcher.on('change', (path) => {
        if (!this.taskFn.running) {
          this.log(`${coloredTask} ${path} was changed, running...`)
        }
      })
      watcher.on('unlink', (path) => {
        if (!this.taskFn.running) {
          this.log(`${coloredTask} ${path} was deleted, running...`)
        }
      })

      return watcher
    }

    watchFn.description = this.createWatchHelpText()
    return this.gulp.task(watchTaskName, watchFn)
  }

  flatten(list) {
    // parallel and series set `.recipes` on the function as metadata
    let callback = (prev, current) => {
      let item = current

      // Flatten any series/parallel
      if (typeof current === "function" && current.recipes) {
        this.debugDump(`flatten function recipes`, current.recipes)
        item = this.flatten(current.recipes)
      }
      // Flatten any Aggregate object - exposes a taskFn (which should be a series/parallel)
      else if (current.taskFn && current.taskFn.recipes) {
        this.debugDump(`flatten ${current.constructor.name} with taskFn.recipes`, current.taskFn.recipes)
        item = this.flatten(current.taskFn.recipes)
      }
      //else {
      //  if (current.taskFn) {
      //    this.debugDump(`flatten something WITH taskFn`, current)
      //
      //    if(current.taskFn.recipes){
      //      this.debugDump(`flatten something WITH taskFn.recipes`, current.taskFn.recipes)
      //    }
      //  }
      //  else if (current.recipes) {
      //    this.debugDump(`flatten something WITH recipes but not a fn`, current)
      //  }
      //  else if (current && current.constructor) {
      //    this.debugDump(`flatten ${current.constructor.name} with no recipes`, current)
      //  }
      //  else if (Array.isArray(current)) {
      //    this.debugDump(`flatten array with no recipes`, current)
      //  }
      //  else {
      //    this.debugDump(`flatten ???`, current)
      //  }
      //}
      return prev.concat(item)
    }

    return list.reduce(callback, [])
  }

  flattenedRecipes() {
    let recipes = this.flatten([this.taskFn])
    this.debugDump(`flattenedRecipes`, recipes)
    return recipes
  }

  watchableRecipes() {
    // create an array of watchable recipes
    let watchableRecipes = []
    for (let recipe of this.flattenedRecipes()) {
      if ((typeof recipe !== "string") && (typeof recipe !== "function") && recipe.config.watch) {
        watchableRecipes.push(recipe)
      }
    }
    return watchableRecipes
  }
}

export default Aggregate
