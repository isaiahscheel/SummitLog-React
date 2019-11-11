import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import PropTypes from "prop-types";

import Hike from "../components/Hike";
import Profile from "../components/Profile";

import { connect } from "react-redux";
import { getHikes } from "../redux/actions/dataActions";

class home extends Component {
  componentDidMount() {
    this.props.getHikes();
  }
  render() {
    const { hikes, loading } = this.props.data;
    let recentHikes = !loading ? (
      hikes.map(hike => <Hike key={hike.hikeId} hike={hike} />)
    ) : (
      <p>Loading...</p>
    );
    return (
      <Grid container spacing={6}>
        <Grid item sm={8} xs={12}>
          {recentHikes}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  getHikes: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

export default connect(
  mapStateToProps,
  { getHikes }
)(home);
