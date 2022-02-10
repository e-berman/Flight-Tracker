import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <>
    <Router>
      <Route path='/' exact component={HomePage}/>
      <Route path='/results' component={ResultsPage}/>
    </Router>
    </>
  );
}

export default App;
