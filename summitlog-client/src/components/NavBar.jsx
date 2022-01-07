import React, { Component, Fragment } from "react";
//import { Link } from "react-router-dom";
import { HashRouter, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";

//Material Design Imports
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import HomeIcon from "@material-ui/icons/Home";
import AddIcon from "@material-ui/icons/Add";
import NotificationIcon from "@material-ui/icons/Notifications";
import { Typography } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

export class Navbar extends Component {
  render() {
    const { authenticated } = this.props;
    return (
      <AppBar>
        <Toolbar className="nav-container">
          {authenticated ? (
            <Fragment>
              <Link to="/">
                <MyButton tip="Add Hike">
                  <AddIcon color="secondary" />
                </MyButton>
                <MyButton tip="Home">
                  <HomeIcon color="secondary" />
                </MyButton>
                <MyButton tip="Notifications">
                  <NotificationIcon color="secondary" />
                </MyButton>
              </Link>
            </Fragment>
          ) : (
            <Fragment>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Signup
              </Button>
            </Fragment>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Navbar.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

export default connect(mapStateToProps)(Navbar);
