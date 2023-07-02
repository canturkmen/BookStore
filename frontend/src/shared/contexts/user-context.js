import React, { useCallback, useState } from "react";

export const UserContext = React.createContext({
  user: {},
  isLoggedIn: false,
  login: (user) => {},
  logout: () => {},
});

export const UserProvider = (props) => {
  const [user, setUser] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const loginHandler = useCallback(
    (newUser) => {
      setUser(newUser);
      setIsLoggedIn(true);
      
    },
    []
  );

  const logoutHandler = useCallback((newUser) => {
    setUser({});
    setIsLoggedIn(false);
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
  }, []);

  const userContext = {
    user: user,
    isLoggedIn: isLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return (
    <UserContext.Provider value={userContext}>
      {props.children}
    </UserContext.Provider>
  );
};
