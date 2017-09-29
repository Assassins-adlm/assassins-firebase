import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import Main from './Main';
import { BrowserRouter as Router } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider >
    <Router>
      <Main />
    </Router>
  </Provider>,
  document.getElementById('root'));
registerServiceWorker();
