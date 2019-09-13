import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import NavBar from "./components/NavBar";

/**
 * Import the pages needed
 */
import home from "./pages/home";
import login from "./pages/login";
import signup from "./pages/signup";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#39796b',
      main: '#004d40',
      dark: '#00251a',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#ffff72',
      main: '#ffeb3b',
      dark: '#c8b900',
      contrastText: '#000000',
    },
  },
});

class App extends Component {
  render(){
  return (
    <MuiThemeProvider theme={theme}>
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
    </MuiThemeProvider>
  );
  }
}

export default App;
