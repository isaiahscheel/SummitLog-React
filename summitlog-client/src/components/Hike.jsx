import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import PropTypes from "prop-types";

/**
 * Material Imports
 */
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
//import Button from "@material-ui/core/Button";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import ChatIcon from "@material-ui/icons/Chat";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

import { connect } from "react-redux";

import { likeHike, unlikeHike } from "../redux/actions/dataActions";
import MyButton from "../util/MyButton";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: "cover"
  }
};

export class Hike extends Component {
  likedHike = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(like => like.hikeId === this.props.hike.hikeId)
    )
      return true;
    else return false;
  };
  likeHike = () => {
    this.props.likeHike(this.props.hike.hikeId);
  };
  unlikeHike = () => {
    this.props.unlikeHike(this.props.hike.hikeId);
  };
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      hike: {
        body,
        createdAt,
        userImage,
        userHandle,
        hikeId,
        likeCount,
        commentCount
      },
      user: { authenticated }
    } = this.props;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="primary" />
        </MyButton>
      </Link>
    ) : this.likedHike() ? (
      <MyButton tip="Undo like" onClick={this.unlikeHike}>
        <FavoriteIcon color="primary" />
      </MyButton>
    ) : (
      <MyButton tip="Like" onClick={this.likeHike}>
        <FavoriteBorder color="primary" />
      </MyButton>
    );

    return (
      <Card className={classes.card}>
        <CardMedia
          className={classes.image}
          image={userImage}
          title="Profile image"
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
          <span>{likeCount} likes</span>
          <MyButton tip="Comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
        </CardContent>
      </Card>
    );
  }
}

Hike.propTypes = {
  user: PropTypes.object.isRequired,
  hike: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  openDialog: PropTypes.bool,
  likeHike: PropTypes.func.isRequired,
  unlikeHike: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likeHike,
  unlikeHike
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Hike));
