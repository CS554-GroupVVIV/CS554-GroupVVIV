import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const auth = getAuth();

  // useEffect(() => {
  //   let myListener = onAuthStateChanged(auth, (user) => {
  //     setCurrentUser(user);
  //     console.log("onAuthStateChanged", user);
  //     setLoadingUser(false);
  //   });
  //   return () => {
  //     if (myListener) myListener();
  //   };
  // }, []);

  useEffect(() => {
    let isMounted = true;

    const myListener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingUser(false);

      if (isMounted && user) {
        const signOutTimer = setTimeout(() => {
          signOut(auth)
            .then(() => {
              setCurrentUser(null);
            })
            .catch((error) => {
              console.error("Error during sign out:", error);
            });
        }, 60 * 60 * 1000);

        return () => {
          clearTimeout(signOutTimer);
        };
      }
    });

    return () => {
      isMounted = false;
      if (myListener) myListener();
    };
  }, [auth]);

  if (loadingUser) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
