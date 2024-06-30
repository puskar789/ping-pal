import React from "react";
import { FaGoogle } from "react-icons/fa";
import { app } from "../../firebase/firebase.js";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import useGoogleAuth from "../../hooks/useGoogleAuth.js";
import toast from "react-hot-toast";

const OAuth = ({ gender }) => {
  const auth = getAuth(app);
  const { loading, googleAuth } = useGoogleAuth();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    // to always ask the user to select an account
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      if (gender === "") {
        return toast.error("Please select your gender");
      }

      const result = await signInWithPopup(auth, provider);
      // console.log(result);
      await googleAuth(
        result.user.email,
        result.user.displayName,
        result.user.photoURL,
        gender
      );
    } catch (error) {
      console.log("error in OAuth");
    }
  };

  return (
    <button
      className="btn btn-block btn-sm mt-2 border border-slate-700 bg-gradient-to-r from-fuchsia-600 to-pink-600"
      type="button"
      onClick={handleGoogleClick}
      disabled={loading}
    >
      {!loading ? (
        "Continue With Google"
      ) : (
        <span className="loading loading-spinner"></span>
      )}
      <FaGoogle />
    </button>
  );
};

export default OAuth;
