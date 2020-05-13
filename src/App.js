import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route} from "react-router-dom";
import FilmsList from './components/FilmList'
import Add from './components/Add'
import Edit from './components/Edit'

function App() {
  return (
    <Router>
      <div >
        <Route exact path="/"  component={FilmsList } />
        <Route  path="/add"  component={Add } />
        <Route  path="/edit/:id"  component={Edit } />
      </div>
    </Router>
  );
}

export default App;
