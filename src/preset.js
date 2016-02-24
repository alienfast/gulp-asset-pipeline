import extend from 'extend'
import Rails from './rails'
import stringify from 'stringify-object'
//import Util from 'gulp-util'

// NOTE: `source` and `watch` are node-glob options hashes. e.g. gulp.src(source.glob, source.options)

// Baseline is the simplest possible.  Take caution in modifying this one or make sure your platform preset overrides everything necessary.
const Baseline = {
  javascripts: {
    source: {
      glob: 'index.js',
      options: {cwd: 'src'},
      all: '**/*.js'
    },
    test: {
      options: {cwd: 'test'}
    },
    watch: {options: {cwd: 'src'}},
    dest: 'dist'
  },
  stylesheets: {
    source: {
      glob: ['*.scss', '!_*.scss'],  // do not compile all files, only non-underscored files
      options: {cwd: 'src'},
      all: '**/*.scss'
    },
    watch: {
      glob: '**/*.scss',
      options: {cwd: 'src'}
    },
    dest: 'dist'
  },
  images: {
    source: {options: {cwd: 'images'}},
    watch: {options: {cwd: 'images'}},
    dest: 'dist'
  },
  digest: {
    source: {options: {cwd: 'dist'}},
    watch: {options: {cwd: 'dist'}},
    dest: 'dist/digest'
  }
}

const PresetNodeSrc = {}

const PresetNodeLib = {
  javascripts: {
    source: {
      options: {cwd: 'lib'}
    },
    watch: {options: {cwd: 'lib'}}
  },
  stylesheets: {
    source: {options: {cwd: 'lib'}},
    watch: {options: {cwd: 'lib'}}
  },
  images: {
    source: {options: {cwd: 'lib'}},
    watch: {options: {cwd: 'lib'}},
  }
}

// Rails, the oddball from a structure consideration
const railsJs = 'app/assets/javascripts'
const railsSs = 'app/assets/stylesheets'
const railsImages = 'app/assets/images'
const railsDest = 'public/assets/debug'
const PresetRails = {
  javascripts: {
    source: {
      glob: 'application.js',
      options: {cwd: railsJs}
    },
    watch: {options: {cwd: railsJs}},
    dest: railsDest
  },
  stylesheets: {
    source: {options: {cwd: railsSs}},
    watch: {options: {cwd: railsSs}},
    dest: railsDest
  },
  images: {
    source: {options: {cwd: railsImages}},
    watch: {options: {cwd: railsImages}},
    dest: railsDest
  },
  digest: {
    source: {options: {cwd: railsDest}},
    watch: {options: {cwd: railsDest}},
    dest: 'public/assets/digest'
  }
}


const Preset = class {
  static nodeLib(overrides = {}) {
    return extend(true, {}, Baseline, PresetNodeLib, overrides)
  }

  static nodeSrc(overrides = {}) {
    return extend(true, {}, Baseline, PresetNodeSrc, overrides)
  }

  static rails(overrides = {}) {

    return extend(true, {}, Baseline, PresetRails, Rails.baseDirectories(), overrides)
  }

  /**
   * Helper to quickly resolve the config from preset based on the presetType
   *
   * @param preset
   * @param configs - ordered set of overrides
   * @returns {source, watch, dest}
   */
  static resolveConfig(preset, ...configs) {
    if (!preset) {
      throw new Error(`Preset must be specified.  Please use one from the preset.js or specify a custom preset configuration.`)
    }

    let configOverrides = extend(true, {}, ...configs)
    //Util.log(`config before typeConfig: \n${stringify(configOverrides)}`)

    if (!configOverrides || !configOverrides.presetType) {
      throw new Error(`presetType must be specified in the config (usually the Default config).  See preset.js for a list of types such as javascripts, stylesheets, etc.`)
    }

    let typeConfig = null
    if (configOverrides.presetType !== 'macro') {
      typeConfig = preset[configOverrides.presetType]
      if (!typeConfig) {
        throw new Error(`Unable to resolve configuration for presetType: ${configOverrides.presetType} from preset: ${stringify(preset)}`)
      }
    }
    else {
      typeConfig = {}
    }

    // now that we've determined the typeConfig, overlay the overrides
    let resolved = extend(true, {}, typeConfig, configOverrides)

    //Util.log(`resolved config with preset: \n${stringify(resolved)}`)
    return resolved
  }
}
export default Preset
