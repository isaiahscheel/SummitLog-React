import {
  SET_HIKES,
  LOADING_DATA,
  LIKE_HIKE,
  UNLIKE_HIKE,
  DELETE_HIKE,
  SET_ERRORS,
  POST_HIKE,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_HIKE,
  STOP_LOADING_UI,
  SUBMIT_COMMENT
} from "../types";
import axios from "axios";

// Get all hikes
export const getHikes = () => dispatch => {
  console.log("getHikes");
  dispatch({ type: LOADING_DATA });
  axios
    .get("/hikes")
    .then(res => {
      dispatch({
        type: SET_HIKES,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: SET_HIKES,
        payload: []
      });
    });
};
export const getHike = hikeId => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/hike/${hikeId}`)
    .then(res => {
      dispatch({
        type: SET_HIKE,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch(err => console.log(err));
};
// Post a hike
export const postHike = newHike => dispatch => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/hike", newHike)
    .then(res => {
      dispatch({
        type: POST_HIKE,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
// Like a hike
export const likeHike = hikeId => dispatch => {
  axios
    .post(`/hike/${hikeId}/like`)
    .then(res => {
      dispatch({
        type: LIKE_HIKE,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
// Unlike a hike
export const unlikeHike = hikeId => dispatch => {
  axios
    .post(`/hike/${hikeId}/unlike`)
    .then(res => {
      dispatch({
        type: UNLIKE_HIKE,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};
// Submit a comment
export const submitComment = (hikeId, commentData) => dispatch => {
  axios
    .post(`/hike/${hikeId}/comment`, commentData)
    .then(res => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data
      });
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};
export const deleteHike = hikeId => dispatch => {
  axios
    .delete(`/hike/${hikeId}`)
    .then(() => {
      dispatch({ type: DELETE_HIKE, payload: hikeId });
    })
    .catch(err => console.log(err));
};

export const getUserData = userHandle => dispatch => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then(res => {
      dispatch({
        type: SET_HIKES,
        payload: res.data.hikes
      });
    })
    .catch(() => {
      dispatch({
        type: SET_HIKES,
        payload: null
      });
    });
};

export const clearErrors = () => dispatch => {
  dispatch({ type: CLEAR_ERRORS });
};
