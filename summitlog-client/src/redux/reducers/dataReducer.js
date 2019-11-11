import {
  SET_HIKES,
  LIKE_HIKE,
  UNLIKE_HIKE,
  LOADING_DATA,
  DELETE_HIKE,
  POST_HIKE,
  SET_HIKE,
  SUBMIT_COMMENT
} from "../types";

const initialState = {
  hikes: [],
  hike: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_HIKES:
      return {
        ...state,
        hikes: action.payload,
        loading: false
      };
    case SET_HIKE:
      return {
        ...state,
        hike: action.payload
      };
    case LIKE_HIKE:
    case UNLIKE_HIKE:
      let index = state.hikes.findIndex(
        hike => hike.hikeId === action.payload.hikeId
      );
      state.hikes[index] = action.payload;
      if (state.hike.hikeId === action.payload.hikeId) {
        state.hike = action.payload;
      }
      return {
        ...state
      };
    case DELETE_HIKE:
      index = state.hikes.findIndex(hike => hike.hikeId === action.payload);
      state.hikes.splice(index, 1);
      return {
        ...state
      };
    case POST_HIKE:
      return {
        ...state,
        hikes: [action.payload, ...state.hikes]
      };
    case SUBMIT_COMMENT:
      return {
        ...state,
        hike: {
          ...state.hike,
          comments: [action.payload, ...state.hike.comments]
        }
      };
    default:
      return state;
  }
}
