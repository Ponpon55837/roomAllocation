import path from 'path';
import { merge } from 'webpack-merge';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';
import baseConfig from './webpack.base';

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

const host = '127.0.0.1';
const port = '3000';

const devConfig: Configuration = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    host,
    port,
    open: true,
    compress: false,
    hot: true,
    historyApiFallback: true,
    setupExitSignals: true,
    static: {
      directory: path.join(__dirname, '../public'),
    },
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
});

export default devConfig;
