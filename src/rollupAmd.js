import RollupCjs from './rollupCjs'
import extend from 'extend'

export const Default = {
  task: {
    name: 'rollup:amd'
  },
  options: {
    //dest: '', // required
    format: 'amd'
  }
}

/**
 * ----------------------------------------------
 * Class Definition
 * ----------------------------------------------
 */
const RollupAmd = class extends RollupCjs {

  /**
   *
   * @param gulp - gulp instance
   * @param preset - base preset configuration - either one from preset.js or a custom hash
   * @param config - customized overrides for this recipe
   */
  constructor(gulp, preset, config = {}) {
    super(gulp, preset, extend(true, {}, Default, config))
  }
}

export default RollupAmd
