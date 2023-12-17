import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const auth = getAuth();
  useEffect(() => {
    let myListener = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      console.log("onAuthStateChanged", user);
      setLoadingUser(false);
<<<<<<< Updated upstream
=======

      if (isMounted && user) {
        const signOutTimer = setTimeout(() => {
          signOut(auth)
            .then(() => {
              setCurrentUser(null);
            })
            .catch((error) => {
              console.error("Error during sign out:", error);
            });
        }, 10 * 10 * 1000); // 10 mins automatically sign out

        return () => {
          clearTimeout(signOutTimer);
        };
      }
>>>>>>> Stashed changes
    });
    return () => {
      if (myListener) myListener();
    };
  }, []);

  if (loadingUser) {
    return (
      <div>
        <h1>Loading....Loading....Loading....Loading....Loading....</h1>
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
