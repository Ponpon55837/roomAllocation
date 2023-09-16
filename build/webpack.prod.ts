import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';
import baseConfig from './webpack.base';

const prodConfig: Configuration = merge(baseConfig, {
  mode: 'production',
});

export default prodConfig;
