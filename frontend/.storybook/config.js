import { configure } from '@storybook/react';

// automatically import all files ending in *.bs.js
const req = require.context('../src/stories', true, /_stories\.bs\.js$/)
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
