import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import NavBar from "./components/NavBar";

/**
 * Import the pages needed
 */
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

function App() {
  return (
    <div className="App">
      <Router>
        <NavBar />
        <div className="container">
          <Switch>
            <Route exact path="/" component={home} />
            <Route exact path="/login" component={login} />
            <Route exact path="/signup" component={signup} />
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
