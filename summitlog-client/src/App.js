import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import NavBar from "./components/NavBar";
import themeFile from "./util/theme";
import jwtDecode from "jwt-decode";
import AuthRoute from "./util/AuthRoute";

/**
 * Import the pages needed
 */
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

const theme = createMuiTheme(themeFile);

let authenticated;
const token = localStorage.FBIdToken;
if (token) {
  const decodedToken = jwtDecode(token);
  //console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    window.location.href = "/login";
    authenticated = false;
  } else {
    authenticated = true;
  }
}

class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className="App">
          <Router>
            <NavBar />
            <div className="container">
              <Switch>
                <AuthRoute exact path="/" component={home} />
                <AuthRoute
                  exact
                  path="/login"
                  component={login}
                  authenticated={authenticated}
                />
                <AuthRoute
                  exact
                  path="/signup"
                  component={signup}
                  authenticated={authenticated}
                />
              </Switch>
            </div>
          </Router>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
