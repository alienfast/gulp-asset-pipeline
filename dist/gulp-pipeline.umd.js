(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('extend'), require('path'), require('cross-spawn'), require('fs'), require('jsonfile'), require('gulp-util'), require('gulp-autoprefixer'), require('gulp-if'), require('gulp-debug'), require('gulp-eslint'), require('browser-sync'), require('gulp-changed'), require('gulp-imagemin'), require('merge-stream'), require('gulp-sass'), require('gulp-sourcemaps'), require('findup-sync'), require('gulp-scss-lint'), require('gulp-scss-lint-stylish'), require('stringify-object'), require('rollup'), require('glob'), require('rollup-plugin-babel'), require('gulp-notify'), require('gulp-help'), require('console'), require('del')) :
  typeof define === 'function' && define.amd ? define(['exports', 'extend', 'path', 'cross-spawn', 'fs', 'jsonfile', 'gulp-util', 'gulp-autoprefixer', 'gulp-if', 'gulp-debug', 'gulp-eslint', 'browser-sync', 'gulp-changed', 'gulp-imagemin', 'merge-stream', 'gulp-sass', 'gulp-sourcemaps', 'findup-sync', 'gulp-scss-lint', 'gulp-scss-lint-stylish', 'stringify-object', 'rollup', 'glob', 'rollup-plugin-babel', 'gulp-notify', 'gulp-help', 'console', 'del'], factory) :
  (factory((global.gulpPipeline = {}),global.extend,global.path,global.spawn,global.fs,global.jsonfile,global.Util,global.autoprefixer,global.gulpif,global.debug,global.eslint,global.BrowserSync,global.changed,global.imagemin,global.merge,global.sass,global.sourcemaps,global.findup,global.scssLint,global.scssLintStylish,global.stringify,global.rollup,global.glob,global.babel,global.notify,global.gulpHelp,global.console,global.del));
}(this, function (exports,extend,path,spawn,fs,jsonfile,Util,autoprefixer,gulpif,debug,eslint,BrowserSync,changed,imagemin,merge,sass,sourcemaps,findup,scssLint,scssLintStylish,stringify,rollup,glob,babel,notify,gulpHelp,console,del) { 'use strict';

  extend = 'default' in extend ? extend['default'] : extend;
  path = 'default' in path ? path['default'] : path;
  spawn = 'default' in spawn ? spawn['default'] : spawn;
  fs = 'default' in fs ? fs['default'] : fs;
  jsonfile = 'default' in jsonfile ? jsonfile['default'] : jsonfile;
  Util = 'default' in Util ? Util['default'] : Util;
  autoprefixer = 'default' in autoprefixer ? autoprefixer['default'] : autoprefixer;
  gulpif = 'default' in gulpif ? gulpif['default'] : gulpif;
  debug = 'default' in debug ? debug['default'] : debug;
  eslint = 'default' in eslint ? eslint['default'] : eslint;
  BrowserSync = 'default' in BrowserSync ? BrowserSync['default'] : BrowserSync;
  changed = 'default' in changed ? changed['default'] : changed;
  imagemin = 'default' in imagemin ? imagemin['default'] : imagemin;
  merge = 'default' in merge ? merge['default'] : merge;
  sass = 'default' in sass ? sass['default'] : sass;
  sourcemaps = 'default' in sourcemaps ? sourcemaps['default'] : sourcemaps;
  findup = 'default' in findup ? findup['default'] : findup;
  scssLint = 'default' in scssLint ? scssLint['default'] : scssLint;
  scssLintStylish = 'default' in scssLintStylish ? scssLintStylish['default'] : scssLintStylish;
  stringify = 'default' in stringify ? stringify['default'] : stringify;
  glob = 'default' in glob ? glob['default'] : glob;
  babel = 'default' in babel ? babel['default'] : babel;
  notify = 'default' in notify ? notify['default'] : notify;
  gulpHelp = 'default' in gulpHelp ? gulpHelp['default'] : gulpHelp;
  console = 'default' in console ? console['default'] : console;
  del = 'default' in del ? del['default'] : del;

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  babelHelpers.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  babelHelpers.toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  };

  babelHelpers;

  var BaseDirectoriesCache = '.gulp-pipeline-rails.json';
  var GemfileLock = 'Gemfile.lock';

  var Rails = function () {
    function Rails() {
      babelHelpers.classCallCheck(this, Rails);
    }

    babelHelpers.createClass(Rails, null, [{
      key: 'enumerateEngines',
      value: function enumerateEngines() {
        var results = spawn.sync(this.filePath('railsRunner.sh'), [this.filePath('enumerateEngines.rb')], { sdtio: 'inherit' });
        return JSON.parse(results.output[1]);
      }
    }, {
      key: 'filePath',
      value: function filePath(name) {
        return path.join(__dirname, 'rails/' + name); // eslint-disable-line no-undef
      }

      /**
       * Return the baseDirectories to search for assets such as images.  In rails, this means
       *  enumerating rails engines and collecting their root paths.  This is a lengthy process
       *  because you have to startup a rails environment to enumerate the engines, so we cache
       *  the baseDirectories in a file and compare it to the Gemfile.lock's modified time.  If
       *  the Gemfile.lock changes, we throw out the cache, enumerate the engines again and write
       *  a new cache file.
       *
       * @returns {{baseDirectories: string[]}}
       */

    }, {
      key: 'baseDirectories',
      value: function baseDirectories() {
        if (!this.changed(GemfileLock, BaseDirectoriesCache)) {
          return jsonfile.readFileSync(BaseDirectoriesCache);
        } else {
          Util.log('Generating baseDirectories cache...');
          try {
            fs.unlinkSync(BaseDirectoriesCache);
          } catch (error) {
            //ignore
          }

          var engines = Rails.enumerateEngines();
          //console.log(stringify(engines))

          var baseDirectories = ['./'];
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = Object.keys(engines)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var key = _step.value;

              baseDirectories.push(engines[key]);
            }
            //console.log(stringify(baseDirectories))
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          var result = { baseDirectories: baseDirectories };
          jsonfile.writeFileSync(BaseDirectoriesCache, result, { spaces: 2 });
          return result;
        }
      }
    }, {
      key: 'changed',
      value: function changed(sourceFileName, targetFileName) {
        var sourceStat = null;
        var targetStat = null;
        try {
          sourceStat = fs.statSync(sourceFileName);
          targetStat = fs.statSync(targetFileName);
        } catch (error) {
          return true;
        }

        if (sourceStat.mtime > targetStat.mtime) {
          return true;
        } else {
          return false;
        }
      }
    }]);
    return Rails;
  }();

  // NOTE: `source` and `watch` are node-glob options hashes. e.g. gulp.src(source.glob, source.options)
  var PresetRails = {
    baseDirectories: ['./'],
    javascripts: {
      source: {
        glob: 'application.js',
        options: { cwd: 'app/assets/javascripts' }
      },
      watch: { options: { cwd: 'app/assets/javascripts' } },
      dest: 'public/javascripts'
    },
    stylesheets: {
      source: { options: { cwd: 'app/assets/stylesheets' } },
      watch: { options: { cwd: 'app/assets/stylesheets' } },
      dest: 'public/stylesheets'
    },
    images: {
      source: { options: { cwd: 'app/assets/images' } },
      watch: { options: { cwd: 'app/assets/images' } },
      dest: 'public/images'
    }
  };
  var PresetNodeLib = {
    baseDirectories: ['./'],
    javascripts: {
      source: {
        glob: 'index.js',
        options: { cwd: 'lib' }
      },
      watch: { options: { cwd: 'lib' } },
      dest: 'dist'
    },
    stylesheets: {
      source: { options: { cwd: 'lib' } },
      watch: { options: { cwd: 'lib' } },
      dest: 'dist'
    },
    images: {
      source: { options: { cwd: 'lib' } },
      watch: { options: { cwd: 'lib' } },
      dest: 'dist'
    }
  };

  var PresetNodeSrc = {
    baseDirectories: ['./'],
    javascripts: {
      source: {
        glob: 'index.js',
        options: { cwd: 'src' }
      },
      watch: { options: { cwd: 'src' } },
      dest: 'dist'
    },
    stylesheets: {
      source: { options: { cwd: 'src' } },
      watch: { options: { cwd: 'src' } },
      dest: 'dist'
    },
    images: {
      source: { options: { cwd: 'lib' } },
      watch: { options: { cwd: 'lib' } },
      dest: 'dist'
    }
  };

  var Preset = function () {
    function Preset() {
      babelHelpers.classCallCheck(this, Preset);
    }

    babelHelpers.createClass(Preset, null, [{
      key: 'nodeLib',
      value: function nodeLib() {
        var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        return extend(true, {}, PresetNodeLib, overrides);
      }
    }, {
      key: 'nodeSrc',
      value: function nodeSrc() {
        var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        return extend(true, {}, PresetNodeSrc, overrides);
      }
    }, {
      key: 'rails',
      value: function rails() {
        var overrides = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];


        return extend(true, {}, PresetRails, Rails.baseDirectories(), overrides);
      }
    }]);
    return Preset;
  }();

  var Default$15 = {
    watch: true,
    debug: false
  };

  var Base = function () {

    /**
     *
     * @param gulp - gulp instance
     * @param config - customized overrides
     */

    function Base(gulp, config) {
      babelHelpers.classCallCheck(this, Base);

      this.gulp = gulpHelp(gulp, { afterPrintCallback: function afterPrintCallback() {
          return console.log('For configuration help see https://github.com/alienfast/gulp-pipeline \n');
        } }); // eslint-disable-line no-console
      this.config = extend(true, {}, Default$15, config);
      this.debug('[' + this.constructor.name + '] using resolved config: ' + stringify(this.config));
    }

    // ----------------------------------------------
    // protected


    babelHelpers.createClass(Base, [{
      key: 'log',
      value: function log(msg) {
        Util.log(msg);
      }
    }, {
      key: 'debug',
      value: function debug(msg) {
        if (this.config.debug) {
          this.log('[' + Util.colors.cyan('debug') + '] ' + msg);
        }
      }
    }, {
      key: 'debugDump',
      value: function debugDump(msg, obj) {
        this.debug(msg + ':\n' + stringify(obj));
      }
    }, {
      key: 'notifyError',
      value: function notifyError(error) {
        var watching = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

        var lineNumber = error.lineNumber ? 'Line ' + error.lineNumber + ' -- ' : '';
        var taskName = error.task || this.taskName();

        notify({
          title: 'Task [' + taskName + '] Failed in [' + error.plugin + ']',
          message: lineNumber + 'See console.',
          sound: 'Sosumi' // See: https://github.com/mikaelbr/node-notifier#all-notification-options-with-their-defaults
        }).write(error);

        var tag = Util.colors.black.bgRed;
        var report = '\n\n' + tag('    Task:') + ' [' + Util.colors.cyan(taskName) + ']\n' + tag('  Plugin:') + ' [' + error.plugin + ']\n' + tag('   Error:') + '\n' + error.message;

        if (error.lineNumber) {
          report += tag('    Line:') + ' ' + error.lineNumber + '\n';
        }
        if (error.fileName) {
          report += tag('    File:') + ' ' + error.fileName + '\n';
        }
        this.log(report);

        // Prevent the 'watch' task from stopping
        if (!watching) {
          this.gulp.emit('end');
        }
      }
    }, {
      key: 'debugOptions',
      value: function debugOptions() {
        return { title: '[' + Util.colors.cyan('debug') + '][' + Util.colors.cyan(this.taskName()) + ']' };
      }
    }]);
    return Base;
  }();

  var Default$14 = {
    watch: true,
    debug: false,
    task: {
      help: ''
    }
  };

  var BaseRecipe = function (_Base) {
    babelHelpers.inherits(BaseRecipe, _Base);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function BaseRecipe(gulp, preset, config) {
      babelHelpers.classCallCheck(this, BaseRecipe);


      if (!preset) {
        throw new Error('Preset must be specified.  Please use one from the preset.js or specify a custom preset configuration.');
      }

      if (!config || !config.presetType) {
        throw new Error('\'presetType\' must be specified in the config (usually the Default config).  See preset.js for a list of types such as javascripts, stylesheets, etc.');
      }

      var presetTypeConfig = null;
      if (config.presetType !== 'macro') {
        presetTypeConfig = preset[config.presetType];
        if (!presetTypeConfig) {
          throw new Error('Unable to resolve configuration for presetType: ' + config.presetType + ' from preset: ' + stringify(preset));
        }
      } else {
        presetTypeConfig = {};
      }

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(BaseRecipe).call(this, gulp, extend(true, {}, Default$14, { baseDirectories: preset.baseDirectories }, presetTypeConfig, config)));

      if (_this.createHelpText !== undefined) {
        _this.config.task.help = _this.createHelpText();
      }
      _this.registerTask();
      _this.registerWatchTask();
      return _this;
    }

    //createHelpText(){
    //  // empty implementation that can dynamically create help text instead of the static config.task.help
    //}

    babelHelpers.createClass(BaseRecipe, [{
      key: 'registerWatchTask',
      value: function registerWatchTask() {
        var _this2 = this;

        if (this.config.watch) {
          (function () {
            // generate watch task e.g. sass:watch
            var name = _this2.watchTaskName();
            _this2.debug('Registering task: ' + Util.colors.green(name));
            _this2.gulp.task(name, _this2.createWatchHelpText(), function () {
              _this2.log('[' + Util.colors.green(name) + '] watching ' + _this2.config.watch.glob + ' ' + stringify(_this2.config.watch.options) + '...');

              return _this2.gulp.watch(_this2.config.watch.glob, _this2.config.watch.options, function (event) {
                _this2.log('File ' + event.path + ' was ' + event.type + ', running ' + _this2.taskName() + '...');
                return Promise.resolve(_this2.run(true)).then(function () {
                  return _this2.logFinish();
                });
              });
            });
          })();
        }
      }
    }, {
      key: 'createWatchHelpText',
      value: function createWatchHelpText() {
        return Util.colors.grey('|___ watches ' + this.config.watch.options.cwd + '/' + this.config.watch.glob);
      }
    }, {
      key: 'registerTask',
      value: function registerTask() {
        var _this3 = this;

        if (this.config.task) {
          // generate primary task e.g. sass
          var name = this.taskName();
          this.debug('Registering task: ' + Util.colors.green(name));
          this.gulp.task(name, this.config.task.help, function () {
            //this.log(`Running task: ${Util.colors.green(name)}`)
            return _this3.run();
          });
        }
      }
    }, {
      key: 'taskName',
      value: function taskName() {
        return this.config.task.name || this.constructor.name; // guarantee something is present for error messages
      }
    }, {
      key: 'watchTaskName',
      value: function watchTaskName() {
        if (this.config.watch && this.config.watch.name) {
          return this.config.watch.name;
        } else {
          return this.taskName() + ':watch';
        }
      }
    }, {
      key: 'logFinish',
      value: function logFinish() {
        var message = arguments.length <= 0 || arguments[0] === undefined ? 'finished.' : arguments[0];

        this.log('[' + Util.colors.green(this.taskName()) + '] ' + message);
      }
    }]);
    return BaseRecipe;
  }(Base);

  var AutoprefixerDefault = {
    options: { // from bootstrap
      browsers: [
      //
      // Official browser support policy:
      // http://v4-alpha.getbootstrap.com/getting-started/browsers-devices/#supported-browsers
      //
      'Chrome >= 35', // Exact version number here is kinda arbitrary
      // Rather than using Autoprefixer's native "Firefox ESR" version specifier string,
      // we deliberately hardcode the number. This is to avoid unwittingly severely breaking the previous ESR in the event that:
      // (a) we happen to ship a new Bootstrap release soon after the release of a new ESR,
      //     such that folks haven't yet had a reasonable amount of time to upgrade; and
      // (b) the new ESR has unprefixed CSS properties/values whose absence would severely break webpages
      //     (e.g. `box-sizing`, as opposed to `background: linear-gradient(...)`).
      //     Since they've been unprefixed, Autoprefixer will stop prefixing them,
      //     thus causing them to not work in the previous ESR (where the prefixes were required).
      'Firefox >= 31', // Current Firefox Extended Support Release (ESR)
      // Note: Edge versions in Autoprefixer & Can I Use refer to the EdgeHTML rendering engine version,
      // NOT the Edge app version shown in Edge's "About" screen.
      // For example, at the time of writing, Edge 20 on an up-to-date system uses EdgeHTML 12.
      // See also https://github.com/Fyrd/caniuse/issues/1928
      'Edge >= 12', 'Explorer >= 9',
      // Out of leniency, we prefix these 1 version further back than the official policy.
      'iOS >= 8', 'Safari >= 8',
      // The following remain NOT officially supported, but we're lenient and include their prefixes to avoid severely breaking in them.
      'Android 2.3', 'Android >= 4', 'Opera >= 12']
    }
  };

  var Autoprefixer = function (_BaseRecipe) {
    babelHelpers.inherits(Autoprefixer, _BaseRecipe);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function Autoprefixer(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, Autoprefixer);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Autoprefixer).call(this, gulp, preset, extend(true, {}, AutoprefixerDefault, config)));
    }

    babelHelpers.createClass(Autoprefixer, [{
      key: 'run',
      value: function run() {
        var _this2 = this;

        var watching = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        // FIXME: is this right or wrong?  this class initially was extracted for reuse of Default options
        return this.gulp.src(this.config.source).pipe(gulpif(this.config.debug, debug(this.debugOptions()))).pipe(autoprefixer(this.config.options)).on('error', function (error) {
          _this2.notifyError(error, watching);
        }).pipe(this.gulp.dest(this.config.dest));
      }
    }]);
    return Autoprefixer;
  }(BaseRecipe);

  var PluginError = Util.PluginError;

  var Default = {
    debug: false,
    presetType: 'javascripts',
    task: {
      name: 'eslint'
    },
    watch: {
      glob: '**/*.js',
      options: {
        //cwd: ** resolved from preset **
      }
    },
    source: {
      glob: '**/*.js',
      options: {
        //cwd: ** resolved from preset **
      }
    },
    options: {}
  };

  var EsLint = function (_BaseRecipe) {
    babelHelpers.inherits(EsLint, _BaseRecipe);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function EsLint(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, EsLint);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(EsLint).call(this, gulp, preset, extend(true, {}, Default, config)));
    }

    babelHelpers.createClass(EsLint, [{
      key: 'createHelpText',
      value: function createHelpText() {
        return 'Lints ' + this.config.source.options.cwd + '/' + this.config.source.glob;
      }
    }, {
      key: 'run',
      value: function run() {
        var _this2 = this;

        var watching = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        // eslint() attaches the lint output to the "eslint" property of the file object so it can be used by other modules.
        var bundle = this.gulp.src(this.config.source.glob, this.config.source.options).pipe(gulpif(this.config.debug, debug(this.debugOptions()))).pipe(eslint(this.config.options)).pipe(eslint.format()) // outputs the lint results to the console. Alternatively use eslint.formatEach() (see Docs).

        //1. HACK solution that works with first error, but is very ugly
        // this should emit the error, but we aren't notified
        .pipe(gulpif(!watching, eslint.failAfterError())) // To have the process exit with an error code (1) on lint error, return the stream and pipe to failAfterError last.

        // make sure we are notified of any error (this really should be happening in eslint.failAfterError(), but not sure where it is lost)
        .pipe(eslint.result(function (results) {
          // this is single file #result not #results, we don't get notified on #results
          var count = results.errorCount;
          if (count > 0) {
            throw new PluginError('gulp-eslint', {
              message: 'Failed with' + (count === 1 ? ' error' : ' errors')
            });
          }
        })).on('error', function (error) {
          _this2.notifyError(error, watching);
        });

        // 2. Attempt now that returns are in place with the gulpif
        // this should emit the error, but we aren't notified
        //.pipe(gulpif(!watching, eslint.failAfterError())) // To have the process exit with an error code (1) on lint error, return the stream and pipe to failAfterError last.
        //.on('error', (error) => {
        //  this.notifyError(error, watching)
        //})

        //// 3. Attempt now that returns are in place WITHOUT gulpif
        //// this should emit the error, but we aren't notified
        //.pipe( eslint.failAfterError()) // To have the process exit with an error code (1) on lint error, return the stream and pipe to failAfterError last.
        //.on('error', (error) => {
        //  this.notifyError(error, watching)
        //})

        // 4. https://github.com/adametry/gulp-eslint/issues/135#issuecomment-180555978
        //.pipe(eslint.results(function (results) {
        //  var count = results.errorCount;
        //  console.log('Total ESLint Error Count: ' + count);
        //  if (count > 0) {
        //    throw new Error('Failed with Errors');
        //  }
        //}))
        //.on('error', function (error) {
        //  console.log('Total ESLint Error Count: ' + error);
        //})
        //.on('finish', function () {
        //  console.log('eslint.results finished');
        //})
        //.on('end', function () {
        //  console.log('eslint.results ended');
        //})

        //// 5. notification is emitted
        //.pipe(eslint.results(function (results) {
        //  var count = results.errorCount;
        //  console.log('*****Error Count: ' + count);
        //  if (count > 0) {
        //    throw new Error('******My custom error');
        //  }
        //}))
        //.on('error', (error) => {
        //  this.notifyError(error, watching)
        //})

        //// 6. notification is emitted
        //.pipe(eslint.results(function (results) {
        //  var count = results.errorCount;
        //  console.log('*****Error Count: ' + count);
        //  if (count > 0) {
        //    throw new PluginError('******My custom error');
        //  }
        //}))
        //.on('error', (error) => {
        //  this.notifyError(error, watching)
        //})

        //// 7. notification is emitted, except when watching
        //.pipe(eslint.results(function (results) {
        //  let count = results.errorCount;
        //  console.error('****************in results handler')
        //  if (count > 0) {
        //    throw new PluginError('gulp-eslint', { message: 'Failed with ' + count + (count === 1 ? ' error' : ' errors') })
        //  }
        //}))
        //.on('error', (error) => {
        //  console.error('****************in error handler')
        //  this.notifyError(error, watching)
        //})

        //.pipe( eslint.failAfterError())
        //.on('error', (error) => {
        //  this.notifyError(error, watching)
        //})

        // FIXME: even including any remnant of JSCS at this point broke everything through the unfound requirement of babel 5.x through babel-jscs.  I can't tell where this occurred, but omitting gulp-jscs for now gets me past this issue.  Revisit this when there are clear updates to use babel 6
        //.pipe(jscs())      // enforce style guide
        //.pipe(stylish())  // log style errors
        //.pipe(jscs.reporter('fail')) // fail on error

        return bundle;
      }
    }]);
    return EsLint;
  }(BaseRecipe);

  var Default$1 = {
    debug: true,
    presetType: 'images',
    task: {
      name: 'images'
    },
    watch: {
      glob: '**',
      options: {
        //cwd: ** resolved from preset **
      }
    },
    source: {
      // baseDirectories: [] ** resolved from preset **
      glob: '**',
      options: {
        //cwd: ** resolved from preset **
      }
    },
    options: {}
  };

  var Images = function (_BaseRecipe) {
    babelHelpers.inherits(Images, _BaseRecipe);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function Images(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, Images);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Images).call(this, gulp, preset, extend(true, {}, Default$1, config)));

      _this.browserSync = BrowserSync.create();
      return _this;
    }

    babelHelpers.createClass(Images, [{
      key: 'createHelpText',
      value: function createHelpText() {
        return 'Minifies change images from ' + this.config.source.options.cwd + '/' + this.config.source.glob;
      }
    }, {
      key: 'run',
      value: function run() {
        var _this2 = this;

        var watching = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];


        var tasks = this.config.baseDirectories.map(function (baseDirectory) {
          // join the base dir with the relative cwd
          return _this2.runOne(path.join(baseDirectory, _this2.config.source.options.cwd), watching);
        });
        return merge(tasks);
      }
    }, {
      key: 'runOne',
      value: function runOne(cwd, watching) {
        var _this3 = this;

        // setup a run with a single cwd a.k.a base directory FIXME: perhaps this could be in the base recipe? or not?
        var options = extend({}, this.config.source.options);
        options.cwd = cwd;
        this.debug('src: ' + cwd + '/' + this.config.source.glob);

        return this.gulp.src(this.config.source.glob, options).pipe(changed(this.config.dest)) // ignore unchanged files
        .pipe(gulpif(this.config.debug, debug(this.debugOptions()))).pipe(imagemin(this.config.options)).on('error', function (error) {
          _this3.notifyError(error, watching);
        }).pipe(this.gulp.dest(this.config.dest)).pipe(this.browserSync.stream());
      }
    }]);
    return Images;
  }(BaseRecipe);

  var Default$2 = {
    debug: false,
    presetType: 'stylesheets',
    task: {
      name: 'sass'
    },
    watch: {
      glob: '**/*.scss',
      options: {
        //cwd: ** resolved from preset **
      }
    },
    source: {
      glob: ['*.scss', '!_*.scss'],
      options: {
        //cwd: ** resolved from preset **
      }
    },
    options: {
      // WARNING: `includePaths` this should be a fully qualified path if overriding
      //  @see https://github.com/sass/node-sass/issues/1377
      includePaths: [findup('node_modules')] // this will find any node_modules above the current working directory
    },
    // capture defaults from autoprefixer class
    autoprefixer: {
      options: AutoprefixerDefault.options
    }
  };

  var Sass = function (_BaseRecipe) {
    babelHelpers.inherits(Sass, _BaseRecipe);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function Sass(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, Sass);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Sass).call(this, gulp, preset, extend(true, {}, Default$2, config)));

      _this.browserSync = BrowserSync.create();
      return _this;
    }

    babelHelpers.createClass(Sass, [{
      key: 'createHelpText',
      value: function createHelpText() {
        return 'Compiles ' + this.config.source.options.cwd + '/' + this.config.source.glob;
      }
    }, {
      key: 'run',
      value: function run() {
        var _this2 = this;

        var watching = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        // add debug for importing
        if (this.config.debug && this.config.options.importer === undefined) {
          this.debugDump('options', this.config.options);
          this.config.options.importer = function (url, prev, done) {
            _this2.debug('importing ' + url + ' from ' + prev);
            done({ file: url });
          };
        }

        return this.gulp.src(this.config.source.glob, this.config.source.options).pipe(gulpif(this.config.debug, debug(this.debugOptions()))).pipe(sourcemaps.init()).pipe(sass(this.config.options)).on('error', function (error) {
          _this2.notifyError(error, watching);
        }).pipe(autoprefixer(this.config.autoprefixer.options)).pipe(sourcemaps.write()).pipe(this.gulp.dest(this.config.dest)).pipe(this.browserSync.stream());
      }
    }]);
    return Sass;
  }(BaseRecipe);

  var Default$3 = {
    debug: false,
    presetType: 'stylesheets',
    task: {
      name: 'scsslint'
    },
    watch: {
      glob: '**/*.scss',
      options: {
        //cwd: ** resolved from preset **
      }
    },
    source: {
      glob: '**/*.scss',
      options: {
        //cwd: ** resolved from preset **
      }
    },
    options: {
      customReport: scssLintStylish
    }
  };

  var ScssLint = function (_BaseRecipe) {
    babelHelpers.inherits(ScssLint, _BaseRecipe);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function ScssLint(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, ScssLint);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(ScssLint).call(this, gulp, preset, extend(true, {}, Default$3, config)));
    }

    babelHelpers.createClass(ScssLint, [{
      key: 'createHelpText',
      value: function createHelpText() {
        return 'Lints ' + this.config.source.options.cwd + '/' + this.config.source.glob;
      }
    }, {
      key: 'run',
      value: function run() {
        var _this2 = this;

        var watching = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        return this.gulp.src(this.config.source.glob, this.config.source.options).pipe(gulpif(this.config.debug, debug(this.debugOptions()))).pipe(scssLint(this.config.options)).on('error', function (error) {
          _this2.notifyError(error, watching);
        });
      }
    }]);
    return ScssLint;
  }(BaseRecipe);

  var Default$4 = {
    debug: false,
    watch: true
  };

  var TaskSeries = function (_Base) {
    babelHelpers.inherits(TaskSeries, _Base);


    /**
     *
     * @param gulp - gulp instance
     * @param config - customized overrides
     */

    function TaskSeries(gulp, taskName, recipes) {
      var config = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
      babelHelpers.classCallCheck(this, TaskSeries);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(TaskSeries).call(this, gulp, extend(true, {}, Default$4, config)));

      _this.recipes = recipes;
      _this.registerTask(taskName, recipes);

      if (_this.config.watch) {
        _this.registerWatchTask(taskName + ':watch', recipes);
      }
      return _this;
    }

    babelHelpers.createClass(TaskSeries, [{
      key: 'createHelpText',
      value: function createHelpText() {
        var taskNames = this.flattenedRecipes().reduce(function (a, b) {
          return a.concat(b.taskName());
        }, []);

        // use the config to generate the dynamic help
        return 'Runs series [' + taskNames.join(', ') + ']';
      }
    }, {
      key: 'createWatchHelpText',
      value: function createWatchHelpText() {
        var taskNames = this.watchableRecipes().reduce(function (a, b) {
          return a.concat(b.taskName());
        }, []);

        return Util.colors.grey('|___ aggregates watches from [' + taskNames.join(', ') + '] and runs full series');
      }
    }, {
      key: 'registerTask',
      value: function registerTask(taskName) {
        var _this2 = this;

        this.debug('Registering task: ' + Util.colors.green(taskName) + ' for ' + stringify(this.toTaskNames(this.recipes)));
        this.gulp.task(taskName, this.createHelpText(), function () {
          return _this2.run(_this2.recipes);
        });
      }
    }, {
      key: 'flattenedRecipes',
      value: function flattenedRecipes() {
        var _ref;

        return (_ref = []).concat.apply(_ref, babelHelpers.toConsumableArray(this.recipes));
      }
    }, {
      key: 'watchableRecipes',
      value: function watchableRecipes() {
        // create an array of watchable recipes
        var watchableRecipes = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.flattenedRecipes()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var recipe = _step.value;

            if (recipe.config.watch) {
              watchableRecipes.push(recipe);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return watchableRecipes;
      }
    }, {
      key: 'registerWatchTask',
      value: function registerWatchTask(taskName, recipes) {
        var _this3 = this;

        // generate watch task
        this.debug('Registering task: ' + Util.colors.green(taskName));
        this.gulp.task(taskName, this.createWatchHelpText(), function () {

          // watch the watchable recipes and make them #run the series
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = _this3.watchableRecipes()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var recipe = _step2.value;

              _this3.log('[' + Util.colors.green(taskName) + '] watching ' + recipe.taskName() + ' ' + recipe.config.watch.glob + '...');
              _this3.gulp.watch(recipe.config.watch.glob, recipe.config.watch.options, function (event) {
                _this3.log('[' + Util.colors.green(taskName) + '] ' + event.path + ' was ' + event.type + ', running series...');
                return Promise.resolve(_this3.run(recipes)).then(function () {
                  return _this3.log('[' + Util.colors.green(taskName) + '] finished');
                });
              });
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        });
      }
    }, {
      key: 'run',
      value: function run(recipes) {
        // generate the task sequence
        var tasks = this.toTaskNames(recipes);
        return this.runSequence.apply(this, babelHelpers.toConsumableArray(tasks));
      }
    }, {
      key: 'toTaskNames',
      value: function toTaskNames(recipes) {
        var tasks = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = recipes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var recipe = _step3.value;

            if (Array.isArray(recipe)) {
              var series = [];
              this.toTaskNames(recipe, series);
              tasks.push(series);
            } else {
              if (this.config.watch) {
                // if the series is a 'watch', only add 'watch' enabled recipes
                if (recipe.config.watch) {
                  tasks.push(recipe.taskName());
                }
              } else {
                tasks.push(recipe.taskName());
              }
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        return tasks;
      }

      // -----------------------------------
      // originally run-sequence code https://github.com/OverZealous/run-sequence
      // Copyright (c) 2014 [Phil DeJarnett](http://overzealous.com)
      // - Will be unnecessary with gulp 4.0
      // - Forced to include this/modify it as the #use(gulp) binding of the gulp instance didn't work with es class approach

    }, {
      key: 'runSequence',
      value: function runSequence() {
        var _this4 = this;

        for (var _len = arguments.length, taskSets = Array(_len), _key = 0; _key < _len; _key++) {
          taskSets[_key] = arguments[_key];
        }

        this.callBack = typeof taskSets[taskSets.length - 1] === 'function' ? taskSets.pop() : false;
        this.debug('currentTaskSet = null');
        this.currentTaskSet = null;
        this.verifyTaskSets(taskSets);
        this.taskSets = taskSets;

        this.onEnd = function (e) {
          return _this4.onTaskEnd(e);
        };
        this.onErr = function (e) {
          return _this4.onError(e);
        };

        this.gulp.on('task_stop', this.onEnd);
        this.gulp.on('task_err', this.onErr);

        this.runNextSet();
      }
    }, {
      key: 'finish',
      value: function finish(e) {
        this.debugDump('finish', e);
        this.gulp.removeListener('task_stop', this.onEnd);
        this.gulp.removeListener('task_err', this.onErr);

        var error = null;
        if (e && e.err) {
          this.debugDump('finish e', e);
          //error = new Util.PluginError('run-sequence', {
          //  message: `An error occured in task [${e.task}].`
          //})
          error = {
            task: e.task,
            message: e.err,
            plugin: e.plugin || ''
          };
        }

        if (this.callback) {
          this.callback(error);
        } else if (error) {
          //this.log(Util.colors.red(error.toString()))
          this.notifyError(error);
        }
      }
    }, {
      key: 'onError',
      value: function onError(err) {
        this.debugDump('onError', err);
        this.finish(err);
      }
    }, {
      key: 'onTaskEnd',
      value: function onTaskEnd(event) {
        this.debugDump('onTaskEnd', event);
        //this.debugDump(`this.currentTaskSet`, this.currentTaskSet)

        var i = this.currentTaskSet.indexOf(event.task);
        if (i > -1) {
          this.currentTaskSet.splice(i, 1);
        }
        if (this.currentTaskSet.length === 0) {
          this.runNextSet();
        }
      }
    }, {
      key: 'runNextSet',
      value: function runNextSet() {
        if (this.taskSets.length) {
          var command = this.taskSets.shift();
          if (!Array.isArray(command)) {
            command = [command];
          }
          this.debug('currentTaskSet = ' + command);
          this.currentTaskSet = command;
          this.gulp.start(command);
        } else {
          this.finish();
        }
      }
    }, {
      key: 'verifyTaskSets',
      value: function verifyTaskSets(taskSets, skipArrays) {
        var foundTasks = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];


        this.debug('verifyTaskSets: ' + stringify(taskSets));

        if (taskSets.length === 0) {
          throw new Error('No tasks were provided to run-sequence');
        }

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = taskSets[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var t = _step4.value;

            var isTask = typeof t === "string";
            var isArray = !skipArrays && Array.isArray(t);

            if (!isTask && !isArray) {
              throw new Error('Task ' + t + ' is not a valid task string.');
            }

            if (isTask && !this.gulp.hasTask(t)) {
              throw new Error('Task ' + t + ' is not configured as a task on gulp.');
            }

            if (skipArrays && isTask) {
              if (foundTasks[t]) {
                throw new Error('Task ' + t + ' is listed more than once. This is probably a typo.');
              }
              foundTasks[t] = true;
            }

            if (isArray) {
              if (t.length === 0) {
                throw new Error('An empty array was provided as a task set');
              }
              this.verifyTaskSets(t, true, foundTasks);
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }
      }
    }]);
    return TaskSeries;
  }(Base);

  var Default$5 = {
    debug: false,
    presetType: 'javascripts',
    task: {
      name: 'rollup:es'
    },

    watch: {
      glob: '**/*.js',
      options: {
        //cwd: ** resolved from preset **
      }
    },
    //source: { }, ** resolved from preset **
    //dest: '', ** resolved from preset **

    options: {
      //entry: 'src/index.js', // ** resolved from the source glob/cwd **
      //dest: '', // ** resolved from preset **
      sourceMap: true,
      format: 'es6'
      //plugins: [],
    }
  };

  var RollupEs = function (_BaseRecipe) {
    babelHelpers.inherits(RollupEs, _BaseRecipe);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function RollupEs(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, RollupEs);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(RollupEs).call(this, gulp, preset, extend(true, {}, Default$5, config)));
      //this.browserSync = BrowserSync.create()
    }

    babelHelpers.createClass(RollupEs, [{
      key: 'resolveEntry',
      value: function resolveEntry() {
        // Resolve the source and make sure there is one entry point
        if (Array.isArray(this.config.source.glob)) {
          throw new Error('Rollup only accepts one entry point.  Found array for source.glob: ' + this.config.source.glob);
        }
        // get full path results
        this.config.source.options['realpath'] = true;

        var entry = glob.sync(this.config.source.glob, this.config.source.options);

        if (!entry || entry.length <= 0) {
          throw new Error('Unable to resolveEntry() for source: ' + stringify(this.config.source));
        }

        if (entry.length > 1) {
          throw new Error('resolveEntry() should only find one entry point but found ' + entry + ' for source: ' + stringify(this.config.source));
        }
        return entry[0];
      }
    }, {
      key: 'createHelpText',
      value: function createHelpText() {
        return 'Rollup ' + this.config.source.options.cwd + '/' + this.config.source.glob + ' in the ' + this.config.options.format + ' format to ' + this.config.options.dest;
      }
    }, {
      key: 'run',
      value: function run() {
        var _this2 = this;

        var watching = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        var options = extend(true, {
          entry: this.resolveEntry(),
          onwarn: function onwarn(message) {
            //this.notifyError(message, watching)
            _this2.log(message);
          }
        }, this.config.options);

        if (!options.dest) {
          throw new Error('dest must be specified.');
        }

        this.debug('Executing rollup with options: ' + stringify(options));

        return rollup.rollup(options).then(function (bundle) {
          return bundle.write(options);
        }).catch(function (error) {
          error.plugin = 'rollup';
          _this2.notifyError(error, watching);
        });
      }
    }]);
    return RollupEs;
  }(BaseRecipe);

  var Default$6 = {
    task: {
      name: 'rollup:cjs'
    },
    options: {
      //dest: '', // required
      format: 'cjs',
      plugins: [babel({
        babelrc: false,
        presets: ['es2015-rollup']
      })]
    }
  };

  /**
   * ----------------------------------------------
   * Class Definition
   * ----------------------------------------------
   */
  var RollupCjs = function (_RollupEs) {
    babelHelpers.inherits(RollupCjs, _RollupEs);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function RollupCjs(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, RollupCjs);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(RollupCjs).call(this, gulp, preset, extend(true, {}, Default$6, config)));
    }

    return RollupCjs;
  }(RollupEs);

  var Default$7 = {
    task: {
      name: 'rollup:iife'
    },
    options: {
      //dest: '', // required
      format: 'iife'
    }
  };

  /**
   * ----------------------------------------------
   * Class Definition
   * ----------------------------------------------
   */
  var RollupIife = function (_RollupCjs) {
    babelHelpers.inherits(RollupIife, _RollupCjs);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function RollupIife(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, RollupIife);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(RollupIife).call(this, gulp, preset, extend(true, {}, Default$7, config)));
    }

    return RollupIife;
  }(RollupCjs);

  var Default$8 = {
    task: {
      name: 'rollup:amd'
    },
    options: {
      //dest: '', // required
      format: 'amd'
    }
  };

  /**
   * ----------------------------------------------
   * Class Definition
   * ----------------------------------------------
   */
  var RollupAmd = function (_RollupCjs) {
    babelHelpers.inherits(RollupAmd, _RollupCjs);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function RollupAmd(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, RollupAmd);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(RollupAmd).call(this, gulp, preset, extend(true, {}, Default$8, config)));
    }

    return RollupAmd;
  }(RollupCjs);

  var Default$9 = {
    task: {
      name: 'rollup:umd'
    },
    options: {
      //dest: '', // required
      format: 'umd'
    }
  };

  /**
   * ----------------------------------------------
   * Class Definition
   * ----------------------------------------------
   */
  var RollupUmd = function (_RollupCjs) {
    babelHelpers.inherits(RollupUmd, _RollupCjs);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function RollupUmd(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, RollupUmd);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(RollupUmd).call(this, gulp, preset, extend(true, {}, Default$9, config)));
    }

    return RollupUmd;
  }(RollupCjs);

  var Default$16 = {
    debug: false,
    watch: false,
    sync: true // necessary so that tasks can be run in a series, can be overriden for other purposes
  };

  var BaseClean = function (_BaseRecipe) {
    babelHelpers.inherits(BaseClean, _BaseRecipe);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function BaseClean(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, BaseClean);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(BaseClean).call(this, gulp, preset, extend(true, {}, Default$16, config)));
    }

    babelHelpers.createClass(BaseClean, [{
      key: 'createHelpText',
      value: function createHelpText() {
        // use the config to generate the dynamic help
        return 'Cleans ' + this.config.dest;
      }
    }, {
      key: 'run',
      value: function run() {
        var _this2 = this;

        var watching = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        if (this.config.sync) {
          var paths = del.sync(this.config.dest);
          this.logDeleted(paths);
        } else {
          return del(this.config.dest).then(function (paths) {
            _this2.logDeleted(paths);
          }).catch(function (error) {
            error.plugin = 'del';
            _this2.notifyError(error, watching);
          });
        }
      }
    }, {
      key: 'logDeleted',
      value: function logDeleted(paths) {
        if (paths.length > 0) {
          this.log('Deleted files and folders:');
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = paths[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var path = _step.value;

              this.log('    ' + path);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    }]);
    return BaseClean;
  }(BaseRecipe);

  var Default$10 = {
    presetType: 'images',
    task: {
      name: 'clean:images'
    }
  };

  var CleanImages = function (_BaseClean) {
    babelHelpers.inherits(CleanImages, _BaseClean);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function CleanImages(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, CleanImages);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(CleanImages).call(this, gulp, preset, extend(true, {}, Default$10, config)));
    }

    return CleanImages;
  }(BaseClean);

  var Default$11 = {
    presetType: 'stylesheets',
    task: {
      name: 'clean:stylesheets'
    }
  };

  var CleanStylesheets = function (_BaseClean) {
    babelHelpers.inherits(CleanStylesheets, _BaseClean);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function CleanStylesheets(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, CleanStylesheets);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(CleanStylesheets).call(this, gulp, preset, extend(true, {}, Default$11, config)));
    }

    return CleanStylesheets;
  }(BaseClean);

  var Default$12 = {
    presetType: 'javascripts',
    task: {
      name: 'clean:javascripts'
    }
  };

  var CleanJavascripts = function (_BaseClean) {
    babelHelpers.inherits(CleanJavascripts, _BaseClean);


    /**
     *
     * @param gulp - gulp instance
     * @param preset - base preset configuration - either one from preset.js or a custom hash
     * @param config - customized overrides for this recipe
     */

    function CleanJavascripts(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, CleanJavascripts);
      return babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(CleanJavascripts).call(this, gulp, preset, extend(true, {}, Default$12, config)));
    }

    return CleanJavascripts;
  }(BaseClean);

  var Default$13 = {
    debug: false,
    watch: false,
    presetType: 'macro',
    task: {
      name: 'clean',
      help: 'Cleans images, stylesheets, and javascripts.'
    }
  };

  var Clean = function (_BaseRecipe) {
    babelHelpers.inherits(Clean, _BaseRecipe);


    /**
     *
     * @param gulp - gulp instance
     * @param config - customized overrides
     */

    function Clean(gulp, preset) {
      var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
      babelHelpers.classCallCheck(this, Clean);

      var _this = babelHelpers.possibleConstructorReturn(this, Object.getPrototypeOf(Clean).call(this, gulp, preset, extend(true, {}, Default$13, config)));

      _this.cleanImages = new CleanImages(gulp, preset);
      _this.cleanStylesheets = new CleanStylesheets(gulp, preset);
      _this.cleanJavascripts = new CleanJavascripts(gulp, preset);
      return _this;
    }

    babelHelpers.createClass(Clean, [{
      key: 'run',
      value: function run() {
        this.cleanImages.run();
        this.cleanStylesheets.run();
        this.cleanJavascripts.run();
      }
    }]);
    return Clean;
  }(BaseRecipe);

  exports.Preset = Preset;
  exports.Rails = Rails;
  exports.Autoprefixer = Autoprefixer;
  exports.EsLint = EsLint;
  exports.Images = Images;
  exports.Sass = Sass;
  exports.ScssLint = ScssLint;
  exports.TaskSeries = TaskSeries;
  exports.RollupEs = RollupEs;
  exports.RollupCjs = RollupCjs;
  exports.RollupIife = RollupIife;
  exports.RollupAmd = RollupAmd;
  exports.RollupUmd = RollupUmd;
  exports.CleanImages = CleanImages;
  exports.CleanStylesheets = CleanStylesheets;
  exports.CleanJavascripts = CleanJavascripts;
  exports.Clean = Clean;

}));
//# sourceMappingURL=gulp-pipeline.umd.js.map