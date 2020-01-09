import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { launch } from '@sencha/ext-react'
import App from './App'
import './themer.js'
import '../.ext-reactrc';
import authenticate from './Authenticate';
import {ExtReact} from '@sencha/ext-react';
var token = authenticate();

let viewport;

Ext.require([
  'Ext.layout.*',
])

launch(
  <ExtReact>
    <App token = {token} />
  </ExtReact>
);

window.Spotify = {};
// const render = (Component, target) => {
//   ReactDOM.render(
//     <ExtReact>
//       <AppContainer>
//         <Component token = {token} />
//       </AppContainer>
//     </ExtReact>,
//     target
//   )
// }

// launch(target => render(App, viewport = target));

// if (module.hot) {
//   module.hot.accept('./App', () => render(App, viewport));
// }

//go({element:App, callback: render});