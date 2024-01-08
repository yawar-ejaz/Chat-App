import React, { useEffect, useReducer } from "react";

const AuthContext = React.createContext({
  user: {
    _id: null,
    name: null,
    email: null,
    picture: null,
    token: null,
  },
  dispatch: () => {},
});

const ACTIONS = {
  LOGIN: "login-the-user",
  LOGOUT: "logout-the-user",
};

const authReducer = (state, action) => {
  if (action.type === ACTIONS.LOGIN) {
    localStorage.setItem("userInfo", JSON.stringify(action.payload));
    return { user: action.payload };
  } else if (action.type === ACTIONS.LOGOUT) {
    localStorage.removeItem("userInfo");
    return { user: null };
  } else {
    return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    dispatch: () => {},
  });

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      dispatch({
        type: ACTIONS.LOGIN,
        payload: userInfo,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, ACTIONS, authReducer, AuthContextProvider };
