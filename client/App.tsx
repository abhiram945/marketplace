
import React from 'react';
import { HashRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <HashRouter basename='/marketplace'>
      <AppRouter />
    </HashRouter>
  );
}

export default App;
