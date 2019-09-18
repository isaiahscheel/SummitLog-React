import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/logo.png";
import Axios from "axios";
import { Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  ...theme.formStyle
});

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
      errors: {}
    };
  }
  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    //this.props.loginUser(userData, this.props.history);
    Axios.post("/login", userData)
      .then(res => {
        console.log(res.data);
        localStorage.setItem("FBIdToken", `Bearer ${res.data.token}`);
        this.setState({
          loading: false
        });
        this.props.history.push("/");
      })
      .catch(err => {
        this.setState({
          errors: err.response.data,
          loading: false
        });
        console.log(this.errors);
      });
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    const { classes } = this.props;
    const { loading, errors } = this.state;
    return (
      <Grid container className={classes.form}>
        <Grid item sm />
        <Grid item sm>
          <img className={classes.logo} src={AppIcon} alt="Icon" />
          <Typography variant="h2" className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            <TextField
              id="email"
              name="email"
              type="email"
              label="email"
              className={classes.textField}
              value={this.state.email}
              helperText={errors.email}
              error={errors.email ? true : false}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              id="password"
              name="password"
              type="password"
              label="Password"
              className={classes.textField}
              value={this.state.password}
              helperText={errors.password}
              error={errors.password ? true : false}
              onChange={this.handleChange}
              fullWidth
            />
          </form>
          {errors.general && (
            <Typography variant="body2" className={classes.customError}>
              {errors.general}
            </Typography>
          )}
          <Fab
            onClick={this.handleSubmit}
            variant="extended"
            color="primary"
            className={classes.button}
            disabled={loading}
          >
            Let me In!
            {loading && (
              <CircularProgress size={30} className={classes.progress} />
            )}
          </Fab>
          <br />
          <small>
            Dont have an account? Sign up <Link to="/signup">here</Link>
          </small>
        </Grid>
        <Grid item sm />
      </Grid>
    );
  }
}

login.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(login);
