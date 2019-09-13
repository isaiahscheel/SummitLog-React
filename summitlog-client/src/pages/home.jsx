import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";

import Hike from '../components/Hike'

class home extends Component {
  state = {
    hikes: null
  };
  componentDidMount() {
    axios
      .get("/hikes")
      .then(res => {
        console.log(res.data);
        this.setState({
          hikes: res.data
        });
      })
      .catch(err => console.log(err));
  }
  render() {
    let recentHikes = this.state.hikes ? (
      this.state.hikes.map(hike => <Hike hike={hike} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={6}>
        <Grid item sm={8} xs={12}>
          {recentHikes}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile...</p>
        </Grid>
      </Grid>
    );
  }
}

export default home;
