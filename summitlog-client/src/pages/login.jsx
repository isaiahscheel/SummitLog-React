import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import AppIcon from "../images/logo.png";
import Axios from 'axios';

import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Fab from '@material-ui/core/Fab';

const styles = {
  form: {
    textAlign: "center"
  },
  logo: {
    width: "auto",
    height: "25%",
    margin: "20px auto 20px auto"
  },
  pageTitls: {
    margin: "20px auto 20px auto"
  },
  textField: {
    margin: "10px auto 10px auto"
  },
  button: {
    margintop: 20
  },
  customError: {
      color: 'red',
      fontSize: '0.8rem',
      marginTop: '10px',
      marginBottom: '10px'
  }
};

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
    }
    //this.props.loginUser(userData, this.props.history);
    Axios.post('/login', userData)
        .then( res => {
            console.log(res.data);
            this.setState({
                loading: false
            })
            this.props.history.push('/');
        })
        .catch(err => {
            this.setState({
                errors: err.response.data,
                loading: false
            })
            console.log(this.errors);
        })
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };
  render() {
    const { classes } = this.props;
    const { loading, errors} = this.state;
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
              helperText = {errors.email}
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
              helperText = {errors.password}
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
          >Let me In!</Fab>
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
