import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './components/app/app';
import ErrorBoundry from './components/error-boundry/error-boundry';
import EnglishForKidsService from './services/english-for-kids-service';
import { EnglishForKidsProvider } from './components/english-for-kids-service-context/english-for-kids-service-context';

import 'normalize.css';
import store from './store';

const englishForKidsService = new EnglishForKidsService();

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundry>
      <EnglishForKidsProvider value={englishForKidsService}>
        <Router>
          <App />
        </Router>
      </EnglishForKidsProvider>
    </ErrorBoundry>
  </Provider>,
  document.getElementById('root'),
);
