import {getVersion} from './getVersion.mjs';

/**
 * Somehow inject app version to vite build context
 * @return {import('vite').Plugin}
 */
export const injectAppVersion = () => ({
  name: 'inject-version',
  config: () => {
    // TODO: Find better way to inject app version
    process.env.VITE_APP_VERSION = getVersion();
  },
});
