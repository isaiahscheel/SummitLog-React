import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ
} from "../types";
import Axios from "axios";

/**
 * An action that logs a user in using an axios post request to
 * the firebase backend.
 * @param {The user's data in an object} userData
 * @param {The state history} history
 */
export const loginUser = (userData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  Axios.post("/login", userData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

/**
 * An action to sign a new user up using an axios post request to
 * the Firebase backend.
 * @param {Data to create the new user} newUserData
 * @param {The state's history property} history
 */
export const signupUser = (newUserData, history) => dispatch => {
  dispatch({ type: LOADING_UI });
  Axios.post("/signup", newUserData)
    .then(res => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch(err => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

/**
 * Action to log a user out
 */
export const logoutUser = () => dispatch => {
  localStorage.removeItem("FBIdToken");
  delete Axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

/**
 * An action to get a user's data
 */
export const getUserData = () => dispatch => {
  dispatch({ type: LOADING_USER });
  Axios.get("/user")
    .then(res => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch(err => console.log(err));
};

/**
 * A helper method to set the headers of an axios request
 * to make sure the request's are secure.
 * @param {*} token
 */
const setAuthorizationHeader = token => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  Axios.defaults.headers.common["Authorization"] = FBIdToken;
};
