import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "firebase/auth";

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  const auth = getAuth();
  let user;
  await createUserWithEmailAndPassword(auth, email, password).then(
    (userCredential) => {
      user = userCredential.user;
    }
  );
  await updateProfile(auth.currentUser, {
    displayName: displayName,
  });
  return user;
}

async function doChangePassword(email, oldPassword, newPassword) {
  const auth = getAuth();
  let credential = EmailAuthProvider.credential(email, oldPassword);
  console.log(credential);
  await reauthenticateWithCredential(auth.currentUser, credential);

  await updatePassword(auth.currentUser, newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  let auth = getAuth();
  await signInWithEmailAndPassword(auth, email, password);
}

async function doSocialSignIn() {
  let auth = getAuth();
  let socialProvider = new GoogleAuthProvider();
  await signInWithPopup(auth, socialProvider);
}

async function doPasswordReset(email) {
  let auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

async function doSignOut() {
  let auth = getAuth();
  await signOut(auth);
}

async function updateUserProfile(displayName, oldEmail, newEmail, password) {
  let auth = getAuth();
  let credential = EmailAuthProvider.credential(oldEmail, password);
  console.log(credential);
  await reauthenticateWithCredential(auth.currentUser, credential);
  await verifyBeforeUpdateEmail(auth.currentUser, newEmail)
    .then(function () {
      alert(
        "Email verification sent! Please click the provided link in the new email to complete the update process!"
      );
    })
    .catch(function (error) {
      alert(error);
    });
  await updateProfile(auth.currentUser, {
    displayName: displayName,
  });
  await signOut(auth);
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSignOut,
  doChangePassword,
  updateUserProfile,
};
