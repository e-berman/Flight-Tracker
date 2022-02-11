import React from 'react';
import { BrowserRouter as Router,
         Routes,
         Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import ResultsPage from './pages/ResultsPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' exact element={<HomePage/>}/>
          <Route path='/results' element={<ResultsPage/>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
