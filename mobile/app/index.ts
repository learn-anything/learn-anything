import { Application } from '@nativescript/core';
import { render } from '@nativescript-community/solid-js';
import { App } from './app';
import { document } from 'dominative';

document.body.actionBarHidden = true;
document.body.appendChild(document.createElement('ContentView'));

render(App, document.body.firstElementChild);

const create = () => document;

Application.run({ create });
